import React from 'react';
import {
  View, Text, StyleSheet, ScrollView, TouchableOpacity,
} from 'react-native';
import { log } from '../api/index';

// ─── Reuse same markdown renderer ────────────────────────────────────────────
const renderFormattedText = (text) => {
  if (!text) return null;
  const lines = text.split('\n');
  return lines.map((line, lineIdx) => {
    if (line.startsWith('## ')) {
      return <Text key={lineIdx} style={styles.mdHeader}>{line.replace('## ', '')}</Text>;
    }
    if (line.startsWith('### ')) {
      return <Text key={lineIdx} style={styles.mdSubHeader}>{line.replace('### ', '')}</Text>;
    }
    if (line.trim() === '') {
      return <Text key={lineIdx} style={styles.mdSpacer}>{' '}</Text>;
    }
    const parts = line.split(/(\*\*[^*]+\*\*)/g);
    return (
      <Text key={lineIdx} style={styles.mdText}>
        {parts.map((part, partIdx) =>
          part.startsWith('**') && part.endsWith('**')
            ? <Text key={partIdx} style={styles.mdBold}>{part.slice(2, -2)}</Text>
            : <Text key={partIdx}>{part}</Text>
        )}
        {'\n'}
      </Text>
    );
  });
};

const ReportScreen = ({ route, navigation }) => {
  // Support both: navigated with analysisResult param OR standalone tab
  const analysisResult = route?.params?.analysisResult || null;

  log.info('[ReportScreen] mounted', {
    hasAnalysisResult: !!analysisResult,
    analysis_id:       analysisResult?.analysis_id,
  });

  // No report yet
  if (!analysisResult) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>📄</Text>
        <Text style={styles.emptyTitle}>No Report Yet</Text>
        <Text style={styles.emptySubtitle}>
          Analyze a case first, then tap the{' '}
          <Text style={styles.emptyHighlight}>📄 Report</Text> button on the results page.
        </Text>
      </View>
    );
  }

  const {
    analysis_id,
    case_summary       = '',
    similar_cases      = [],
    relevant_laws      = [],
    generated_questions= [],
    metadata           = {},
    created_at,
    processing_time_seconds,
  } = analysisResult;

  return (
    <View style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Case Report</Text>
        <View style={styles.headerRight} />
      </View>

      <ScrollView style={styles.body} contentContainerStyle={styles.content}>

        {/* Report Title */}
        <View style={styles.reportTitleCard}>
          <Text style={styles.reportTitle}>⚖️ JuriAid Legal Analysis Report</Text>
          <Text style={styles.reportMeta}>File: {metadata.filename}</Text>
          <Text style={styles.reportMeta}>Generated: {new Date(created_at).toLocaleString()}</Text>
          <Text style={styles.reportMeta}>Processing time: {processing_time_seconds?.toFixed(1)} s</Text>
          <Text style={styles.reportMeta}>ID: {analysis_id}</Text>
        </View>

        {/* ── Case Summary ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📋 Case Summary</Text>
          <View style={styles.sectionBody}>
            {renderFormattedText(case_summary)}
          </View>
        </View>

        {/* ── Similar Cases ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>📂 Similar Cases ({similar_cases.length})</Text>
          {similar_cases.length === 0
            ? <Text style={styles.emptyText}>No similar cases found.</Text>
            : similar_cases.map((c, idx) => (
              <View key={c.case_id || idx} style={styles.reportCard}>
                <View style={styles.reportCardHeader}>
                  <Text style={styles.reportCardTitle}>{c.case_name}</Text>
                  <Text style={styles.reportCardScore}>
                    {Math.round((c.score || 0) * 100)}% match
                  </Text>
                </View>
                <Text style={styles.reportCardReason}>{c.reason}</Text>
                <Text style={styles.reportCardBody}>{c.summary}</Text>
              </View>
            ))
          }
        </View>

        {/* ── Relevant Laws ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>⚖️ Relevant Laws ({relevant_laws.length})</Text>
          {relevant_laws.length === 0
            ? <Text style={styles.emptyText}>No relevant laws found.</Text>
            : relevant_laws.map((law, idx) => (
              <View key={`${law.act_id}-${law.section}-${idx}`} style={styles.reportCard}>
                <Text style={styles.reportCardTitle}>
                  Section {law.section}: {law.section_title}
                </Text>
                <Text style={styles.reportCardAct}>{law.title}</Text>
                <Text style={styles.reportCardActId}>Act ID: {law.act_id}</Text>
                {law.content
                  ? <Text style={styles.reportCardBody}>{law.content}</Text>
                  : null
                }
              </View>
            ))
          }
        </View>

        {/* ── Generated Questions ── */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>❓ Generated Questions ({generated_questions.length})</Text>
          {generated_questions.length === 0
            ? <Text style={styles.emptyText}>No questions generated.</Text>
            : generated_questions.map((q, idx) => (
              <View key={q.question_id || idx} style={styles.questionRow}>
                <Text style={styles.questionNum}>Q{q.question_id ?? idx + 1}</Text>
                <Text style={styles.questionText}>{q.question}</Text>
              </View>
            ))
          }
        </View>

      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container:          { flex: 1, backgroundColor: '#F8FAFC' },

  // ── Empty state
  emptyContainer:     { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 32 },
  emptyIcon:          { fontSize: 48, marginBottom: 16 },
  emptyTitle:         { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 8 },
  emptySubtitle:      { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 22 },
  emptyHighlight:     { color: '#005A9C', fontWeight: '700' },

  // ── Header
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  backBtn:            { padding: 4 },
  backText:           { color: '#005A9C', fontSize: 15 },
  headerTitle:        { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  headerRight:        { width: 60 },

  body:               { flex: 1 },
  content:            { padding: 16, paddingBottom: 60 },

  // ── Report title card
  reportTitleCard: {
    backgroundColor: '#005A9C', borderRadius: 12,
    padding: 16, marginBottom: 20,
  },
  reportTitle:        { fontSize: 18, fontWeight: 'bold', color: '#fff', marginBottom: 8 },
  reportMeta:         { fontSize: 12, color: '#BAD4EF', marginBottom: 2 },

  // ── Sections
  section:            { marginBottom: 24 },
  sectionTitle:       { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginBottom: 12 },
  sectionBody: {
    backgroundColor: '#fff', borderRadius: 12,
    padding: 16, borderWidth: 1, borderColor: '#E2E8F0',
  },

  // ── Report cards
  reportCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 14,
    marginBottom: 10, borderWidth: 1, borderColor: '#E2E8F0',
  },
  reportCardHeader:   { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  reportCardTitle:    { fontSize: 14, fontWeight: '700', color: '#1E293B', flex: 1, marginRight: 8 },
  reportCardScore:    { fontSize: 12, fontWeight: '700', color: '#16A34A' },
  reportCardReason:   { fontSize: 12, color: '#64748B', fontStyle: 'italic', marginBottom: 6 },
  reportCardBody:     { fontSize: 13, color: '#374151', lineHeight: 20 },
  reportCardAct:      { fontSize: 12, color: '#3B82F6', marginBottom: 2 },
  reportCardActId:    { fontSize: 11, color: '#94A3B8', marginBottom: 6 },

  // ── Questions
  questionRow: {
    flexDirection: 'row', backgroundColor: '#fff', borderRadius: 10,
    padding: 12, marginBottom: 8, borderWidth: 1, borderColor: '#E2E8F0',
  },
  questionNum:        { fontSize: 13, fontWeight: 'bold', color: '#005A9C', marginRight: 10, minWidth: 28 },
  questionText:       { fontSize: 14, color: '#374151', lineHeight: 20, flex: 1 },

  emptyText:          { color: '#94A3B8', fontSize: 14, textAlign: 'center', paddingVertical: 12 },

  // ── Markdown
  mdHeader:           { fontSize: 16, fontWeight: 'bold', color: '#1E293B', marginTop: 12, marginBottom: 4 },
  mdSubHeader:        { fontSize: 14, fontWeight: 'bold', color: '#334155', marginTop: 8, marginBottom: 2 },
  mdText:             { fontSize: 14, color: '#374151', lineHeight: 22 },
  mdBold:             { fontWeight: 'bold', color: '#1E293B' },
  mdSpacer:           { fontSize: 6 },
});

export default ReportScreen;