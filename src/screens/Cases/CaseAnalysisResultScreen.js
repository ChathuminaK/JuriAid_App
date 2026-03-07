import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator, Modal, Platform,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { saveReport } from '../../redux/slices/reportsSlice';
import { log } from '../../api/index';
import pastCaseService from '../../api/pastcase';
import lawStatKGService from '../../api/lawstatkg';

// ── PDF packages (safe import) ─────────────────────────────────────────────
let RNHTMLtoPDF = null;
let FileViewer  = null;
try { RNHTMLtoPDF = require('react-native-html-to-pdf').default; } catch (e) { log.warn('[CaseAnalysisResultScreen] react-native-html-to-pdf not installed'); }
try { FileViewer  = require('react-native-file-viewer').default; } catch (e) { log.warn('[CaseAnalysisResultScreen] react-native-file-viewer not installed'); }

// ─── Markdown renderer (## header, **bold**) ──────────────────────────────
const renderFormattedText = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => {
    if (line.startsWith('## '))
      return <Text key={i} style={styles.mdHeader}>{line.replace('## ', '')}</Text>;
    if (line.startsWith('### '))
      return <Text key={i} style={styles.mdSubHeader}>{line.replace('### ', '')}</Text>;
    if (line.trim() === '')
      return <Text key={i} style={styles.mdSpacer}>{' '}</Text>;
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <Text key={i} style={styles.mdText}>
        {parts.map((part, j) =>
          part.startsWith('**') && part.endsWith('**')
            ? <Text key={j} style={styles.mdBold}>{part.slice(2, -2)}</Text>
            : <Text key={j}>{part}</Text>
        )}
        {'\n'}
      </Text>
    );
  });
};

// ─── Case text renderer (numbered paragraphs + sub-items) ─────────────────
const renderCaseText = (text) => {
  if (!text) return null;
  const lines = text.split('\n').filter((l) => l.trim() !== '');
  return lines.map((line, i) => {
    const numberedMatch = line.match(/^(\d+\.[\u200b\t ]?)\s*(.*)/);
    const subItemMatch  = line.match(/^([a-d]\))\s*(.*)/);
    if (numberedMatch) {
      return (
        <View key={i} style={styles.caseParaRow}>
          <Text style={styles.caseParaNum}>{numberedMatch[1].trim()}</Text>
          <Text style={styles.caseParaText}>{numberedMatch[2]}</Text>
        </View>
      );
    }
    if (subItemMatch) {
      return (
        <View key={i} style={styles.caseSubRow}>
          <Text style={styles.caseParaNum}>{subItemMatch[1]}</Text>
          <Text style={styles.caseParaText}>{subItemMatch[2]}</Text>
        </View>
      );
    }
    return (
      <Text key={i} style={styles.caseBodyText}>{line}</Text>
    );
  });
};

const cleanText = (text) => text ? text.replace(/\[Page \d+\]/g, '').trim() : text;

// ─── Helper: "Case Name — Citation" ───────────────────────────────────────
const lawLabel = (caseName, citation) => {
  if (caseName && citation) return `${caseName} — ${citation}`;
  return caseName || citation || '';
};

const ScoreBadge = ({ score }) => {
  const pct   = Math.round((score || 0) * 100);
  const color = pct >= 60 ? '#16A34A' : pct >= 40 ? '#D97706' : '#DC2626';
  return (
    <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
      <Text style={[styles.badgeText, { color }]}>{pct}%</Text>
    </View>
  );
};

const ExpandableCard = ({ children }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setExpanded(!expanded)}
      style={styles.expandableCard}
    >
      {children(expanded)}
      <Text style={styles.expandToggle}>{expanded ? '▲ Show less' : '▼ Show more'}</Text>
    </TouchableOpacity>
  );
};

// ─── Case Detail Modal with tabs ──────────────────────────────────────────
const CaseDetailModal = ({ visible, caseData, loading, onClose }) => {
  const [activeSection, setActiveSection] = useState('judgment');

  const sections = [
    caseData?.judgment || caseData?.judgment_preview ? { key: 'judgment',  label: '⚖️ Judgment'  } : null,
    caseData?.complaint                               ? { key: 'complaint', label: '📋 Complaint' } : null,
    caseData?.defense                                 ? { key: 'defense',   label: '🛡 Defense'   } : null,
  ].filter(Boolean);

  const contentMap = {
    judgment:  cleanText(caseData?.judgment || caseData?.judgment_preview),
    complaint: cleanText(caseData?.complaint),
    defense:   cleanText(caseData?.defense),
  };

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        <View style={styles.modalHeader}>
          <Text style={styles.modalTitle} numberOfLines={2}>
            {caseData?.case_name || 'Case Details'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
            <Text style={styles.modalCloseText}>✕ Close</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.modalLoading}>
            <ActivityIndicator size="large" color="#005A9C" />
            <Text style={styles.modalLoadingText}>Loading case details…</Text>
          </View>
        ) : (
          <>
            {sections.length > 1 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalTabBar}>
                {sections.map((s) => (
                  <TouchableOpacity
                    key={s.key}
                    style={[styles.modalTab, activeSection === s.key && styles.modalActiveTab]}
                    onPress={() => setActiveSection(s.key)}
                  >
                    <Text style={[styles.modalTabText, activeSection === s.key && styles.modalActiveTabText]}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}
            <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalContent}>
              {contentMap[activeSection]
                ? renderCaseText(contentMap[activeSection])
                : <Text style={styles.emptyText}>No content available.</Text>
              }
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
};

// ─── Law Detail Modal ─────────────────────────────────────────────────────
const LawDetailModal = ({ visible, lawData, loading, onClose }) => {
  const [activeSection, setActiveSection] = useState('principle');

  const principleText = (lawData?.principle || []).join('\n\n');
  const heldText      = (lawData?.held || []).join('\n\n');

  const sections = [
    principleText            ? { key: 'principle', label: '⚖️ Principle' } : null,
    lawData?.section_content ? { key: 'section',   label: '📖 Section'   } : null,
    lawData?.facts           ? { key: 'facts',     label: '📋 Facts'     } : null,
    heldText                 ? { key: 'held',      label: '🔖 Held'      } : null,
  ].filter(Boolean);

  const contentMap = {
    principle: principleText,
    section:   lawData?.section_content,
    facts:     lawData?.facts,
    held:      heldText,
  };

  const metaItems = [
    lawData?.chapter        && { label: 'Chapter',   value: lawData.chapter },
    lawData?.source_title   && { label: 'Source',    value: lawData.source_title },
    lawData?.section_number && { label: 'Section',   value: lawData.section_number },
    lawData?.topic          && { label: 'Topic',     value: lawData.topic },
    lawData?.court          && { label: 'Court',     value: lawData.court },
  ].filter(Boolean);

  return (
    <Modal visible={visible} animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalContainer}>
        {/* Header — "Case Name — Citation" */}
        <View style={[styles.modalHeader, { backgroundColor: '#065F46' }]}>
          <Text style={styles.modalTitle} numberOfLines={3}>
            {lawLabel(lawData?.case_name, lawData?.citation) || 'Law Details'}
          </Text>
          <TouchableOpacity onPress={onClose} style={styles.modalCloseBtn}>
            <Text style={styles.modalCloseText}>✕ Close</Text>
          </TouchableOpacity>
        </View>

        {loading ? (
          <View style={styles.modalLoading}>
            <ActivityIndicator size="large" color="#065F46" />
            <Text style={styles.modalLoadingText}>Loading law details…</Text>
          </View>
        ) : (
          <>
            {metaItems.length > 0 && (
              <View style={styles.lawMetaBar}>
                {metaItems.map((m, i) => (
                  <Text key={i} style={styles.lawMetaItem}>
                    <Text style={styles.lawMetaLabel}>{m.label}: </Text>
                    {m.value}
                  </Text>
                ))}
                {(lawData?.relevant_sections || []).length > 0 && (
                  <View style={styles.chipRow}>
                    {lawData.relevant_sections.map((s, i) => (
                      <View key={i} style={styles.chip}>
                        <Text style={styles.chipText}>§ {s}</Text>
                      </View>
                    ))}
                  </View>
                )}
              </View>
            )}

            {sections.length > 1 && (
              <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.modalTabBar}>
                {sections.map((s) => (
                  <TouchableOpacity
                    key={s.key}
                    style={[styles.modalTab, activeSection === s.key && styles.lawActiveTab]}
                    onPress={() => setActiveSection(s.key)}
                  >
                    <Text style={[styles.modalTabText, activeSection === s.key && styles.lawActiveTabText]}>
                      {s.label}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            )}

            <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalContent}>
              {contentMap[activeSection]
                ? renderCaseText(contentMap[activeSection])
                : <Text style={styles.emptyText}>No content available.</Text>
              }
            </ScrollView>
          </>
        )}
      </View>
    </Modal>
  );
};

// ─── Build HTML for PDF ────────────────────────────────────────────────────
const buildReportHTML = (result) => {
  const casesHTML = (result.similar_cases || []).map((c) => `
    <div style="margin-bottom:10px;padding:10px;border:1px solid #ddd;border-radius:6px;">
      <b>${c.case_name || ''}</b><br/>
      <span style="color:#16A34A;">${Math.round((c.score||0)*100)}% match</span><br/>
      <span>${c.judgment_preview || ''}</span>
    </div>`).join('');

  const lawsHTML = (result.relevant_laws || []).map((l) => `
    <div style="margin-bottom:10px;padding:10px;border:1px solid #ddd;border-radius:6px;">
      <b>${l.case_name && l.citation ? `${l.case_name} — ${l.citation}` : l.case_name || l.citation || ''}</b><br/>
      ${l.section_number ? `<span>Section ${l.section_number}${l.section_title ? ': ' + l.section_title : ''}</span><br/>` : ''}
      <span>${(l.principle || []).join(' ')}</span>
    </div>`).join('');

  const questionsHTML = typeof result.generated_questions === 'string'
    ? `<p>${result.generated_questions.replace(/\n/g, '<br/>')}</p>`
    : (result.generated_questions || []).map((q) => `
    <div style="margin-bottom:8px;padding:8px;background:#f5f5f5;border-radius:6px;">
      <b>Q${q.question_id}:</b> ${q.question || ''}
    </div>`).join('');

  return `<html><head><meta charset="utf-8"/>
    <style>
      body{font-family:Arial,sans-serif;padding:24px;color:#1E293B;}
      h1{color:#005A9C;font-size:20px;}
      h2{color:#005A9C;font-size:15px;margin-top:20px;border-bottom:1px solid #005A9C;padding-bottom:4px;}
      p{font-size:13px;line-height:1.6;}
    </style></head><body>
    <h1>⚖️ JuriAid – Case Analysis Report</h1>
    <p>Analysis ID: ${result.analysis_id || 'N/A'}</p>
    <p>Generated: ${new Date().toLocaleString()}</p>
    <h2>Case Summary</h2>
    <p>${(result.case_summary || '').replace(/\n/g, '<br/>')}</p>
    <h2>Similar Cases (${(result.similar_cases||[]).length})</h2>
    ${casesHTML || '<p>None</p>'}
    <h2>Relevant Laws (${(result.relevant_laws||[]).length})</h2>
    ${lawsHTML || '<p>None</p>'}
    <h2>Generated Questions</h2>
    ${questionsHTML || '<p>None</p>'}
  </body></html>`;
};

// ─── Main Screen ──────────────────────────────────────────────────────────
const CaseAnalysisResultScreen = ({ route, navigation }) => {
  const dispatch      = useDispatch();
  const savedReports  = useSelector((state) => state.reports.savedReports);
  const { analysisResult } = route.params;

  const [activeTab, setActiveTab]                   = useState('summary');
  const [modalVisible, setModalVisible]             = useState(false);
  const [selectedCase, setSelectedCase]             = useState(null);
  const [caseDetailLoading, setCaseDetailLoading]   = useState(false);
  const [lawModalVisible, setLawModalVisible]       = useState(false);
  const [selectedLaw, setSelectedLaw]               = useState(null);
  const [lawDetailLoading, setLawDetailLoading]     = useState(false);
  const [saving, setSaving]                         = useState(false);
  const [downloading, setDownloading]               = useState(false);

  const isAlreadySaved = savedReports.some(
    (r) => r.analysis_id === analysisResult?.analysis_id
  );

  log.info('[CaseAnalysisResultScreen] mounted', {
    analysis_id:         analysisResult?.analysis_id,
    similar_cases_count: analysisResult?.similar_cases?.length,
    relevant_laws_count: analysisResult?.relevant_laws?.length,
    questions_count:     analysisResult?.generated_questions?.length,
  });

  if (!analysisResult) {
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No analysis result found.</Text>
      </View>
    );
  }

  const {
    analysis_id,
    case_summary        = '',
    similar_cases       = [],
    relevant_laws       = [],
    generated_questions = [],
    metadata            = {},
    created_at,
    processing_time_seconds,
  } = analysisResult;

  // ── Save Report ─────────────────────────────────────────────────────────
  const handleSave = () => {
    if (isAlreadySaved) {
      Alert.alert('Already Saved', 'This report is already in your Reports tab.');
      return;
    }
    setSaving(true);
    try {
      dispatch(saveReport(analysisResult));
      log.info('[CaseAnalysisResultScreen] report saved', { analysis_id });
      Alert.alert('Saved ✅', 'Report saved to your Reports tab.');
    } catch (e) {
      log.error('[CaseAnalysisResultScreen] save failed:', e);
      Alert.alert('Error', 'Failed to save report.');
    } finally {
      setSaving(false);
    }
  };

  // ── Download PDF ─────────────────────────────────────────────────────────
  const handleDownload = async () => {
    if (!RNHTMLtoPDF) {
      Alert.alert('Not Available', 'Run:\n\nnpm install react-native-html-to-pdf\n\nthen rebuild the app.');
      return;
    }
    setDownloading(true);
    log.info('[CaseAnalysisResultScreen] generating PDF…', { analysis_id });
    try {
      const file = await RNHTMLtoPDF.convert({
        html:      buildReportHTML(analysisResult),
        fileName:  `JuriAid_Report_${analysis_id || Date.now()}`,
        directory: Platform.OS === 'ios' ? 'Documents' : 'Download',
      });
      log.info('[CaseAnalysisResultScreen] PDF generated:', file?.filePath);
      if (file?.filePath) {
        Alert.alert(
          '📥 PDF Downloaded',
          `Saved to:\n${file.filePath}`,
          [
            { text: 'Open', onPress: () => FileViewer?.open(file.filePath).catch(() => {}) },
            { text: 'OK' },
          ]
        );
      }
    } catch (e) {
      log.error('[CaseAnalysisResultScreen] PDF generation failed:', e);
      Alert.alert('Download Failed', 'Could not generate PDF. Please try again.');
    } finally {
      setDownloading(false);
    }
  };

  // ── Open Case Detail Modal ───────────────────────────────────────────────
  const handleCasePress = async (caseItem) => {
    log.info('[CaseAnalysisResultScreen] case pressed', { case_id: caseItem.case_id });
    setSelectedCase({ case_name: caseItem.case_name });
    setModalVisible(true);
    setCaseDetailLoading(true);
    try {
      const detail = await pastCaseService.getCaseById(caseItem.case_id);
      setSelectedCase(detail);
    } catch (error) {
      log.error('[CaseAnalysisResultScreen] case detail failed:', error);
      Alert.alert('Error', 'Failed to load case details.');
      setModalVisible(false);
    } finally {
      setCaseDetailLoading(false);
    }
  };

  // ── Open Law Detail Modal ────────────────────────────────────────────────
  const handleLawPress = async (lawItem) => {
    if (!lawItem.case_id) {
      Alert.alert('Not Available', 'No ID available for this law entry.');
      return;
    }
    log.info('[CaseAnalysisResultScreen] law pressed', { case_id: lawItem.case_id });
    setSelectedLaw({ case_name: lawItem.case_name, citation: lawItem.citation });
    setLawModalVisible(true);
    setLawDetailLoading(true);
    try {
      const detail = await lawStatKGService.getCaseLawById(lawItem.case_id);
      setSelectedLaw(detail);
    } catch (error) {
      log.error('[CaseAnalysisResultScreen] law detail failed:', error);
      Alert.alert('Error', 'Failed to load law details.');
      setLawModalVisible(false);
    } finally {
      setLawDetailLoading(false);
    }
  };

  // ── Tabs ─────────────────────────────────────────────────────────────────
  const tabs = [
    { key: 'summary',   label: '📋 Summary' },
    { key: 'cases',     label: `📂 Cases (${similar_cases.length})` },
    { key: 'laws',      label: `⚖️ Laws (${relevant_laws.length})` },
    { key: 'questions', label: `❓ F&A ${Array.isArray(generated_questions) ? `(${generated_questions.length})` : '✓'}` },
  ];

  const renderSummary = () => (
    <View>
      <View style={styles.metaCard}>
        <Text style={styles.metaRow}>📄 <Text style={styles.metaValue}>{metadata.filename}</Text></Text>
        <Text style={styles.metaRow}>📦 <Text style={styles.metaValue}>{metadata.file_size_mb?.toFixed(2)} MB</Text></Text>
        <Text style={styles.metaRow}>⏱ <Text style={styles.metaValue}>{processing_time_seconds?.toFixed(1)} s</Text></Text>
        <Text style={styles.metaRow}>🕐 <Text style={styles.metaValue}>{new Date(created_at).toLocaleString()}</Text></Text>
      </View>
      <View style={styles.summaryCard}>{renderFormattedText(case_summary)}</View>
    </View>
  );

  const renderSimilarCases = () => {
    if (similar_cases.length === 0)
      return <Text style={styles.emptyText}>No similar cases found.</Text>;
    return similar_cases.map((c, idx) => (
      <ExpandableCard key={c.case_id || idx}>
        {(expanded) => (
          <>
            <TouchableOpacity onPress={() => handleCasePress(c)} style={styles.caseCardHeader} activeOpacity={0.7}>
              <View style={styles.caseCardTitleRow}>
                <Text style={styles.cardTitle} numberOfLines={expanded ? 0 : 2}>{c.case_name}</Text>
                <ScoreBadge score={c.score} />
              </View>
              <Text style={styles.tapHint}>👆 Tap title to view full case</Text>
            </TouchableOpacity>
            <Text style={styles.cardReason}>{c.reason}</Text>
          </>
        )}
      </ExpandableCard>
    ));
  };

  const renderRelevantLaws = () => {
    if (relevant_laws.length === 0)
      return <Text style={styles.emptyText}>No relevant laws found.</Text>;
    return relevant_laws.map((law, idx) => {
      const principleText = (law.principle || []).join('\n\n');
      const relevancePct  = Math.round(Math.min(law.support_score || 0, 1.0) * 100);
      const topicLabel    = law.topic ? law.topic.replace(/_/g, ' ') : '';
      const sectionLabel  = law.section_number
        ? `Section ${law.section_number}${law.section_title ? ': ' + law.section_title : ''}`
        : law.case_name;
      const citationLabel = law.citation ? `  •  ${law.citation}` : '';

      return (
        <ExpandableCard key={`${law.case_id}-${idx}`}>
          {(expanded) => (
            <>
              <TouchableOpacity onPress={() => handleLawPress(law)} style={styles.caseCardHeader} activeOpacity={0.7}>
                <View style={styles.caseCardTitleRow}>
                  {/* "Case Name — Citation" as the primary title */}
                  <Text style={styles.cardTitle} numberOfLines={expanded ? 0 : 2}>
                    {lawLabel(law.case_name, law.citation)}
                  </Text>
                  <View style={styles.badge}>
                    <Text style={[styles.badgeText, { color: '#92400E' }]}>{relevancePct}%</Text>
                  </View>
                </View>
                <Text style={styles.tapHint}>👆 Tap to view full law detail</Text>
              </TouchableOpacity>
              <Text style={styles.actId}>
                {topicLabel}{sectionLabel ? `  •  ${sectionLabel}` : ''}
              </Text>
              {principleText ? (
                <Text style={styles.cardBody} numberOfLines={expanded ? 0 : 3}>{principleText}</Text>
              ) : null}
            </>
          )}
        </ExpandableCard>
      );
    });
  };

  const renderQuestions = () => {
    if (!generated_questions || generated_questions.length === 0)
      return <Text style={styles.emptyText}>No questions generated.</Text>;

    if (typeof generated_questions === 'string') {
      return <View style={styles.summaryCard}>{renderFormattedText(generated_questions)}</View>;
    }

    return generated_questions.map((q, idx) => (
      <View key={q.question_id || idx} style={styles.questionCard}>
        <Text style={styles.questionNumber}>Q{q.question_id ?? idx + 1}</Text>
        <Text style={styles.questionText}>{q.question}</Text>
      </View>
    ));
  };

  const renderTabContent = () => {
    switch (activeTab) {
      case 'summary':   return renderSummary();
      case 'cases':     return renderSimilarCases();
      case 'laws':      return renderRelevantLaws();
      case 'questions': return renderQuestions();
      default:          return null;
    }
  };

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Analysis Result</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.activeTab]}
            onPress={() => setActiveTab(t.key)}
          >
            <Text style={[styles.tabText, activeTab === t.key && styles.activeTabText]}>
              {t.label}
            </Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      {/* Content */}
      <ScrollView style={styles.body} contentContainerStyle={styles.bodyContent}>
        {renderTabContent()}
      </ScrollView>

      {/* Save & Download */}
      <View style={styles.actionRow}>
        <TouchableOpacity
          style={[styles.saveBtn, isAlreadySaved && styles.savedBtn, saving && styles.disabledBtn]}
          onPress={handleSave}
          disabled={saving || isAlreadySaved}
        >
          {saving
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.actionBtnText}>{isAlreadySaved ? '✅ Saved' : '💾 Save Report'}</Text>
          }
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.downloadBtn, downloading && styles.disabledBtn]}
          onPress={handleDownload}
          disabled={downloading}
        >
          {downloading
            ? <ActivityIndicator color="#fff" size="small" />
            : <Text style={styles.actionBtnText}>📥 Download PDF</Text>
          }
        </TouchableOpacity>
      </View>

      {/* Case Detail Modal */}
      <CaseDetailModal
        visible={modalVisible}
        caseData={selectedCase}
        loading={caseDetailLoading}
        onClose={() => { setModalVisible(false); setSelectedCase(null); }}
      />

      {/* Law Detail Modal */}
      <LawDetailModal
        visible={lawModalVisible}
        lawData={selectedLaw}
        loading={lawDetailLoading}
        onClose={() => { setLawModalVisible(false); setSelectedLaw(null); }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:        { flex: 1, backgroundColor: '#F8FAFC' },
  errorContainer:   { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText:        { color: '#DC2626', fontSize: 16 },

  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  backBtn:          { padding: 4 },
  backText:         { color: '#005A9C', fontSize: 15 },
  headerTitle:      { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },

  tabBar:           { backgroundColor: '#fff', maxHeight: 50, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tab:              { paddingHorizontal: 16, paddingVertical: 14, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  activeTab:        { borderBottomColor: '#005A9C' },
  tabText:          { fontSize: 13, color: '#64748B', fontWeight: '500' },
  activeTabText:    { color: '#005A9C', fontWeight: '700' },

  body:             { flex: 1 },
  bodyContent:      { padding: 16, paddingBottom: 16 },

  metaCard:         { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  metaRow:          { fontSize: 13, color: '#64748B', marginBottom: 4 },
  metaValue:        { color: '#1E293B', fontWeight: '600' },

  summaryCard:      { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  mdHeader:         { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginTop: 12, marginBottom: 4 },
  mdSubHeader:      { fontSize: 14, fontWeight: 'bold', color: '#334155', marginTop: 8, marginBottom: 2 },
  mdText:           { fontSize: 14, color: '#374151', lineHeight: 22 },
  mdBold:           { fontWeight: 'bold', color: '#1E293B' },
  mdSpacer:         { fontSize: 6 },

  expandableCard:   { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0' },
  expandToggle:     { fontSize: 12, color: '#005A9C', marginTop: 8, textAlign: 'right' },

  caseCardHeader:   { marginBottom: 4 },
  caseCardTitleRow: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle:        { fontSize: 14, fontWeight: '700', color: '#1E293B', flex: 1, marginRight: 8 },
  tapHint:          { fontSize: 11, color: '#3B82F6', marginBottom: 6 },
  cardReason:       { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginBottom: 6 },
  cardBody:         { fontSize: 13, color: '#374151', lineHeight: 20 },

  actTitle:         { fontSize: 12, color: '#3B82F6', marginBottom: 2 },
  actId:            { fontSize: 11, color: '#94A3B8', marginBottom: 6 },

  badge:            { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#FEF3C7' },
  badgeText:        { fontSize: 11, fontWeight: '700' },

  questionCard:     { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0', flexDirection: 'row', alignItems: 'flex-start' },
  questionNumber:   { fontSize: 13, fontWeight: 'bold', color: '#005A9C', marginRight: 10, minWidth: 28 },
  questionText:     { fontSize: 14, color: '#374151', lineHeight: 20, flex: 1 },
  emptyText:        { textAlign: 'center', color: '#94A3B8', fontSize: 14, marginTop: 40 },

  // ── Bottom Action Buttons ──
  actionRow: {
    flexDirection: 'row', padding: 12, gap: 10,
    backgroundColor: '#fff', borderTopWidth: 1, borderTopColor: '#E2E8F0',
  },
  saveBtn:          { flex: 1, backgroundColor: '#005A9C', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  savedBtn:         { backgroundColor: '#22C55E' },
  downloadBtn:      { flex: 1, backgroundColor: '#0F766E', borderRadius: 12, paddingVertical: 14, alignItems: 'center' },
  disabledBtn:      { opacity: 0.6 },
  actionBtnText:    { color: '#fff', fontSize: 14, fontWeight: '700' },

  // ── Modal (shared) ──
  modalContainer:   { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
    backgroundColor: '#005A9C', borderBottomWidth: 1, borderBottomColor: '#004080',
  },
  modalTitle:       { fontSize: 15, fontWeight: 'bold', color: '#fff', flex: 1, marginRight: 8 },
  modalSubtitle:    { fontSize: 12, color: 'rgba(255,255,255,0.75)', marginTop: 3 },
  modalCloseBtn:    { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  modalCloseText:   { color: '#fff', fontSize: 13, fontWeight: '600' },
  modalLoading:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalLoadingText: { marginTop: 12, color: '#64748B', fontSize: 14 },

  modalTabBar:        { backgroundColor: '#fff', maxHeight: 48, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTab:           { paddingHorizontal: 18, paddingVertical: 13, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  modalActiveTab:     { borderBottomColor: '#005A9C' },
  modalTabText:       { fontSize: 13, color: '#64748B', fontWeight: '500' },
  modalActiveTabText: { color: '#005A9C', fontWeight: '700' },

  // Law active tab (green)
  lawActiveTab:     { borderBottomColor: '#065F46' },
  lawActiveTabText: { color: '#065F46', fontWeight: '700' },

  modalBody:    { flex: 1 },
  modalContent: { padding: 16, paddingBottom: 40 },

  // ── Law meta bar ──
  lawMetaBar: {
    backgroundColor: '#ECFDF5', borderBottomWidth: 1, borderBottomColor: '#A7F3D0',
    padding: 12,
  },
  lawMetaItem:  { fontSize: 12, color: '#374151', marginBottom: 3, lineHeight: 18 },
  lawMetaLabel: { fontWeight: '700', color: '#065F46' },

  // Chips for relevant_sections
  chipRow:  { flexDirection: 'row', flexWrap: 'wrap', marginTop: 6, gap: 6 },
  chip:     { backgroundColor: '#D1FAE5', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  chipText: { fontSize: 11, color: '#065F46', fontWeight: '600' },

  // Case text formatting
  caseParaRow:  { flexDirection: 'row', marginBottom: 12, alignItems: 'flex-start' },
  caseSubRow:   { flexDirection: 'row', marginBottom: 8, alignItems: 'flex-start', marginLeft: 20 },
  caseParaNum:  { fontSize: 13, fontWeight: '700', color: '#005A9C', minWidth: 28, marginTop: 1 },
  caseParaText: { fontSize: 14, color: '#374151', lineHeight: 22, flex: 1 },
  caseBodyText: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 8 },

  // kept for backwards compat
  modalSection:      { backgroundColor: '#fff', borderRadius: 12, padding: 14, marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  modalSectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
  modalBodyText:     { fontSize: 14, color: '#374151', lineHeight: 22 },
});

export default CaseAnalysisResultScreen;