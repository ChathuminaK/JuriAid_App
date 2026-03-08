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
  const dispatch      = useDispatch();
  const savedReports  = useSelector((state) => state.reports.savedReports);
  const token = useSelector((state) => state.auth.token);

  log.info('[ReportScreen] mounted, savedReports count:', savedReports.length);

  // Load reports from backend on mount
  useEffect(() => {
    if (!token) return;
    
    reportsAPI.getReports()
      .then((reports) => {
        log.info('[ReportScreen] loaded reports from backend:', reports.length);
        reports.forEach((r) => {
          const alreadyIn = savedReports.some((s) => s.analysis_id === r.analysis_id);
          if (!alreadyIn) {
            dispatch(saveReport(r));
          }
        });
      })
      .catch((e) => {
        log.warn('[ReportScreen] failed to load reports from backend:', e);
        // Non-fatal: user can still see locally saved reports
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
            // Remove from Redux immediately
            dispatch(deleteReport(analysisId));
            log.info('[ReportScreen] deleted report from Redux:', analysisId);
            
            // Try to delete from backend (non-blocking)
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
        <Text style={styles.cardId} numberOfLines={1}>
          🗂 {item.analysis_id ? item.analysis_id.substring(0, 20) + '…' : 'Report'}
        </Text>
        <TouchableOpacity
          onPress={() => handleDelete(item.analysis_id)}
          hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
        >
          <Text style={styles.deleteIcon}>🗑</Text>
        </TouchableOpacity>
      </View>

      <Text style={styles.cardFileName}>
        📄 {item.metadata?.filename || 'Unknown file'}
      </Text>

      <Text style={styles.cardSummary} numberOfLines={3}>
        {item.case_summary || 'No summary available.'}
      </Text>

      <View style={styles.cardFooter}>
        <Text style={styles.cardDate}>
          {item.savedAt ? new Date(item.savedAt).toLocaleDateString() : 'N/A'}
        </Text>
        <View style={styles.badgeRow}>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>⚖️ {(item.similar_cases || []).length} Cases</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>📜 {(item.relevant_laws || []).length} Laws</Text>
          </View>
          <View style={styles.badge}>
            <Text style={styles.badgeText}>❓  F&A</Text>
          </View>
        </View>
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
  safeArea:        { flex: 1, backgroundColor: '#F8FAFC' },

  header:          { backgroundColor: '#005A9C', padding: 20, paddingTop: 50, paddingBottom: 24 },
  headerTitle:     { fontSize: 22, fontWeight: 'bold', color: '#fff' },
  headerSub:       { fontSize: 13, color: '#BFD9F2', marginTop: 4 },

  list:            { padding: 16 },

  card: {
    backgroundColor: '#fff', borderRadius: 16, padding: 16,
    marginBottom: 14, borderWidth: 1, borderColor: '#E2E8F0',
    shadowColor: '#000', shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.06, shadowRadius: 6, elevation: 2,
  },
  cardHeader:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 },
  cardId:          { fontSize: 13, fontWeight: '700', color: '#005A9C', flex: 1 },
  deleteIcon:      { fontSize: 18 },

  cardFileName:    { fontSize: 12, color: '#64748B', marginBottom: 8 },
  cardSummary:     { fontSize: 13, color: '#475569', lineHeight: 20, marginBottom: 12 },

  cardFooter:      { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 6 },
  cardDate:        { fontSize: 11, color: '#94A3B8' },
  badgeRow:        { flexDirection: 'row', gap: 6 },
  badge:           { backgroundColor: '#EBF4FF', borderRadius: 8, paddingHorizontal: 8, paddingVertical: 3 },
  badgeText:       { fontSize: 11, color: '#005A9C', fontWeight: '600' },

  emptyContainer:  { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon:       { fontSize: 56, marginBottom: 16 },
  emptyTitle:      { fontSize: 20, fontWeight: 'bold', color: '#1E293B', marginBottom: 10 },
  emptySubtitle:   { fontSize: 14, color: '#64748B', textAlign: 'center', lineHeight: 24 },
  emptyHighlight:  { color: '#005A9C', fontWeight: '700' },
});

export default ReportScreen;