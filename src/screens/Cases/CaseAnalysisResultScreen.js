import React, { useState } from 'react';
import {
  View, Text, StyleSheet, ScrollView,
  TouchableOpacity, Alert,
} from 'react-native';
import { log } from '../../api/index';

// ─── Small presentational components ─────────────────────────────────────────

const SectionHeader = ({ emoji, title }) => (
  <View style={styles.sectionHeader}>
    <Text style={styles.sectionHeaderText}>{emoji}  {title}</Text>
  </View>
);

const Badge = ({ label, color = '#EFF6FF', textColor = '#1D4ED8' }) => (
  <View style={[styles.badge, { backgroundColor: color }]}>
    <Text style={[styles.badgeText, { color: textColor }]}>{label}</Text>
  </View>
);

// ─── Main Screen ──────────────────────────────────────────────────────────────

const CaseAnalysisResultScreen = ({ route, navigation }) => {
  const { analysisResult } = route.params;
  const [activeTab, setActiveTab] = useState('summary');

  log.info('[CaseAnalysisResultScreen] mounted', {
    analysis_id:             analysisResult?.analysis_id,
    status:                  analysisResult?.status,
    similar_cases_count:     analysisResult?.similar_cases?.length,
    relevant_laws_count:     analysisResult?.relevant_laws?.length,
    questions_count:         analysisResult?.generated_questions?.length,
    processing_time_seconds: analysisResult?.processing_time_seconds,
  });

  if (!analysisResult) {
    log.error('[CaseAnalysisResultScreen] analysisResult is null/undefined');
    return (
      <View style={styles.errorContainer}>
        <Text style={styles.errorText}>No analysis result found.</Text>
      </View>
    );
  }

  const {
    analysis_id, status, case_summary, similar_cases = [],
    relevant_laws = [], generated_questions = [],
    metadata = {}, created_at, processing_time_seconds,
  } = analysisResult;

  const tabs = [
    { key: 'summary',   label: '📋 Summary' },
    { key: 'cases',     label: `📂 Cases (${similar_cases.length})` },
    { key: 'laws',      label: `⚖️ Laws (${relevant_laws.length})` },
    { key: 'questions', label: `❓ Q&A (${generated_questions.length})` },
  ];

  // ── Summary Tab ───────────────────────────────────────────────────────────
  const renderSummary = () => (
    <View>
      {/* Meta info */}
      <View style={styles.metaCard}>
        <Text style={styles.metaRow}>🆔 ID: <Text style={styles.metaValue}>{analysis_id}</Text></Text>
        <Text style={styles.metaRow}>📄 File: <Text style={styles.metaValue}>{metadata.filename}</Text></Text>
        <Text style={styles.metaRow}>📦 Size: <Text style={styles.metaValue}>{metadata.file_size_mb?.toFixed(2)} MB</Text></Text>
        <Text style={styles.metaRow}>⏱ Time: <Text style={styles.metaValue}>{processing_time_seconds?.toFixed(1)} s</Text></Text>
        <Text style={styles.metaRow}>💾 Saved: <Text style={styles.metaValue}>{metadata.saved_for_reference ? 'Yes' : 'No'}</Text></Text>
        <Text style={styles.metaRow}>🕐 At: <Text style={styles.metaValue}>{new Date(created_at).toLocaleString()}</Text></Text>
      </View>

      <SectionHeader emoji="📋" title="Case Summary" />
      <View style={styles.summaryCard}>
        <Text style={styles.summaryText}>{case_summary}</Text>
      </View>
    </View>
  );

  // ── Similar Cases Tab ─────────────────────────────────────────────────────
  const renderSimilarCases = () => {
    if (similar_cases.length === 0) {
      log.info('[CaseAnalysisResultScreen] no similar cases returned');
      return <Text style={styles.emptyText}>No similar cases found.</Text>;
    }

    return similar_cases.map((c, idx) => {
      const scoreColor = c.score >= 0.6 ? '#16A34A' : c.score >= 0.4 ? '#D97706' : '#DC2626';
      log.info(`[CaseAnalysisResultScreen] similar_case[${idx}]`, {
        case_id:   c.case_id,
        case_name: c.case_name,
        score:     c.score,
      });

      return (
        <View key={c.case_id || idx} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle} numberOfLines={2}>{c.case_name}</Text>
            <Badge
              label={`${(c.score * 100).toFixed(0)}% match`}
              color={`${scoreColor}20`}
              textColor={scoreColor}
            />
          </View>
          <Text style={styles.cardSubtitle}>{c.reason}</Text>
          <Text style={styles.cardBody} numberOfLines={6}>{c.summary}</Text>
        </View>
      );
    });
  };

  // ── Relevant Laws Tab ─────────────────────────────────────────────────────
  const renderRelevantLaws = () => {
    if (relevant_laws.length === 0) {
      log.info('[CaseAnalysisResultScreen] no relevant laws returned');
      return <Text style={styles.emptyText}>No relevant laws found.</Text>;
    }

    return relevant_laws.map((law, idx) => {
      log.info(`[CaseAnalysisResultScreen] relevant_law[${idx}]`, {
        act_id:          law.act_id,
        section:         law.section,
        section_title:   law.section_title,
        relevance_score: law.relevance_score,
      });

      return (
        <View key={`${law.act_id}-${law.section}-${idx}`} style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>
              Section {law.section}: {law.section_title}
            </Text>
            <Badge
              label={`${(law.relevance_score * 100).toFixed(0)}%`}
              color="#FEF3C7"
              textColor="#92400E"
            />
          </View>
          <Text style={styles.actTitle} numberOfLines={2}>{law.title}</Text>
          <Text style={styles.actId}>Act: {law.act_id}</Text>
          {law.content ? (
            <Text style={styles.cardBody} numberOfLines={4}>{law.content}</Text>
          ) : null}
        </View>
      );
    });
  };

  // ── Generated Questions Tab ───────────────────────────────────────────────
  const renderQuestions = () => {
    if (generated_questions.length === 0) {
      log.info('[CaseAnalysisResultScreen] no questions generated');
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
        <Badge
          label={status === 'completed' ? '✅ Done' : status}
          color={status === 'completed' ? '#DCFCE7' : '#FEF3C7'}
          textColor={status === 'completed' ? '#166534' : '#92400E'}
        />
      </View>

      {/* Tabs */}
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={styles.tabBar}>
        {tabs.map((t) => (
          <TouchableOpacity
            key={t.key}
            style={[styles.tab, activeTab === t.key && styles.activeTab]}
            onPress={() => {
              log.info('[CaseAnalysisResultScreen] tab changed →', t.key);
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
  backBtn:      { padding: 4 },
  backText:     { color: '#005A9C', fontSize: 15 },
  headerTitle:  { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },

  tabBar:       { backgroundColor: '#fff', maxHeight: 50, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  tab: {
    paddingHorizontal: 16, paddingVertical: 14,
    borderBottomWidth: 2, borderBottomColor: 'transparent',
  },
  activeTab:    { borderBottomColor: '#005A9C' },
  tabText:      { fontSize: 13, color: '#64748B', fontWeight: '500' },
  activeTabText:{ color: '#005A9C', fontWeight: '700' },

  body:         { flex: 1 },
  bodyContent:  { padding: 16, paddingBottom: 40 },

  metaCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 16, borderWidth: 1, borderColor: '#E2E8F0',
  },
  metaRow:      { fontSize: 13, color: '#64748B', marginBottom: 4 },
  metaValue:    { color: '#1E293B', fontWeight: '600' },

  sectionHeader:     { marginBottom: 10, marginTop: 4 },
  sectionHeaderText: { fontSize: 16, fontWeight: 'bold', color: '#1E293B' },

  summaryCard:  { backgroundColor: '#fff', borderRadius: 12, padding: 16, borderWidth: 1, borderColor: '#E2E8F0' },
  summaryText:  { fontSize: 14, color: '#374151', lineHeight: 22 },

  card: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  cardHeader:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 6 },
  cardTitle:    { fontSize: 14, fontWeight: '700', color: '#1E293B', flex: 1, marginRight: 8 },
  cardSubtitle: { fontSize: 12, color: '#64748B', marginBottom: 6, fontStyle: 'italic' },
  cardBody:     { fontSize: 13, color: '#374151', lineHeight: 20 },
  actTitle:     { fontSize: 12, color: '#3B82F6', marginBottom: 2 },
  actId:        { fontSize: 11, color: '#94A3B8', marginBottom: 6 },

  badge:        { borderRadius: 6, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:    { fontSize: 11, fontWeight: '700' },

  questionCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0',
    flexDirection: 'row', alignItems: 'flex-start',
  },
  questionNumber: {
    fontSize: 13, fontWeight: 'bold', color: '#005A9C',
    marginRight: 10, minWidth: 28,
  },
  questionText: { fontSize: 14, color: '#374151', lineHeight: 20, flex: 1 },

  emptyText: { textAlign: 'center', color: '#94A3B8', fontSize: 14, marginTop: 40 },
});

export default CaseAnalysisResultScreen;