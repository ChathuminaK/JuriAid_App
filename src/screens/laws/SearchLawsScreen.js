import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { Scale, FileText, Upload, BookOpen, Scroll, Search } from 'lucide-react-native';
import lawStatKGService from '../../api/lawstatkg';
import { log } from '../../api/index';

const SearchLawsScreen = ({ navigation }) => {
  const [file, setFile] = useState(null);
  const [searching, setSearching] = useState(false);

  const handlePickDocument = async () => {
    log.info('[SearchLaws] handlePickDocument called');
    try {
      const [result] = await pick({
        type: [types.pdf],
        allowMultiSelection: false,
      });

      log.info('[SearchLaws] document picked:', {
        name: result.name,
        size: result.size,
        type: result.type,
        uri: result.uri,
      });

      if (result.size && result.size > 10 * 1024 * 1024) {
        log.warn('[SearchLaws] file too large:', result.size);
        Alert.alert('File Too Large', `File is ${(result.size / 1024 / 1024).toFixed(1)} MB. Maximum allowed is 10 MB.`);
        return;
      }

      setFile(result);
    } catch (err) {
      if (isErrorWithCode(err, errorCodes.OPERATION_CANCELED)) {
        log.info('[SearchLaws] document pick cancelled by user');
      } else {
        log.error('[SearchLaws] document pick error:', err.message);
        Alert.alert('Error', 'Failed to pick document. Please try again.');
      }
    }
  };

  const handleSearch = async () => {
    if (!file) {
      Alert.alert('No File', 'Please select a PDF file first');
      return;
    }

    setSearching(true);
    try {
      const result = await lawStatKGService.retrieveCaseLaw(file);
      log.info('[SearchLaws] Search complete:', result);
      navigation.navigate('LawResults', { lawResult: result });
    } catch (error) {
      log.error('[SearchLaws] Search failed:', error);
      Alert.alert('Search Failed', 'Could not retrieve relevant laws. Please try again.');
    } finally {
      setSearching(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Relevant Laws</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Scale color="#065F46" size={64} />
        </View>

        <Text style={styles.title}>Find Relevant Case Laws</Text>
        <Text style={styles.subtitle}>
          Upload a legal case PDF to find relevant laws and statutes from our knowledge graph
        </Text>

        <TouchableOpacity
          style={styles.uploadButton}
          onPress={handlePickDocument}
          disabled={searching}
        >
          <Upload color="#FFFFFF" size={24} />
          <Text style={styles.uploadButtonText}>
            {file ? 'Change PDF File' : 'Upload PDF File'}
          </Text>
        </TouchableOpacity>

        {file && (
          <View style={styles.fileCard}>
            <FileText color="#065F46" size={32} />
            <View style={styles.fileInfo}>
              <Text style={styles.fileName} numberOfLines={1}>{file.name}</Text>
              <Text style={styles.fileSize}>
                {file.size ? (file.size / (1024 * 1024)).toFixed(2) + ' MB' : 'Unknown size'}
              </Text>
            </View>
          </View>
        )}

        {file && (
          <TouchableOpacity
            style={[styles.searchButton, searching && styles.searchButtonDisabled]}
            onPress={handleSearch}
            disabled={searching}
          >
            {searching ? (
              <ActivityIndicator color="#FFFFFF" size="small" />
            ) : (
              <>
                <Scale color="#FFFFFF" size={20} />
                <Text style={styles.searchButtonText}>Find Relevant Laws</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        {/* Amendments Button */}
        <TouchableOpacity
          style={styles.amendmentsButton}
          onPress={() => navigation.navigate('AmendmentsList')}
        >
          <Scroll color="#7C3AED" size={20} />
          <Text style={styles.amendmentsButtonText}>View Amendments</Text>
        </TouchableOpacity>

        {/* Search Laws by Query Button */}
        <TouchableOpacity
          style={styles.querySearchButton}
          onPress={() => navigation.navigate('LawQuerySearch')}
        >
          <Search color="#0F766E" size={20} />
          <Text style={styles.querySearchButtonText}>Search Laws by Text</Text>
        </TouchableOpacity>

        {/* External Resources Button */}
        {/* <TouchableOpacity
          style={styles.resourcesButton}
          onPress={() => navigation.navigate('Resources')}
        >
          <BookOpen color="#3B82F6" size={20} />
          <Text style={styles.resourcesButtonText}>External Legal Resources</Text>
        </TouchableOpacity> */}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ How it works</Text>
          <Text style={styles.infoText}>
            • Upload a Sri Lankan legal case PDF{'\n'}
            • AI extracts key topics and legal issues{'\n'}
            • Searches our legal knowledge graph{'\n'}
            • Returns relevant case laws with citations
          </Text>
        </View>
      </ScrollView>
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
  contentContainer: { padding: 20, alignItems: 'center' },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#ECFDF5',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    textAlign: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 15,
    color: '#64748B',
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 32,
  },
  uploadButton: {
    flexDirection: 'row',
    backgroundColor: '#065F46',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    marginBottom: 20,
  },
  uploadButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  fileCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    gap: 16,
    width: '100%',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    marginBottom: 20,
  },
  fileInfo: { flex: 1 },
  fileName: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  fileSize: {
    fontSize: 13,
    color: '#64748B',
  },
  searchButton: {
    flexDirection: 'row',
    backgroundColor: '#0F766E',
    paddingVertical: 16,
    paddingHorizontal: 32,
    borderRadius: 12,
    alignItems: 'center',
    gap: 12,
    width: '100%',
    justifyContent: 'center',
    marginBottom: 16,
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  amendmentsButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#7C3AED',
    marginBottom: 12,
  },
  amendmentsButtonText: {
    color: '#7C3AED',
    fontSize: 15,
    fontWeight: '600',
  },
  querySearchButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#0F766E',
    marginBottom: 12,
  },
  querySearchButtonText: {
    color: '#0F766E',
    fontSize: 15,
    fontWeight: '600',
  },
  resourcesButton: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    gap: 10,
    width: '100%',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: '#3B82F6',
    marginBottom: 24,
  },
  resourcesButtonText: {
    color: '#3B82F6',
    fontSize: 15,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 20,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#065F46',
  },
  infoTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#475569',
    lineHeight: 22,
  },
});

export default SearchLawsScreen;