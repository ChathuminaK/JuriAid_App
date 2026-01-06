import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator, StyleSheet, SafeAreaView, TouchableOpacity } from 'react-native';
import { ArrowLeft } from 'lucide-react-native';

const CaseDetailScreen = ({ route, navigation }) => {
  const { caseId } = route.params;
  const [loading, setLoading] = useState(true);
  const [caseData, setCaseData] = useState(null);

  useEffect(() => {
    fetchFullCase();
  }, []);

  const fetchFullCase = async () => {
    try {
      // Hits your FastAPI endpoint: @app.get("/case/{case_id}")
      const response = await fetch(`http://10.0.2.2:8000/case/${caseId}?raw=false`);
      const data = await response.json();
      setCaseData(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <ArrowLeft color="#005A9C" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Case Detail</Text>
        <View style={{ width: 24 }} />
      </View>

      {loading ? (
        <ActivityIndicator size="large" color="#005A9C" style={{ marginTop: 50 }} />
      ) : (
        <ScrollView contentContainerStyle={styles.content}>
          <Text style={styles.caseIdTitle}>Case ID: {caseId}</Text>
          <View style={styles.divider} />
          <Text style={styles.fullText}>{caseData?.snippet || "No text available."}</Text>
        </ScrollView>
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#FFF' },
  header: { flexDirection: 'row', padding: 16, alignItems: 'center', justifyContent: 'space-between', borderBottomWidth: 1, borderColor: '#EEE' },
  headerTitle: { fontSize: 18, fontWeight: 'bold' },
  content: { padding: 20 },
  caseIdTitle: { fontSize: 22, fontWeight: 'bold', color: '#005A9C', marginBottom: 10 },
  divider: { height: 2, backgroundColor: '#E0F2FE', marginBottom: 20 },
  fullText: { fontSize: 16, lineHeight: 24, color: '#334155', textAlign: 'justify' }
});

export default CaseDetailScreen;