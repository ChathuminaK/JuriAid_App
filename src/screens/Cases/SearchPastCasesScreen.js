import React, { useState } from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  Alert, ActivityIndicator, ScrollView,
} from 'react-native';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { Search, FileText, Upload } from 'lucide-react-native';
import pastCaseService from '../../api/pastcase';
import { log } from '../../api/index';

const SearchPastCasesScreen = ({ navigation }) => {
  const [file, setFile] = useState(null);
  const [searching, setSearching] = useState(false);

  const handlePickDocument = async () => {
    log.info('[SearchPastCases] handlePickDocument called');
    try {
      const [result] = await pick({
        type: [types.pdf],
        allowMultiSelection: false,
      });

      log.info('[SearchPastCases] document picked:', {
        name: result.name,
        size: result.size,
        type: result.type,
        uri: result.uri,
      });

      // Validate file size (max 10 MB)
      if (result.size && result.size > 10 * 1024 * 1024) {
        log.warn('[SearchPastCases] file too large:', result.size);
        Alert.alert('File Too Large', `File is ${(result.size / 1024 / 1024).toFixed(1)} MB. Maximum allowed is 10 MB.`);
        return;
      }

      setFile(result);
    } catch (err) {
      if (isErrorWithCode(err, errorCodes.OPERATION_CANCELED)) {
        log.info('[SearchPastCases] document pick cancelled by user');
      } else {
        log.error('[SearchPastCases] document pick error:', err.message);
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
      const result = await pastCaseService.searchSimilarCases(file);
      log.info('[SearchPastCases] Search complete:', result);
      
      navigation.navigate('SearchResults', { searchResult: result });
    } catch (error) {
      log.error('[SearchPastCases] Search failed:', error);
      Alert.alert('Search Failed', 'Could not search similar cases. Please try again.');
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
        <Text style={styles.headerTitle}>Search Similar Cases</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Search color="#005A9C" size={64} />
        </View>

        <Text style={styles.title}>Find Similar Past Cases</Text>
        <Text style={styles.subtitle}>
          Upload a legal case PDF to find similar cases from our database
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
            <FileText color="#005A9C" size={32} />
            <View style={styles.fileInfo}>
              <Text style={styles.fileName}>{file.name}</Text>
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
                <Search color="#FFFFFF" size={20} />
                <Text style={styles.searchButtonText}>Search Similar Cases</Text>
              </>
            )}
          </TouchableOpacity>
        )}

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ How it works</Text>
          <Text style={styles.infoText}>
            • Upload a Sri Lankan legal case PDF{'\n'}
            • Our AI finds similar cases from the database{'\n'}
            • View similarity scores and case details{'\n'}
            • Access full case judgments
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
  backText: { color: '#005A9C', fontSize: 15 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  content: { flex: 1 },
  contentContainer: { padding: 20, alignItems: 'center' },
  iconContainer: {
    width: 120,
    height: 120,
    borderRadius: 60,
    backgroundColor: '#EBF4FF',
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
    backgroundColor: '#005A9C',
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
  },
  searchButtonDisabled: {
    opacity: 0.6,
  },
  searchButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  infoBox: {
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    padding: 20,
    marginTop: 32,
    width: '100%',
    borderLeftWidth: 4,
    borderLeftColor: '#005A9C',
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

export default SearchPastCasesScreen;