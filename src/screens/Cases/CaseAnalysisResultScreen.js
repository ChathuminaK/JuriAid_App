import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
  Alert, ActivityIndicator, Modal,
} from 'react-native';
import { log } from '../../api/index';
import pastCaseService from '../../api/pastcase';

// ─── Markdown-like renderer (handles ## headers and **bold**) ─────────────────
const renderFormattedText = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    // ## Header
    if (line.startsWith('## ')) {
      return (
        <Text key={lineIdx} style={styles.mdHeader}>
          {line.replace('## ', '')}
        </Text>
      );
    }
    // ### Sub-header
    if (line.startsWith('### ')) {
      return (
        <Text key={lineIdx} style={styles.mdSubHeader}>
          {line.replace('### ', '')}
        </Text>
      );
    }
    // Empty line → spacer
    if (line.trim() === '') {
      return <Text key={lineIdx} style={styles.mdSpacer}>{' '}</Text>;
    }
    // Parse **bold** within normal lines
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <Text key={lineIdx} style={styles.mdText}>
        {parts.map((part, partIdx) => {
          if (part.startsWith('**') && part.endsWith('**')) {
            return (
              <Text key={partIdx} style={styles.mdBold}>
                {part.slice(2, -2)}
              </Text>
            );
          }
          return <Text key={partIdx}>{part}</Text>;
        })}
        {'\n'}
      </Text>
    );
  });
};

// ─── Score Badge ──────────────────────────────────────────────────────────────
const ScoreBadge = ({ score }) => {
  const pct   = Math.round((score || 0) * 100);
  const color = pct >= 60 ? '#16A34A' : pct >= 40 ? '#D97706' : '#DC2626';
  return (
    <View style={[styles.badge, { backgroundColor: `${color}20` }]}>
      <Text style={[styles.badgeText, { color }]}>{pct}% match</Text>
    </View>
  );
};

// ─── Expandable Card ──────────────────────────────────────────────────────────
const ExpandableCard = ({ children, style }) => {
  const [expanded, setExpanded] = useState(false);
  return (
    <TouchableOpacity
      activeOpacity={0.85}
      onPress={() => setExpanded(!expanded)}
      style={[styles.expandableCard, style]}
    >
      {children(expanded)}
      <Text style={styles.expandToggle}>{expanded ? '▲ Show less' : '▼ Show more'}</Text>
    </TouchableOpacity>
  );
};

// ─── Case Detail Modal ────────────────────────────────────────────────────────
const CaseDetailModal = ({ visible, caseData, loading, onClose }) => (
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
        <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalContent}>
          {/* Complaint */}
          {caseData?.complaint ? (
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>📋 Complaint</Text>
              <Text style={styles.modalBodyText}>{caseData.complaint}</Text>
            </View>
          ) : null}

          {/* Defense */}
          {caseData?.defense ? (
            <View style={styles.modalSection}>
              <Text style={styles.modalSectionTitle}>🛡 Defense</Text>
              <Text style={styles.modalBodyText}>{caseData.defense}</Text>
            </View>
          ) : null}
        </ScrollView>
      )}
    </View>
  </Modal>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────
const CaseAnalysisResultScreen = ({ route, navigation }) => {
  const { analysisResult } = route.params;

  const [activeTab, setActiveTab]         = useState('summary');
  const [modalVisible, setModalVisible]   = useState(false);
  const [selectedCase, setSelectedCase]   = useState(null);
  const [caseDetailLoading, setCaseDetailLoading] = useState(false);

  log.info('[CaseAnalysisResultScreen] mounted', {
    analysis_id:             analysisResult?.analysis_id,
    status:                  analysisResult?.status,
    similar_cases_count:     analysisResult?.similar_cases?.length,
    relevant_laws_count:     analysisResult?.relevant_laws?.length,
    questions_count:         analysisResult?.generated_questions?.length,
    processing_time_seconds: analysisResult?.processing_time_seconds,
  });

  if (!analysisResult) {
    log.error('[CaseAnalysisResultScreen] analysisResult is null');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No analysis result found.</Text>
      </View>
    );
  }

  const {
    analysis_id, status,
    case_summary       = '',
    similar_cases      = [],
    relevant_laws      = [],
    generated_questions= [],
    metadata           = {},
    created_at,
    processing_time_seconds,
  } = analysisResult;

  // ── Open Case Detail ────────────────────────────────────────────────────
  const handleCasePress = async (caseItem) => {
    log.info('[CaseAnalysisResultScreen] case card pressed', {
      case_id:   caseItem.case_id,
      case_name: caseItem.case_name,
    });

    setSelectedCase({ case_name: caseItem.case_name });
    setModalVisible(true);
    setCaseDetailLoading(true);

    try {
      const detail = await pastCaseService.getCaseById(caseItem.case_id);
      log.info('[CaseAnalysisResultScreen] case detail loaded', { case_id: detail.case_id });
      setSelectedCase(detail);
    } catch (error) {
      log.error('[CaseAnalysisResultScreen] failed to load case detail:', error);
      Alert.alert('Error', typeof error === 'string' ? error : 'Failed to load case details.');
      setModalVisible(false);
    } finally {
      setCaseDetailLoading(false);
    }
  };

  // ── Navigate to Report ──────────────────────────────────────────────────
  const handleGenerateReport = () => {
    log.info('[CaseAnalysisResultScreen] generate report pressed', { analysis_id });
    navigation.navigate('Report', { analysisResult });
  };

  // ── Tabs ────────────────────────────────────────────────────────────────
  const tabs = [
    { key: 'summary',   label: '📋 Summary' },
    { key: 'cases',     label: `📂 Cases (${similar_cases.length})` },
    { key: 'laws',      label: `⚖️ Laws (${relevant_laws.length})` },
    { key: 'questions', label: `❓ Q&A (${generated_questions.length})` },
  ];

  // ── Summary Tab ─────────────────────────────────────────────────────────
  const renderSummary = () => (
    <View>
      {/* Meta Card */}
      <View style={styles.metaCard}>
        <Text style={styles.metaRow}>📄 <Text style={styles.metaValue}>{metadata.filename}</Text></Text>
        <Text style={styles.metaRow}>📦 Size: <Text style={styles.metaValue}>{metadata.file_size_mb?.toFixed(2)} MB</Text></Text>
        <Text style={styles.metaRow}>⏱ Time: <Text style={styles.metaValue}>{processing_time_seconds?.toFixed(1)} s</Text></Text>
        <Text style={styles.metaRow}>🕐 <Text style={styles.metaValue}>{new Date(created_at).toLocaleString()}</Text></Text>
      </View>

      {/* Formatted Summary */}
      <View style={styles.summaryCard}>
        {renderFormattedText(case_summary)}
      </View>
    </View>
  );

  // ── Similar Cases Tab ───────────────────────────────────────────────────
  const renderSimilarCases = () => {
    if (similar_cases.length === 0) {
      return <Text style={styles.emptyText}>No similar cases found.</Text>;
    }
    return similar_cases.map((c, idx) => (
      <ExpandableCard key={c.case_id || idx}>
        {(expanded) => (
          <>
            {/* Tappable header to load case detail */}
            <TouchableOpacity
              onPress={() => handleCasePress(c)}
              style={styles.caseCardHeader}
              activeOpacity={0.7}
            >
              <View style={styles.caseCardTitleRow}>
                <Text style={styles.cardTitle} numberOfLines={expanded ? 0 : 2}>
                  {c.case_name}
                </Text>
                <ScoreBadge score={c.score} />
              </View>
              <Text style={styles.tapHint}>👆 Tap title to view full case</Text>
            </TouchableOpacity>

            <Text style={styles.cardReason}>{c.reason}</Text>
            <Text style={styles.cardBody} numberOfLines={expanded ? 0 : 4}>
              {c.summary}
            </Text>
          </>
        )}
      </ExpandableCard>
    ));
  };

  // ── Relevant Laws Tab ───────────────────────────────────────────────────
  const renderRelevantLaws = () => {
    if (relevant_laws.length === 0) {
      return <Text style={styles.emptyText}>No relevant laws found.</Text>;
    }
    return relevant_laws.map((law, idx) => (
      <ExpandableCard key={`${law.act_id}-${law.section}-${idx}`}>
        {(expanded) => (
          <>
            <View style={styles.caseCardTitleRow}>
              <Text style={styles.cardTitle} numberOfLines={expanded ? 0 : 2}>
                Section {law.section}: {law.section_title}
              </Text>
              <View style={styles.badge}>
                <Text style={[styles.badgeText, { color: '#92400E' }]}>
                  {Math.round((law.relevance_score || 0) * 100)}%
                </Text>
              </View>
            </View>
            <Text style={styles.actTitle} numberOfLines={expanded ? 0 : 1}>{law.title}</Text>
            <Text style={styles.actId}>Act: {law.act_id}</Text>
            {law.content ? (
              <Text style={styles.cardBody} numberOfLines={expanded ? 0 : 3}>
                {law.content}
              </Text>
            ) : null}
          </>
        )}
      </ExpandableCard>
    ));
  };

  // ── Questions Tab ───────────────────────────────────────────────────────
  const renderQuestions = () => {
    if (generated_questions.length === 0) {
      return <Text style={styles.emptyText}>No questions generated for this case.</Text>;
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
        <TouchableOpacity style={styles.reportBtn} onPress={handleGenerateReport}>
          <Text style={styles.reportBtnText}>📄 Report</Text>
        </TouchableOpacity>
      </View>

      {/* Tabs */}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.tabBar}
      >
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.activeTab]}
            onPress={() => {
              log.info('[CaseAnalysisResultScreen] tab →', t.key);
              setActiveTab(t.key);
            }}
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

      {/* Case Detail Modal */}
      <CaseDetailModal
        visible={modalVisible}
        caseData={selectedCase}
        loading={caseDetailLoading}
        onClose={() => {
          log.info('[CaseAnalysisResultScreen] modal closed');
          setModalVisible(false);
          setSelectedCase(null);
        }}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#F8FAFC' },
  errorContainer:    { flex: 1, justifyContent: 'center', alignItems: 'center' },
  errorText:         { color: '#DC2626', fontSize: 16 },

  // ── Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  backBtn:           { padding: 4 },
  backText:          { color: '#005A9C', fontSize: 15 },
  headerTitle:       { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  reportBtn: {
    backgroundColor: '#005A9C', borderRadius: 8,
    paddingHorizontal: 10, paddingVertical: 6,
  },
  reportBtnText:     { color: '#fff', fontSize: 13, fontWeight: '700' },

  // ── Tabs
  tabBar:            { backgroundColor: '#fff', maxHeight: 50, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tab: {
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  activeTab:         { borderBottomColor: '#005A9C' },
  tabText:           { fontSize: 13, color: '#64748B', fontWeight: '500' },
  activeTabText:     { color: '#005A9C', fontWeight: '700' },

  // ── Body
  body:              { flex: 1 },
  bodyContent:       { padding: 16, paddingBottom: 40 },

  // ── Meta card
  metaCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0',
  },
  metaRow:           { fontSize: 13, color: '#64748B', marginBottom: 4 },
  metaValue:         { color: '#1E293B', fontWeight: '600' },

  // ── Summary / Markdown
  summaryCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    borderWidth: 1, borderColor: '#E2E8F0',
  },
  mdHeader:          { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginTop: 12, marginBottom: 4 },
  mdSubHeader:       { fontSize: 14, fontWeight: 'bold', color: '#334155', marginTop: 8, marginBottom: 2 },
  mdText:            { fontSize: 14, color: '#374151', lineHeight: 22 },
  mdBold:            { fontWeight: 'bold', color: '#1E293B' },
  mdSpacer:          { fontSize: 6 },

  // ── Expandable card
  expandableCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  expandToggle:      { fontSize: 12, color: '#005A9C', marginTop: 8, textAlign: 'right' },

  // ── Case cards
  caseCardHeader:    { marginBottom: 4 },
  caseCardTitleRow:  { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 4 },
  cardTitle:         { fontSize: 14, fontWeight: '700', color: '#1E293B', flex: 1, marginRight: 8 },
  tapHint:           { fontSize: 11, color: '#3B82F6', marginBottom: 6 },
  cardReason:        { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginBottom: 6 },
  cardBody:          { fontSize: 13, color: '#374151', lineHeight: 20 },

  // ── Law cards
  actTitle:          { fontSize: 12, color: '#3B82F6', marginBottom: 2 },
  actId:             { fontSize: 11, color: '#94A3B8', marginBottom: 6 },

  // ── Badge
  badge:             { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3, backgroundColor: '#FEF3C7' },
  badgeText:         { fontSize: 11, fontWeight: '700' },

  // ── Questions
  questionCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0',
    flexDirection: 'row', alignItems: 'flex-start',
  },
  questionNumber:    { fontSize: 13, fontWeight: 'bold', color: '#005A9C', marginRight: 10, minWidth: 28 },
  questionText:      { fontSize: 14, color: '#374151', lineHeight: 20, flex: 1 },

  emptyText:         { textAlign: 'center', color: '#94A3B8', fontSize: 14, marginTop: 40 },

  // ── Modal
  modalContainer:    { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  modalTitle:        { fontSize: 15, fontWeight: 'bold', color: '#1E293B', flex: 1, marginRight: 8 },
  modalCloseBtn:     { padding: 6 },
  modalCloseText:    { color: '#DC2626', fontSize: 14, fontWeight: '600' },
  modalLoading:      { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalLoadingText:  { marginTop: 12, color: '#64748B', fontSize: 14 },
  modalBody:         { flex: 1 },
  modalContent:      { padding: 16, paddingBottom: 40 },
  modalSection: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0',
  },
  modalSectionTitle: { fontSize: 15, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
  modalBodyText:     { fontSize: 14, color: '#374151', lineHeight: 22 },
});

export default CaseAnalysisResultScreen;