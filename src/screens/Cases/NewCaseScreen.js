import React, { useState } from 'react';
import {
  View, Text, StyleSheet, TouchableOpacity, Alert,
  ScrollView, ActivityIndicator, TextInput,
} from 'react-native';
import { pick, types, isErrorWithCode, errorCodes } from '@react-native-documents/picker';
import { log } from '../../api/index';
import orchestratorService from '../../api/orchestrator';

const NewCaseScreen = ({ navigation }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [prompt, setPrompt]             = useState('Analyze this Sri Lankan divorce case');
  const [loading, setLoading]           = useState(false);
  const [uploadPhase, setUploadPhase]   = useState('');

  // ── Pick PDF ──────────────────────────────────────────────────────────────
  const handlePickDocument = async () => {
    log.info('[NewCaseScreen] handlePickDocument called');
    try {
      const [result] = await pick({
        type: [types.pdf],
        allowMultiSelection: false,
      });

      log.info('[NewCaseScreen] document picked:', {
        name: result.name,
        size: result.size,
        type: result.type,
        uri:  result.uri,
      });

      // Validate file size (max 10 MB)
      if (result.size && result.size > 10 * 1024 * 1024) {
        log.warn('[NewCaseScreen] file too large:', result.size);
        Alert.alert('File Too Large', `File is ${(result.size / 1024 / 1024).toFixed(1)} MB. Maximum allowed is 10 MB.`);
        return;
      }

      setSelectedFile(result);
    } catch (err) {
      if (isErrorWithCode(err, errorCodes.OPERATION_CANCELED)) {
        log.info('[NewCaseScreen] document pick cancelled by user');
      } else {
        log.error('[NewCaseScreen] document pick error:', err.message);
        Alert.alert('Error', 'Failed to pick document. Please try again.');
      }
    }
  };

  // ── Analyse ───────────────────────────────────────────────────────────────
  const handleAnalyze = async () => {
    if (!selectedFile) {
      log.warn('[NewCaseScreen] handleAnalyze – no file selected');
      Alert.alert('No File', 'Please select a PDF file first.');
      return;
    }

    log.info('[NewCaseScreen] handleAnalyze started', {
      file:   selectedFile.name,
      size:   selectedFile.size,
      prompt,
    });

    setLoading(true);
    setUploadPhase('Uploading file…');

    try {
      setUploadPhase('Running AI analysis… (this may take few minutes)');

      const result = await orchestratorService.analyzeCase(selectedFile, prompt);

      log.info('[NewCaseScreen] analysis completed', {
        analysis_id:             result.analysis_id,
        status:                  result.status,
        processing_time_seconds: result.processing_time_seconds,
        similar_cases:           result.similar_cases?.length,
        relevant_laws:           result.relevant_laws?.length,
        generated_questions:     result.generated_questions?.length,
        saved_for_reference:     result.metadata?.saved_for_reference,
      });

      setUploadPhase('Done! ✅');
      navigation.navigate('CaseAnalysisResult', { analysisResult: result });

    } catch (error) {
      log.error('[NewCaseScreen] analysis failed:', error);

      // 422 – structured "Invalid case type" from orchestrator
      if (error && typeof error === 'object' && error.error === 'Invalid case type') {
        Alert.alert(
          '❌ Invalid Case Type',
          `${error.message || 'This does not appear to be a Sri Lankan matrimonial case.'}\n\n${error.hint || 'Please upload a divorce plaint, answer, or judgment PDF.'}`,
          [{ text: 'OK' }]
        );
      } else {
        Alert.alert(
          'Analysis Failed',
          typeof error === 'string' ? error : 'Something went wrong. Please try again.'
        );
      }
    } finally {
      setLoading(false);
      setUploadPhase('');
    }
  };

  // ── Save Without Analysis ─────────────────────────────────────────────────
  const handleSaveOnly = async () => {
    if (!selectedFile) {
      log.warn('[NewCaseScreen] handleSaveOnly – no file selected');
      Alert.alert('No File', 'Please select a PDF file first.');
      return;
    }

    log.info('[NewCaseScreen] handleSaveOnly started', { file: selectedFile.name });
    setLoading(true);
    setUploadPhase('Saving case…');

    try {
      const result = await orchestratorService.saveCase(selectedFile);
      log.info('[NewCaseScreen] saveCase success:', result);
      Alert.alert('Saved ✅', 'Case saved for future reference.');
    } catch (error) {
      log.error('[NewCaseScreen] saveCase failed:', error);
      Alert.alert('Save Failed', typeof error === 'string' ? error : 'Failed to save case.');
    } finally {
      setLoading(false);
      setUploadPhase('');
    }
  };

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <ScrollView style={styles.container} contentContainerStyle={styles.content}>
      <Text style={styles.title}>Divorce Case Analysis Agent</Text>
      <Text style={styles.subtitle}>Upload a Sri Lankan matrimonial case PDF (English) (max 10 MB)</Text>

      {/* File Picker Button */}
      <TouchableOpacity
        style={styles.pickButton}
        onPress={handlePickDocument}
        disabled={loading}
      >
        <Text style={styles.pickButtonText}>
          {selectedFile ? `📄 ${selectedFile.name}` : '📁 Select PDF File'}
        </Text>
      </TouchableOpacity>

      {/* File Info */}
      {selectedFile && (
        <View style={styles.fileInfoBox}>
          <Text style={styles.fileInfoText}>
            📦 Size: {selectedFile.size ? (selectedFile.size / 1024 / 1024).toFixed(2) + ' MB' : 'Unknown'}
          </Text>
          <Text style={styles.fileInfoText}>🗂 Type: {selectedFile.type}</Text>
        </View>
      )}

      {/* Prompt Input */}
      <Text style={styles.label}>Analysis Prompt</Text>
      <TextInput
        style={styles.promptInput}
        value={prompt}
        onChangeText={(text) => {
          log.info('[NewCaseScreen] prompt changed:', text);
          setPrompt(text);
        }}
        placeholder="e.g., Analyze this Sri Lankan divorce case"
        placeholderTextColor="#9CA3AF"
        multiline
        editable={!loading}
      />

      {/* Loading */}
      {loading && (
        <View style={styles.loadingContainer}>
          <ActivityIndicator size="large" color="#005A9C" />
          <Text style={styles.loadingText}>{uploadPhase}</Text>
          <Text style={styles.loadingHint}>Please keep the app open and screen active…</Text>
        </View>
      )}

      {/* Action Buttons */}
      {!loading && (
        <>
          <TouchableOpacity
            style={[styles.analyzeButton, !selectedFile && styles.buttonDisabled]}
            onPress={handleAnalyze}
            disabled={!selectedFile}
          >
            <Text style={styles.analyzeButtonText}>🔍 Analyze Case</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.saveButton, !selectedFile && styles.buttonDisabled]}
            onPress={handleSaveOnly}
            disabled={!selectedFile}
          >
            <Text style={styles.saveButtonText}>💾 Save Only (No Analysis)</Text>
          </TouchableOpacity>
        </>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container:         { flex: 1, backgroundColor: '#F8FAFC' },
  content:           { padding: 20, paddingBottom: 40 },
  title:             { fontSize: 24, fontWeight: 'bold', color: '#1E293B', marginBottom: 6 },
  subtitle:          { fontSize: 14, color: '#64748B', marginBottom: 24 },

  pickButton: {
    backgroundColor: '#EFF6FF',
    borderWidth: 2, borderColor: '#93C5FD', borderStyle: 'dashed',
    borderRadius: 12, padding: 20, alignItems: 'center', marginBottom: 8,
  },
  pickButtonText:    { fontSize: 15, color: '#1D4ED8', fontWeight: '600' },

  fileInfoBox: {
    backgroundColor: '#F0FDF4', borderRadius: 8, padding: 10,
    marginBottom: 20, borderWidth: 1, borderColor: '#BBF7D0',
  },
  fileInfoText:      { fontSize: 13, color: '#166534', marginBottom: 2 },

  label:             { fontSize: 14, fontWeight: '600', color: '#374151', marginBottom: 6 },
  promptInput: {
    backgroundColor: '#fff', borderWidth: 1, borderColor: '#D1D5DB',
    borderRadius: 10, padding: 12, fontSize: 14, color: '#1E293B',
    minHeight: 80, textAlignVertical: 'top', marginBottom: 20,
  },

  loadingContainer:  { alignItems: 'center', marginVertical: 24 },
  loadingText:       { marginTop: 12, fontSize: 15, color: '#005A9C', fontWeight: '600', textAlign: 'center' },
  loadingHint:       { marginTop: 4, fontSize: 12, color: '#94A3B8', textAlign: 'center' },

  analyzeButton: {
    backgroundColor: '#005A9C', borderRadius: 12,
    padding: 16, alignItems: 'center', marginBottom: 12,
  },
  analyzeButtonText: { color: '#fff', fontSize: 16, fontWeight: 'bold' },

  saveButton: {
    backgroundColor: '#F1F5F9', borderRadius: 12,
    padding: 16, alignItems: 'center',
    borderWidth: 1, borderColor: '#CBD5E1',
  },
  saveButtonText:    { color: '#334155', fontSize: 15, fontWeight: '600' },
  buttonDisabled:    { opacity: 0.4 },
});

export default NewCaseScreen;