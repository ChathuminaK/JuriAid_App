import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView, TextInput,
  TouchableOpacity, ActivityIndicator, Alert, KeyboardAvoidingView, Platform,
} from 'react-native';
import { Search } from 'lucide-react-native';
import lawStatKGService from '../../api/lawstatkg';
import { log } from '../../api/index';

const JURISDICTION_COLORS = {
  Jaffna:  '#7C3AED',
  Kandyan: '#D97706',
  Muslim:  '#059669',
  General: '#2563EB',
};

const LawQuerySearchScreen = ({ navigation }) => {
  const [query, setQuery]     = useState('');
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searched, setSearched] = useState(false);

  const handleSearch = async () => {
    if (!query.trim()) {
      Alert.alert('Empty Query', 'Please enter a search term.');
      return;
    }
    setLoading(true);
    setSearched(true);
    try {
      const data = await lawStatKGService.searchLaws({ query: query.trim() });
      log.info('[LawQuerySearch] results:', data?.length);
      setResults(data ?? []);
    } catch (err) {
      log.error('[LawQuerySearch] error:', err);
      Alert.alert('Search Failed', typeof err === 'string' ? err : 'Could not search laws. Please try again.');
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
        <Text style={styles.headerTitle}>Search Laws</Text>
        <View style={{ width: 60 }} />
      </View>

      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
      >
        <View style={styles.searchRow}>
          <TextInput
            style={styles.input}
            placeholder="e.g. divorce adultery desertion"
            placeholderTextColor="#94A3B8"
            value={query}
            onChangeText={setQuery}
            onSubmitEditing={handleSearch}
            returnKeyType="search"
          />
          <TouchableOpacity
            style={[styles.searchBtn, loading && styles.searchBtnDisabled]}
            onPress={handleSearch}
            disabled={loading}
          >
            {loading
              ? <ActivityIndicator color="#fff" size="small" />
              : <Search color="#fff" size={20} />
            }
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.resultsList}>
          {!searched && (
            <Text style={styles.hintText}>
              Type a legal topic, keyword, or principle to search Sri Lankan statutes.
            </Text>
          )}

          {searched && !loading && results.length === 0 && (
            <Text style={styles.noResults}>No results found. Try a different query.</Text>
          )}

          {results.map((item, idx) => {
            const doc = item.doc;
            const color = JURISDICTION_COLORS[doc.jurisdiction] ?? '#475569';
            const scorePercent = Math.round((item.score ?? 0) * 100);
            return (
              <View key={doc.version_id ?? String(idx)} style={styles.card}>
                <View style={styles.cardTop}>
                  <View style={[styles.badge, { backgroundColor: color + '20' }]}>
                    <Text style={[styles.badgeText, { color }]}>{doc.jurisdiction}</Text>
                  </View>
                  {/* <View style={styles.scoreChip}>
                    <Text style={styles.scoreText}>Score {scorePercent}%</Text>
                  </View> */}
                </View>

                <Text style={styles.lawName}>{doc.law}</Text>
                <Text style={styles.sectionTitle}>§{doc.section_no} · {doc.section_title}</Text>
                <Text style={styles.sectionText} numberOfLines={5}>{doc.text}</Text>

                <View style={styles.metaRow}>
                  <Text style={styles.metaText}>Valid from: {doc.valid_from ?? '—'}</Text>
                  <View style={[
                    styles.statusBadge,
                    doc.current_status === 'active' ? styles.statusActive : styles.statusInactive,
                  ]}>
                    <Text style={styles.statusText}>{doc.current_status}</Text>
                  </View>
                </View>
              </View>
            );
          })}
        </ScrollView>
      </KeyboardAvoidingView>
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
  searchRow: {
    flexDirection: 'row',
    margin: 16,
    gap: 10,
  },
  input: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 14,
    paddingVertical: 12,
    fontSize: 15,
    color: '#1E293B',
  },
  searchBtn: {
    backgroundColor: '#0F766E',
    borderRadius: 12,
    paddingHorizontal: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  searchBtnDisabled: { opacity: 0.6 },
  resultsList: { paddingHorizontal: 16, paddingBottom: 24 },
  hintText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 40,
    lineHeight: 22,
  },
  noResults: {
    textAlign: 'center',
    color: '#64748B',
    fontSize: 15,
    marginTop: 40,
  },
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
  badgeText:  { fontSize: 12, fontWeight: '700' },
  scoreChip: {
    backgroundColor: '#F1F5F9',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  scoreText:  { fontSize: 12, color: '#475569', fontWeight: '600' },
  lawName: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  sectionTitle: {
    fontSize: 13,
    color: '#0F766E',
    fontWeight: '600',
    marginBottom: 8,
  },
  sectionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 12,
  },
  metaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  metaText: { fontSize: 12, color: '#94A3B8' },
  statusBadge: {
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 12,
  },
  statusActive:   { backgroundColor: '#DCFCE7' },
  statusInactive: { backgroundColor: '#FEE2E2' },
  statusText:     { fontSize: 11, fontWeight: '700', color: '#1E293B' },
});

export default LawQuerySearchScreen;