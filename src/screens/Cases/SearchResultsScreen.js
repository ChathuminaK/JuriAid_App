import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Modal, ActivityIndicator, Alert,
} from 'react-native';
import { log } from '../../api/index';
import pastCaseService from '../../api/pastcase';

const cleanText = (text) => text ? text.replace(/\[Page \d+\]/g, '').trim() : text;

const renderCaseText = (text) => {
  if (!text) return null;
  return text.split('\n').map((line, i) => (
    <Text key={i} style={styles.caseBodyText}>{line}</Text>
  ));
};

const CaseDetailModal = ({ visible, caseData, loading, onClose }) => {
  const [activeSection, setActiveSection] = useState('judgment');

  const sections = [
    (caseData?.judgment || caseData?.judgment_preview) ? { key: 'judgment',  label: '⚖️ Case'  } : null,
    caseData?.complaint                                ? { key: 'complaint', label: '📋 Complaint' } : null,
    caseData?.defense                                  ? { key: 'defense',   label: '🛡 Defense'   } : null,
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

const SearchResultsScreen = ({ route, navigation }) => {
  const { searchResult } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedCase, setSelectedCase] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleCasePress = async (caseItem) => {
    setSelectedCase({ case_name: caseItem.case_name });
    setModalVisible(true);
    setLoading(true);
    try {
      const detail = await pastCaseService.getCaseById(caseItem.case_id);
      setSelectedCase(detail);
    } catch (error) {
      log.error('[SearchResults] Failed to load case:', error);
      Alert.alert('Error', 'Failed to load case details');
      setModalVisible(false);
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
        <Text style={styles.headerTitle}>Search Results</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.resultsCount}>
          Found {searchResult.similar_cases?.length || 0} similar cases
        </Text>

        {(searchResult.similar_cases || []).length === 0 && (
          <Text style={styles.emptyText}>No similar cases found.</Text>
        )}

        {(searchResult.similar_cases || []).map((caseItem, index) => (
          <TouchableOpacity
            key={caseItem.case_id || index}
            style={styles.caseCard}
            onPress={() => handleCasePress(caseItem)}
          >
            <View style={styles.caseHeader}>
              <Text style={styles.caseTitle} numberOfLines={2}>{caseItem.case_name}</Text>
              <View style={styles.scoreBadge}>
                <Text style={styles.scoreText}>
                  {Math.round((caseItem.final_score || 0) * 100)}%
                </Text>
              </View>
            </View>
            <Text style={styles.reason}>{caseItem.reason}</Text>
            <Text style={styles.tapHint}>👆 Tap to view full case</Text>
          </TouchableOpacity>
        ))}
      </ScrollView>

      <CaseDetailModal
        visible={modalVisible}
        caseData={selectedCase}
        loading={loading}
        onClose={() => { setModalVisible(false); setSelectedCase(null); }}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
    backgroundColor: '#fff', borderBottomWidth: 1, borderBottomColor: '#E2E8F0',
  },
  backBtn: { padding: 4 },
  backText: { color: '#005A9C', fontSize: 15 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  content: { flex: 1 },
  contentContainer: { padding: 16 },
  resultsCount: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 16 },
  emptyText: { textAlign: 'center', color: '#94A3B8', fontSize: 14, marginTop: 40 },
  caseCard: {
    backgroundColor: '#fff', borderRadius: 12, padding: 16,
    marginBottom: 12, borderWidth: 1, borderColor: '#E2E8F0',
  },
  caseHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 8 },
  caseTitle: { fontSize: 15, fontWeight: '700', color: '#1E293B', flex: 1, marginRight: 12 },
  scoreBadge: { backgroundColor: '#D1FAE5', borderRadius: 6, paddingHorizontal: 8, paddingVertical: 4 },
  scoreText: { fontSize: 12, fontWeight: '700', color: '#065F46' },
  reason: { fontSize: 13, color: '#64748B', marginBottom: 8, fontStyle: 'italic' },
  tapHint: { fontSize: 11, color: '#3B82F6' },
  // Modal
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: 16, paddingTop: 50, paddingBottom: 12,
    backgroundColor: '#005A9C', borderBottomWidth: 1, borderBottomColor: '#004080',
  },
  modalTitle: { fontSize: 15, fontWeight: 'bold', color: '#fff', flex: 1, marginRight: 8 },
  modalCloseBtn: { padding: 6, backgroundColor: 'rgba(255,255,255,0.2)', borderRadius: 8 },
  modalCloseText: { color: '#fff', fontSize: 13, fontWeight: '600' },
  modalLoading: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  modalLoadingText: { marginTop: 12, color: '#64748B', fontSize: 14 },
  modalTabBar: { backgroundColor: '#fff', maxHeight: 48, borderBottomWidth: 1, borderBottomColor: '#E2E8F0' },
  modalTab: { paddingHorizontal: 18, paddingVertical: 13, borderBottomWidth: 2, borderBottomColor: 'transparent' },
  modalActiveTab: { borderBottomColor: '#005A9C' },
  modalTabText: { fontSize: 13, color: '#64748B', fontWeight: '500' },
  modalActiveTabText: { color: '#005A9C', fontWeight: '700' },
  modalBody: { flex: 1 },
  modalContent: { padding: 16, paddingBottom: 40 },
  caseBodyText: { fontSize: 14, color: '#374151', lineHeight: 22, marginBottom: 4 },
});

export default SearchResultsScreen;