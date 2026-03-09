import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, ActivityIndicator,
} from 'react-native';
import { Scroll } from 'lucide-react-native';
import lawStatKGService from '../../api/lawstatkg';
import { log } from '../../api/index';

const JURISDICTION_COLORS = {
  Jaffna:  '#7C3AED',
  Kandyan: '#D97706',
  Muslim:  '#059669',
  General: '#2563EB',
};

const AmendmentsListScreen = ({ navigation }) => {
  const [loading, setLoading]   = useState(true);
  const [data, setData]         = useState(null);
  const [fetchError, setFetchError] = useState(null);

  useEffect(() => {
    loadAmendments();
  }, []);

  const loadAmendments = async () => {
    setLoading(true);
    setFetchError(null);
    try {
      const result = await lawStatKGService.getAmendments();
      log.info('[AmendmentsList] loaded', { count: result?.count });
      setData(result);
    } catch (err) {
      log.error('[AmendmentsList] fetch error:', err);
      setFetchError(typeof err === 'string' ? err : 'Failed to load amendments. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Amendments</Text>
        <View style={{ width: 60 }} />
      </View>

      {loading ? (
        <View style={styles.center}>
          <ActivityIndicator size="large" color="#065F46" />
          <Text style={styles.loadingText}>Loading amendments…</Text>
        </View>
      ) : fetchError ? (
        <View style={styles.center}>
          <Text style={styles.errorText}>{fetchError}</Text>
          <TouchableOpacity style={styles.retryBtn} onPress={loadAmendments}>
            <Text style={styles.retryText}>Retry</Text>
          </TouchableOpacity>
        </View>
      ) : (
        <ScrollView contentContainerStyle={styles.list}>
          <View style={styles.summaryRow}>
            <Scroll color="#065F46" size={18} />
            <Text style={styles.summaryText}>
              {data?.count ?? 0} Amendments · As of {data?.as_of_date}
            </Text>
          </View>

          {(data?.amendments ?? []).map((item) => {
            const color = JURISDICTION_COLORS[item.jurisdiction] ?? '#475569';
            return (
              <View key={item.amend_id} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.badge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.badgeText, { color }]}>{item.jurisdiction}</Text>
                  </View>
                  <Text style={styles.dateText}>{item.date}</Text>
                </View>
                <Text style={styles.amendTitle}>{item.am_title}</Text>
                <Text style={styles.sectionLabel}>
                  §{item.section_no} · {item.section_title}
                </Text>
                <Text style={styles.summary}>{item.summary}</Text>
              </View>
            );
          })}
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container:   { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn:     { padding: 4 },
  backText:    { color: '#065F46', fontSize: 15 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  center: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 24,
  },
  loadingText: { marginTop: 12, color: '#64748B', fontSize: 15 },
  errorText:   { color: '#DC2626', fontSize: 15, textAlign: 'center', marginBottom: 16 },
  retryBtn: {
    backgroundColor: '#065F46',
    paddingVertical: 10,
    paddingHorizontal: 24,
    borderRadius: 8,
  },
  retryText: { color: '#FFFFFF', fontWeight: '600' },
  list: { padding: 16 },
  summaryRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 16,
    backgroundColor: '#ECFDF5',
    padding: 12,
    borderRadius: 10,
  },
  summaryText: { color: '#065F46', fontSize: 14, fontWeight: '600' },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardTop: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 10,
  },
  badge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText:   { fontSize: 12, fontWeight: '700' },
  dateText:    { fontSize: 12, color: '#64748B' },
  amendTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 6,
  },
  sectionLabel: {
    fontSize: 13,
    color: '#475569',
    fontStyle: 'italic',
    marginBottom: 8,
  },
  summary: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 20,
  },
});

export default AmendmentsListScreen;