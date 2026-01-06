import React, { useState } from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, TouchableOpacity,
  ScrollView, Alert, ActivityIndicator, Platform
} from 'react-native';
import { ArrowLeft, Upload, FileText } from 'lucide-react-native';
import * as DocumentPicker from '@react-native-documents/picker';

const NewCaseScreen = ({ navigation }) => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [uploading, setUploading] = useState(false);

  const handleSelectFile = async () => {
    try {
      const [result] = await DocumentPicker.pick({ 
        type: [DocumentPicker.types.pdf] 
      });
      setSelectedFile(result);
      // Automatically trigger upload after selection
      await uploadAndSearch(result);
    } catch (err) {
      if (!DocumentPicker.isCancel(err)) {
        Alert.alert('Error', 'Failed to select file');
      }
    }
  };

  const uploadAndSearch = async (file) => {
    setUploading(true);
    try {
      const formData = new FormData();
      const fileUri = Platform.OS === 'android' ? file.uri : file.uri.replace('file://', '');

      formData.append('file', {
        uri: fileUri,
        type: file.type || 'application/pdf',
        name: file.name || 'document.pdf',
      });

      // Use 10.0.2.2 for Android Emulator to hit your local Python backend
      const response = await fetch('http://10.0.2.2:8000/upload_and_search?topk=5', {
        method: 'POST',
        body: formData,
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'multipart/form-data',
        },
      });
      if (response.status === 422) {
        const errorData = await response.json();
        Alert.alert('Invalid Document', errorData.detail); 
        return;
      }

      if (!response.ok) throw new Error(`Server Error: ${response.status}`);

      const data = await response.json();

      // CLEANING DATA: Prevents the "Navigate Payload" crash
      const cleanedResults = (data.results || []).map(item => ({
        case_id: String(item.case_id),
        final_score: typeof item.final_score === 'number' ? item.final_score.toFixed(3) : "0.000",
        role: String(item.role),
        snippet: item.snippet ? item.snippet.substring(0, 300).replace(/\s+/g, ' ') + "..." : "No snippet"
      }));

      navigation.navigate('SimilarCases', {
        results: cleanedResults,
        fileName: file.name,
      });

    } catch (error) {
      console.error('Upload Error:', error);
      Alert.alert('Connection Error', 'Backend is unreachable. Check if FastAPI is running.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
            <ArrowLeft color="#005A9C" size={24} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Upload Case</Text>
          <View style={{ width: 40 }} />
        </View>

        <ScrollView contentContainerStyle={styles.uploadContainer}>
          <View style={styles.iconContainer}><Upload color="#005A9C" size={48} /></View>
          <Text style={styles.title}>Legal Analysis</Text>
          <Text style={styles.sub}>Upload a PDF to find matching precedents</Text>
          
          {selectedFile && (
            <View style={styles.selectedFileCard}>
              <FileText color="#005A9C" size={24} />
              <View style={styles.fileInfo}>
                <Text style={styles.fileName}>{selectedFile.name}</Text>
              </View>
            </View>
          )}

          <TouchableOpacity style={styles.uploadButton} onPress={handleSelectFile} disabled={uploading}>
            {uploading ? <ActivityIndicator color="#FFF" /> : <Text style={styles.uploadButtonText}>Select PDF & Search</Text>}
          </TouchableOpacity>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1 },
  header: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', padding: 16, backgroundColor: '#FFF', borderBottomWidth: 1 },
  backButton: { padding: 8 },
  headerTitle: { fontSize: 20, fontWeight: 'bold' },
  uploadContainer: { padding: 20, alignItems: 'center' },
  iconContainer: { width: 80, height: 80, borderRadius: 40, backgroundColor: '#EFF6FF', justifyContent: 'center', alignItems: 'center', marginVertical: 20 },
  title: { fontSize: 22, fontWeight: 'bold', color: '#1E293B' },
  sub: { fontSize: 14, color: '#64748B', marginBottom: 20 },
  selectedFileCard: { flexDirection: 'row', padding: 15, backgroundColor: '#FFF', borderRadius: 10, width: '100%', marginBottom: 20, borderWidth: 1, borderColor: '#DDD' },
  fileInfo: { marginLeft: 10 },
  fileName: { fontWeight: 'bold' },
  uploadButton: { backgroundColor: '#005A9C', width: '100%', padding: 15, borderRadius: 10, alignItems: 'center' },
  uploadButtonText: { color: '#FFF', fontWeight: 'bold' },
});

export default NewCaseScreen;