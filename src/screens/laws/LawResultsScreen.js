import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, ScrollView,
  TouchableOpacity, Modal, ActivityIndicator, Alert,
} from 'react-native';
import { log } from '../../api/index';
import lawStatKGService from '../../api/lawstatkg';

const LawResultsScreen = ({ route, navigation }) => {
  const { lawResult } = route.params;
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedLaw, setSelectedLaw] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleLawPress = async (lawItem) => {
    setSelectedLaw({ case_name: lawItem.case_name, citation: lawItem.citation });
    setModalVisible(true);
    setLoading(true);
    try {
      const detail = await lawStatKGService.getCaseLawById(lawItem.case_id);
      setSelectedLaw(detail);
    } catch (error) {
      log.error('[LawResults] Failed to load law details:', error);
      Alert.alert('Error', 'Failed to load law details');
      setModalVisible(false);
    } finally {
      setLoading(false);
    }
  };

  const renderText = (text) => {
    if (!text) return null;
    if (Array.isArray(text)) {
      return text.map((item, idx) => (
        <Text key={idx} style={styles.lawBodyText}>• {item}</Text>
      ));
    }
    return <Text style={styles.lawBodyText}>{text}</Text>;
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Law Results</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        {lawResult.detected_topics && lawResult.detected_topics.length > 0 && (
          <View style={styles.topicsCard}>
            <Text style={styles.topicsTitle}>📋 Detected Topics</Text>
            <View style={styles.chipRow}>
              {lawResult.detected_topics.map((topic, idx) => (
                <View key={idx} style={styles.chip}>
                  <Text style={styles.chipText}>{topic.replace(/_/g, ' ')}</Text>
                </View>
              ))}
            </View>
          </View>
        )}

        <Text style={styles.resultsCount}>
          Found {lawResult.relevant_case_laws?.length || 0} relevant laws
        </Text>

        {(lawResult.relevant_case_laws || []).map((lawItem, index) => {
          const confidencePct = Math.round((lawItem.confidence_score || 0) * 100);
          
          return (
            <TouchableOpacity
              key={lawItem.case_id || index}
              style={styles.lawCard}
              onPress={() => handleLawPress(lawItem)}
            >
              <View style={styles.lawHeader}>
                <Text style={styles.lawTitle} numberOfLines={2}>
                  {lawItem.case_name || 'Unknown Case'}
                </Text>
                {/* <View style={styles.confidenceBadge}>
                  <Text style={styles.confidenceText}>{confidencePct}%</Text>
                </View> */}
              </View>
              
              {lawItem.citation && (
                <Text style={styles.citation}>Citation: {lawItem.citation}</Text>
              )}
              
              {lawItem.topic && (
                <Text style={styles.topic}>Topic: {lawItem.topic.replace(/_/g, ' ')}</Text>
              )}
              
              {lawItem.principle && lawItem.principle.length > 0 && (
                <Text style={styles.principle} numberOfLines={3}>
                  {lawItem.principle[0]}
                </Text>
              )}
              
              <Text style={styles.tapHint}>👆 Tap to view full details</Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>

      {/* Law Detail Modal */}
      <Modal visible={modalVisible} animationType="slide" onRequestClose={() => setModalVisible(false)}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <View style={{ flex: 1 }}>
              <Text style={styles.modalTitle} numberOfLines={2}>
                {selectedLaw?.case_name || 'Law Details'}
              </Text>
              {selectedLaw?.citation && (
                <Text style={styles.modalSubtitle}>{selectedLaw.citation}</Text>
              )}
            </View>
            <TouchableOpacity
              onPress={() => { setModalVisible(false); setSelectedLaw(null); }}
              style={styles.modalCloseBtn}
            >
              <Text style={styles.modalCloseText}>✕ Close</Text>
            </TouchableOpacity>
          </View>

          {loading ? (
            <View style={styles.modalLoading}>
              <ActivityIndicator size="large" color="#065F46" />
              <Text style={styles.modalLoadingText}>Loading law details...</Text>
            </View>
          ) : (
            <ScrollView style={styles.modalBody} contentContainerStyle={styles.modalContent}>
              {selectedLaw?.section_number && (
                <View style={styles.metaBox}>
                  <Text style={styles.metaLabel}>Section:</Text>
                  <Text style={styles.metaValue}>{selectedLaw.section_number}</Text>
                </View>
              )}

              {selectedLaw?.principle && selectedLaw.principle.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>⚖️ Principle</Text>
                  {renderText(selectedLaw.principle)}
                </View>
              )}

              {selectedLaw?.held && selectedLaw.held.length > 0 && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>🔖 Held</Text>
                  {renderText(selectedLaw.held)}
                </View>
              )}

              {selectedLaw?.facts && (
                <View style={styles.section}>
                  <Text style={styles.sectionTitle}>📋 Facts</Text>
                  {renderText(selectedLaw.facts)}
                </View>
              )}

              {!selectedLaw?.principle && !selectedLaw?.held && !selectedLaw?.facts && (
                <Text style={styles.emptyText}>No details available</Text>
              )}
            </ScrollView>
          )}
        </View>
      </Modal>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backBtn: { padding: 4 },
  backText: { color: '#065F46', fontSize: 15 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  content: { flex: 1 },
  contentContainer: { padding: 16 },
  topicsCard: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#A7F3D0',
  },
  topicsTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  chip: {
    backgroundColor: '#D1FAE5',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  chipText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#065F46',
    textTransform: 'capitalize',
  },
  resultsCount: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 16,
  },
  lawCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  lawHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
  },
  lawTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
    marginRight: 12,
  },
  confidenceBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 6,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  confidenceText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#92400E',
  },
  citation: {
    fontSize: 12,
    color: '#3B82F6',
    marginBottom: 4,
  },
  topic: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 8,
    textTransform: 'capitalize',
  },
  principle: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    marginBottom: 8,
  },
  tapHint: {
    fontSize: 11,
    color: '#065F46',
  },
  modalContainer: { flex: 1, backgroundColor: '#F8FAFC' },
  modalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingTop: 50,
    paddingBottom: 12,
    backgroundColor: '#065F46',
    borderBottomWidth: 1,
    borderBottomColor: '#047857',
  },
  modalTitle: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#fff',
  },
  modalSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.85)',
    marginTop: 4,
  },
  modalCloseBtn: {
    padding: 6,
    backgroundColor: 'rgba(255,255,255,0.2)',
    borderRadius: 8,
  },
  modalCloseText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  modalLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalLoadingText: {
    marginTop: 12,
    color: '#64748B',
    fontSize: 14,
  },
  modalBody: { flex: 1 },
  modalContent: { padding: 16, paddingBottom: 40 },
  metaBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 12,
    marginBottom: 16,
    flexDirection: 'row',
    alignItems: 'center',
  },
  metaLabel: {
    fontSize: 13,
    fontWeight: '700',
    color: '#065F46',
    marginRight: 8,
  },
  metaValue: {
    fontSize: 13,
    color: '#374151',
  },
  section: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  sectionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  lawBodyText: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 22,
    marginBottom: 8,
  },
  emptyText: {
    textAlign: 'center',
    color: '#94A3B8',
    fontSize: 14,
    marginTop: 40,
  },
});

export default LawResultsScreen;