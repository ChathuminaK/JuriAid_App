import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  TextInput,
  ScrollView,
  Alert,
  ActivityIndicator,
  Platform,
} from 'react-native';
import { ArrowLeft, Upload, FileText, Sparkles, X } from 'lucide-react-native';
import { pick, types } from '@react-native-documents/picker';
import { orchestratorService } from '../../api/orchestrator';

const NewCaseScreen = ({ navigation }) => {
  const [caseTitle, setCaseTitle] = useState('');
  const [clientName, setClientName] = useState('');
  const [priority, setPriority] = useState('Medium');
  const [description, setDescription] = useState('');
  const [customPrompt, setCustomPrompt] = useState('');
  const [selectedFile, setSelectedFile] = useState(null);
  const [loading, setLoading] = useState(false);

  // Pick document from device
  const pickDocument = async () => {
    try {
      const result = await pick({
        type: [types.pdf, types.plainText],
        allowMultiSelection: false,
      });

      if (result && result.length > 0) {
        setSelectedFile(result[0]);
        Alert.alert('Success', `File selected: ${result[0].name}`);
      }
    } catch (err) {
      if (err?.code !== 'DOCUMENT_PICKER_CANCELED') {
        Alert.alert('Error', 'Failed to pick document');
        console.error('Document picker error:', err);
      }
    }
  };

  // Remove selected file
  const removeFile = () => {
    setSelectedFile(null);
  };

  // Smart Navigation Based on AI Response
  const handleNavigationBasedOnResponse = (response) => {
    console.log('[DEBUG] ========== NAVIGATION HANDLER ==========');
    console.log('[DEBUG] Full Response:', JSON.stringify(response, null, 2));
    
    // Validate response structure
    if (!response || !response.success) {
      console.error('[ERROR] Invalid response - missing success flag');
      Alert.alert('Error', 'Invalid response from server');
      return;
    }

    if (!response.results || !Array.isArray(response.results)) {
      console.error('[ERROR] Invalid response - missing or invalid results array');
      Alert.alert('Error', 'No analysis results received from server');
      return;
    }

    const { results } = response;
    console.log('[DEBUG] Results count:', results.length);
    console.log('[DEBUG] Tools executed:', results.map(r => r.tool).join(', '));

    // Extract all tool results
    const toolMap = {};
    results.forEach(result => {
      toolMap[result.tool] = result.output;
      console.log(`[DEBUG] Tool '${result.tool}' has output:`, !!result.output);
    });

    // Determine navigation based on tools present
    const hasKB = 'update_kb' in toolMap;
    const hasSummary = 'summarize' in toolMap || 'core_summary' in toolMap;
    const hasStatutes = 'family_statutes' in toolMap;
    const hasPrecedents = 'family_precedents' in toolMap;
    const hasQuestions = 'family_questions' in toolMap;

    console.log('[DEBUG] Tools detected:', {
      hasKB,
      hasSummary,
      hasStatutes,
      hasPrecedents,
      hasQuestions,
      totalTools: results.length
    });

    // Get summary data if exists
    const summaryData = toolMap.summarize || toolMap.core_summary;
    const extractedTitle = summaryData?.title || caseTitle || 'Case Analysis';

    // CASE 1: Knowledge Base Save (highest priority - always check first)
    if (hasKB) {
      const kbData = toolMap.update_kb;
      const totalEntries = kbData?.total_entries || kbData?.message || 'N/A';
      
      console.log('[NAVIGATION] ✓ Case 1: Knowledge Base save detected');
      console.log('[NAVIGATION] KB Data:', kbData);
      console.log('[NAVIGATION] Total entries:', totalEntries);
      console.log('[NAVIGATION] Has additional analysis?', hasSummary || hasStatutes || hasPrecedents);
      
      // Check if there's ANY additional analysis alongside KB save
      if (hasSummary || hasStatutes || hasPrecedents || hasQuestions) {
        Alert.alert(
          '✓ Case Saved to Knowledge Base',
          `Successfully saved!\nTotal cases: ${totalEntries}\n\nWould you like to view the detailed analysis?`,
          [
            {
              text: 'View Analysis',
              onPress: () => {
                console.log('[NAVIGATION] → Navigating to CaseAnalysisResult after KB save');
                navigation.navigate('CaseAnalysisResult', {
                  caseId: response.timestamp || new Date().toISOString(),
                  analysisData: response,
                  caseTitle: extractedTitle,
                  clientName: clientName,
                  priority: priority,
                });
              },
            },
            {
              text: 'Done',
              onPress: () => {
                console.log('[NAVIGATION] → User dismissed, going back');
                navigation.goBack();
              },
              style: 'cancel',
            },
          ]
        );
      } else {
        // ONLY KB save, no other analysis
        console.log('[NAVIGATION] → Only KB save, no additional analysis');
        Alert.alert(
          '✓ Saved to Knowledge Base',
          `Your case has been saved successfully.\n\nTotal cases: ${totalEntries}`,
          [{ 
            text: 'OK', 
            onPress: () => {
              console.log('[NAVIGATION] → Going back after KB-only save');
              navigation.goBack();
            }
          }]
        );
      }
      return;
    }

    // CASE 2: Questions Only (no summary, no other tools)
    if (hasQuestions && !hasSummary && !hasStatutes && !hasPrecedents) {
      console.log('[NAVIGATION] ✓ Case 2: Questions only detected');
      console.log('[NAVIGATION] → Navigating to GeneratedQuestions');
      
      navigation.navigate('GeneratedQuestions', {
        caseTitle: extractedTitle,
        questions: toolMap.family_questions,
        analysisData: response,
      });
      return;
    }

    // CASE 3: Full Analysis (summary + at least one other tool)
    if (hasSummary && (hasStatutes || hasPrecedents || hasQuestions || results.length >= 2)) {
      console.log('[NAVIGATION] ✓ Case 3: Full analysis detected');
      console.log('[NAVIGATION] → Navigating to CaseAnalysisResult');
      
      navigation.navigate('CaseAnalysisResult', {
        caseId: response.timestamp || new Date().toISOString(),
        analysisData: response,
        caseTitle: extractedTitle,
        clientName: clientName,
        priority: priority,
      });
      return;
    }

    // CASE 4: Summary Only (just summarize/core_summary, nothing else)
    if (hasSummary && results.length === 1) {
      console.log('[NAVIGATION] ✓ Case 4: Summary only detected');
      console.log('[NAVIGATION] → Navigating to CaseAnalysisResult');
      
      navigation.navigate('CaseAnalysisResult', {
        caseId: response.timestamp || new Date().toISOString(),
        analysisData: response,
        caseTitle: extractedTitle,
        clientName: clientName,
        priority: priority,
      });
      return;
    }

    // CASE 5: Statutes or Precedents only (no summary)
    if ((hasStatutes || hasPrecedents) && !hasSummary) {
      console.log('[NAVIGATION] ✓ Case 5: Legal research only (no summary)');
      console.log('[NAVIGATION] → Navigating to CaseAnalysisResult');
      
      navigation.navigate('CaseAnalysisResult', {
        caseId: response.timestamp || new Date().toISOString(),
        analysisData: response,
        caseTitle: extractedTitle,
        clientName: clientName,
        priority: priority,
      });
      return;
    }

    // FALLBACK: Any other combination - navigate to results with alert
    console.log('[NAVIGATION] ⚠ Fallback: Unhandled combination of tools');
    console.log('[NAVIGATION] → Showing alert with navigation option');
    
    Alert.alert(
      'Analysis Complete',
      `AI successfully analyzed your case using ${results.length} tool(s).\n\nTools: ${results.map(r => r.tool).join(', ')}`,
      [
        {
          text: 'View Results',
          onPress: () => {
            console.log('[NAVIGATION] → Navigating to CaseAnalysisResult from fallback');
            navigation.navigate('CaseAnalysisResult', {
              caseId: response.timestamp || new Date().toISOString(),
              analysisData: response,
              caseTitle: extractedTitle,
              clientName: clientName,
              priority: priority,
            });
          },
        },
        {
          text: 'Close',
          onPress: () => {
            console.log('[NAVIGATION] → User closed fallback alert');
            navigation.goBack();
          },
          style: 'cancel',
        },
      ]
    );
  };

  // Handle case upload - AI ANALYSIS with Smart Routing
  const handleUploadCase = async () => {
    if (!selectedFile) {
      Alert.alert('Error', 'Please select a file first');
      return;
    }

    if (!caseTitle.trim() || !clientName.trim()) {
      Alert.alert('Error', 'Please fill in case title and client name');
      return;
    }

    setLoading(true);
    
    try {
      console.log('[UPLOAD] ========== STARTING UPLOAD ==========');
      console.log('[UPLOAD] File:', selectedFile.name);
      console.log('[UPLOAD] Case Title:', caseTitle);
      console.log('[UPLOAD] Client:', clientName);
      console.log('[UPLOAD] Custom Prompt:', customPrompt || '(none)');
      
      // Prepare file object
      const file = {
        uri: Platform.OS === 'ios' ? selectedFile.uri.replace('file://', '') : selectedFile.uri,
        type: selectedFile.mimeType || selectedFile.type || 'application/pdf',
        name: selectedFile.name,
      };

      // Prepare prompt
      const aiPrompt = customPrompt.trim() || 
        `Analyze this ${caseTitle} divorce case for ${clientName}. Identify relevant Sri Lankan family law statutes, find similar precedents, generate client intake questions, and provide comprehensive summary. Priority: ${priority}.`;
      
      console.log('[UPLOAD] Final prompt:', aiPrompt);

      // Call API
      const response = await orchestratorService.agentPlanRun(file, aiPrompt);
      
      console.log('[UPLOAD] ========== API RESPONSE RECEIVED ==========');
      console.log('[UPLOAD] Success:', response?.success);
      console.log('[UPLOAD] Results count:', response?.results?.length);
      console.log('[UPLOAD] Full response:', JSON.stringify(response, null, 2));

      // Handle response
      if (response && response.success) {
        console.log('[UPLOAD] Valid response - calling navigation handler');
        handleNavigationBasedOnResponse(response);
      } else {
        console.error('[UPLOAD] Invalid response structure');
        Alert.alert('Error', 'Analysis completed but received invalid response format');
      }
      
    } catch (error) {
      console.error('[UPLOAD] ========== ERROR ==========');
      console.error('[UPLOAD] Error:', error);
      console.error('[UPLOAD] Error message:', error.message);
      console.error('[UPLOAD] Error stack:', error.stack);
      
      Alert.alert(
        'Upload Failed',
        error.message || 'An error occurred while analyzing the case'
      );
    } finally {
      setLoading(false);
      console.log('[UPLOAD] ========== UPLOAD COMPLETE ==========');
    }
  };

  // Analyze text without file upload (public endpoint)
  const handleAnalyzeText = async () => {
    if (!description.trim()) {
      Alert.alert('Error', 'Please enter case description to analyze');
      return;
    }

    setLoading(true);
    try {
      const response = await orchestratorService.analyzeText(description);
      
      Alert.alert(
        'Quick Analysis Complete',
        typeof response === 'string' 
          ? response 
          : JSON.stringify(response, null, 2),
        [{ text: 'OK' }]
      );
    } catch (error) {
      Alert.alert('Analysis Failed', error.toString());
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color="#005A9C" size={24} />
          </TouchableOpacity>
          <View style={{ flex: 1 }}>
            <Text style={styles.headerTitle}>New Divorce Case</Text>
            <Text style={styles.headerSubtitle}>AI-Powered Analysis</Text>
          </View>
          <View style={{ width: 40 }} />
        </View>

        {/* Form */}
        <ScrollView 
          style={styles.form} 
          showsVerticalScrollIndicator={false}
          keyboardShouldPersistTaps="handled"
        >
          {/* Case Details */}
          <View style={styles.inputGroup}>
            <Text style={styles.label}>Case Title *</Text>
            <TextInput
              style={styles.input}
              placeholder="e.g., Divorce - Cruelty & Abandonment"
              value={caseTitle}
              onChangeText={setCaseTitle}
              placeholderTextColor="#9CA3AF"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Client Name *</Text>
            <TextInput
              style={styles.input}
              placeholder="Enter client name"
              value={clientName}
              onChangeText={setClientName}
              placeholderTextColor="#9CA3AF"
              editable={!loading}
            />
          </View>

          <View style={styles.inputGroup}>
            <Text style={styles.label}>Priority Level</Text>
            <View style={styles.priorityContainer}>
              {['Low', 'Medium', 'High'].map((level) => (
                <TouchableOpacity
                  key={level}
                  style={[
                    styles.priorityButton,
                    priority === level && styles.priorityButtonActive,
                  ]}
                  onPress={() => setPriority(level)}
                  disabled={loading}
                >
                  <Text
                    style={[
                      styles.priorityText,
                      priority === level && styles.priorityTextActive,
                    ]}
                  >
                    {level}
                  </Text>
                </TouchableOpacity>
              ))}
            </View>
          </View>

          {/* File Upload Section */}
          <View style={styles.section}>
            <View style={{ flexDirection: 'row', alignItems: 'center', gap: 8, marginBottom: 12 }}>
              <Sparkles color="#F59E0B" size={20} />
              <Text style={styles.sectionTitle}>Upload Case Document</Text>
            </View>
            
            <TouchableOpacity 
              style={[
                styles.uploadButton,
                selectedFile && styles.uploadButtonWithFile,
              ]}
              onPress={pickDocument}
              disabled={loading}
            >
              <Upload color={selectedFile ? "#10B981" : "#005A9C"} size={24} />
              <Text style={[
                styles.uploadButtonText,
                selectedFile && styles.uploadButtonTextActive,
              ]}>
                {selectedFile ? 'Change File' : 'Select PDF or TXT file'}
              </Text>
            </TouchableOpacity>

            {selectedFile && (
              <View style={styles.fileInfo}>
                <FileText color="#10B981" size={20} />
                <View style={{ flex: 1, marginLeft: 12 }}>
                  <Text style={styles.fileName}>{selectedFile.name}</Text>
                  <Text style={styles.fileSize}>
                    {selectedFile.size 
                      ? `${(selectedFile.size / 1024).toFixed(2)} KB`
                      : 'Size unknown'
                    }
                  </Text>
                </View>
                <TouchableOpacity 
                  onPress={removeFile}
                  style={styles.removeFileButton}
                  disabled={loading}
                >
                  <X color="#EF4444" size={20} />
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Custom AI Instructions */}
          {selectedFile && (
            <View style={styles.section}>
              <Text style={styles.sectionTitle}>AI Analysis Instructions (Optional)</Text>
              <Text style={styles.sectionHint}>
                Guide the AI: "Full analysis" / "Save to database" / "Show statutes only" / "Find precedents"
              </Text>
              
              <View style={styles.inputGroup}>
                <TextInput
                  style={[styles.input, styles.textArea]}
                  placeholder="Enter custom instructions for AI agent (or leave blank for comprehensive analysis)..."
                  value={customPrompt}
                  onChangeText={setCustomPrompt}
                  multiline
                  numberOfLines={4}
                  textAlignVertical="top"
                  placeholderTextColor="#9CA3AF"
                  editable={!loading}
                />
              </View>

              {/* Quick Preset Prompts */}
              <Text style={styles.presetsLabel}>Quick Presets:</Text>
              <View style={styles.presetButtonsContainer}>
                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => setCustomPrompt('Analyze this divorce case comprehensively with statutes, precedents, and client questions')}
                  disabled={loading}
                >
                  <Sparkles color="#005A9C" size={14} />
                  <Text style={styles.presetButtonText}>Full Analysis</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => setCustomPrompt('Save this case to knowledge base')}
                  disabled={loading}
                >
                  <Text style={styles.presetButtonText}>💾 Update Case knowledge</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => setCustomPrompt('Show me only relevant family law statutes')}
                  disabled={loading}
                >
                  <Text style={styles.presetButtonText}>⚖️ Statutes</Text>
                </TouchableOpacity>
                
                <TouchableOpacity
                  style={styles.presetButton}
                  onPress={() => setCustomPrompt('Find similar past divorce cases only')}
                  disabled={loading}
                >
                  <Text style={styles.presetButtonText}>📚 Cases</Text>
                </TouchableOpacity>
              </View>
            </View>
          )}

          {/* Upload & Analyze Button */}
          {selectedFile && (
            <TouchableOpacity
              style={[styles.submitButton, loading && styles.submitButtonDisabled]}
              onPress={handleUploadCase}
              disabled={loading}
            >
              {loading ? (
                <>
                  <ActivityIndicator color="#FFFFFF" />
                  <Text style={styles.submitButtonText}>AI is analyzing...</Text>
                </>
              ) : (
                <>
                  <Sparkles color="#FFFFFF" size={20} />
                  <Text style={styles.submitButtonText}>
                    Upload & Analyze with AI
                  </Text>
                </>
              )}
            </TouchableOpacity>
          )}

          {/* Bottom spacing */}
          <View style={{ height: 40 }} />
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  headerSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  form: { flex: 1, padding: 20 },
  inputGroup: { marginBottom: 20 },
  label: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  input: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    paddingHorizontal: 16,
    paddingVertical: 12,
    fontSize: 16,
    color: '#1E293B',
  },
  textArea: { height: 100, paddingTop: 12 },
  priorityContainer: { flexDirection: 'row', gap: 12 },
  priorityButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    backgroundColor: '#FFFFFF',
    alignItems: 'center',
  },
  priorityButtonActive: {
    backgroundColor: '#005A9C',
    borderColor: '#005A9C',
  },
  priorityText: { fontSize: 14, fontWeight: '600', color: '#64748B' },
  priorityTextActive: { color: '#FFFFFF' },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionHint: {
    fontSize: 12,
    color: '#64748B',
    marginBottom: 12,
    fontStyle: 'italic',
  },
  uploadButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    borderWidth: 2,
    borderColor: '#005A9C',
    borderStyle: 'dashed',
    paddingVertical: 20,
    gap: 12,
  },
  uploadButtonWithFile: {
    borderColor: '#10B981',
    borderStyle: 'solid',
    backgroundColor: '#F0FDF4',
  },
  uploadButtonText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#005A9C',
  },
  uploadButtonTextActive: {
    color: '#10B981',
  },
  fileInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F0FDF4',
    borderRadius: 12,
    padding: 16,
    marginTop: 12,
    borderWidth: 1,
    borderColor: '#BBF7D0',
  },
  fileName: { fontSize: 14, fontWeight: '600', color: '#1E293B' },
  fileSize: { fontSize: 12, color: '#64748B', marginTop: 2 },
  removeFileButton: {
    padding: 8,
    backgroundColor: '#FEE2E2',
    borderRadius: 8,
  },
  presetsLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8,
  },
  presetButtonsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  presetButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    backgroundColor: '#EBF4FF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#005A9C',
    gap: 6,
  },
  presetButtonText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#005A9C',
  },
  submitButton: {
    flexDirection: 'row',
    backgroundColor: '#005A9C',
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    marginTop: 8,
    shadowColor: '#005A9C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  submitButtonDisabled: { opacity: 0.6 },
  submitButtonText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default NewCaseScreen;