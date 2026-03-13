import React, { useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView,
  FlatList, TouchableOpacity, Alert,
} from 'react-native';
import { useDispatch, useSelector } from 'react-redux';
import { saveReport, deleteReport } from '../redux/slices/reportsSlice';
import { log } from '../api/index';
import reportsAPI from '../api/reports';

const ReportScreen = ({ navigation }) => {
  const dispatch     = useDispatch();
  const savedReports = useSelector((state) => state.reports.savedReports);
  const token        = useSelector((state) => state.auth.token);

  log.info('[ReportScreen] mounted, savedReports count:', savedReports.length);

  useEffect(() => {
    if (!token) return;
    reportsAPI.getReports()
      .then((reports) => {
        log.info('[ReportScreen] loaded reports from backend:', reports.length);
        reports.forEach((r) => {
          const alreadyIn = savedReports.some((s) => s.analysis_id === r.analysis_id);
          if (!alreadyIn) dispatch(saveReport(r));
        });
      })
      .catch((e) => {
        log.warn('[ReportScreen] failed to load reports from backend:', e);
      });
  }, [token, dispatch]);

  const handleDelete = (analysisId) => {
    Alert.alert(
      'Delete Report',
      'Remove this report from saved reports?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            dispatch(deleteReport(analysisId));
            log.info('[ReportScreen] deleted report from Redux:', analysisId);
            try {
              await reportsAPI.deleteReport(analysisId);
              log.info('[ReportScreen] deleted report from backend:', analysisId);
            } catch (e) {
              log.warn('[ReportScreen] backend delete failed (non-fatal):', e);
            }
          },
        },
      ]
    );
  };

  const handleOpen = (item) => {
    log.info('[ReportScreen] opening report:', item.analysis_id);
    navigation.navigate('Cases', {
      screen: 'CaseAnalysisResult',
      params: { analysisResult: item },
    });
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => handleOpen(item)} activeOpacity={0.8}>
      <View style={styles.cardHeader}>
        <View style={styles.cardTitleRow}>
          <View style={styles.fileIcon}>
            <Text style={styles.fileIconText}>📄</Text>
          </View>
          <Text style={styles.cardFileName} numberOfLines={1}>
            {item.metadata?.filename || 'Case Report'}
          </Text>
        </View>
        <TouchableOpacity
          style={styles.deleteBtn}
          onPress={() => handleDelete(item.analysis_id)}
          hitSlop={{ top: 12, bottom: 12, left: 12, right: 12 }}
        >
          <Text style={styles.deleteBtnText}>Delete</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.cardSummary} numberOfLines={3}>
        {item.case_summary || 'No summary available.'}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.cardDate}>
          {item.savedAt ? new Date(item.savedAt).toLocaleDateString('en-GB', {
            day: 'numeric', month: 'short', year: 'numeric',
          }) : 'Unknown date'}
        </Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚖️ {(item.similar_cases || []).length} Cases</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>📜 {(item.relevant_laws || []).length} Laws</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>❓ F&A</Text>
          </View>
        </View>
      </View>

      <View style={styles.viewHint}>
        <Text style={styles.viewHintText}>Tap to open full report →</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Saved Reports</Text>
        <Text style={styles.headerSub}>
          {savedReports.length} report{savedReports.length !== 1 ? 's' : ''}
        </Text>
      </View>

      {savedReports.length === 0 ? (
        <View style={styles.emptyContainer}>
          <Text style={styles.emptyIcon}>📂</Text>
          <Text style={styles.emptyTitle}>No Saved Reports</Text>
          <Text style={styles.emptySubtitle}>
            Analyse a case and tap{'\n'}
            <Text style={styles.emptyHighlight}>💾 Save Report</Text>
            {'\n'}to see it here.
          </Text>
        </View>
      ) : (
        <FlatList
          data={savedReports}
          keyExtractor={(item) => item.analysis_id || String(Math.random())}
          renderItem={renderItem}
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
        />
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea:     { flex: 1, backgroundColor: '#F8FAFC' },
  header:       { backgroundColor: '#005A9C', padding: 20, paddingTop: 50, paddingBottom: 24 },
  headerTitle:  { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSub:    { fontSize: 13, color: '#BFD9F2', marginTop: 4 },
  list:         { padding: 16 },

  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06,
    shadowRadius: 6,
    elevation: 2,
  },
  cardHeader:    { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 10 },
  cardTitleRow:  { flexDirection: 'row', alignItems: 'center', flex: 1, marginRight: 12 },
  fileIcon:      { marginRight: 8 },
  fileIconText:  { fontSize: 18 },
  cardFileName:  { fontSize: 14, fontWeight: '700', color: '#1E293B', flex: 1 },

  deleteBtn:     { backgroundColor: '#FEE2E2', borderRadius: 8, paddingHorizontal: 10, paddingVertical: 5 },
  deleteBtnText: { fontSize: 12, fontWeight: '700', color: '#DC2626' },

  cardSummary:  { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 12 },

  cardFooter:   { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6, marginBottom: 10 },
  cardDate:     { fontSize: 11, color: '#94A3B8' },
  badgeRow:     { flexDirection: 'row', gap: 6 },
  badge:        { backgroundColor: '#EBF4FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:    { fontSize: 11, color: '#005A9C', fontWeight: '600' },

  viewHint:     { borderTopWidth: 1, borderTopColor: '#F1F5F9', paddingTop: 8 },
  viewHintText: { fontSize: 11, color: '#94A3B8', textAlign: 'right' },

  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon:      { fontSize: 56, marginBottom: 16 },
  emptyTitle:     { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
  emptySubtitle:  { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 24 },
  emptyHighlight: { color: '#005A9C', fontWeight: '700' },
});

export default ReportScreen;