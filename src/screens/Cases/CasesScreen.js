import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView
} from 'react-native';
import { PlusCircle, Search, FileSearch } from 'lucide-react-native';

const CasesScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.header}>Case Analysis</Text>
            <Text style={styles.subHeader}>AI-powered legal case analysis</Text>
          </View>
        </View>

        <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
          <TouchableOpacity
            style={styles.actionCard}
            onPress={() => navigation.navigate('NewCase')}
          >
            <View style={styles.actionIconContainer}>
              <PlusCircle color="#FFFFFF" size={32} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Analyze New Case</Text>
              <Text style={styles.actionDescription}>
                Upload a legal case PDF for AI analysis with similar cases, relevant laws, and generated questions
              </Text>
            </View>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.actionCard, { backgroundColor: '#0F766E' }]}
            onPress={() => navigation.navigate('SearchPastCases')}
          >
            <View style={styles.actionIconContainer}>
              <FileSearch color="#FFFFFF" size={32} />
            </View>
            <View style={styles.actionContent}>
              <Text style={styles.actionTitle}>Search Similar Cases</Text>
              <Text style={styles.actionDescription}>
                Find similar past cases from our database by uploading a case PDF
              </Text>
            </View>
          </TouchableOpacity>

          <View style={styles.infoBox}>
            <Text style={styles.infoTitle}>📚 How It Works</Text>
            <Text style={styles.infoText}>
              <Text style={styles.infoBold}>Analyze New Case:</Text> Get comprehensive AI analysis with similar cases, relevant laws, and legal questions{'\n\n'}
              <Text style={styles.infoBold}>Search Similar Cases:</Text> Find matching cases from our database with similarity scores
            </Text>
          </View>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, padding: 20 },
  headerContainer: { marginBottom: 24 },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  subHeader: {
    fontSize: 14,
    color: '#64748B',
  },
  content: { flex: 1 },
  contentContainer: { paddingBottom: 20 },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#005A9C',
    borderRadius: 16,
    padding: 20,
    marginBottom: 16,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 4,
  },
  actionIconContainer: {
    width: 64,
    height: 64,
    borderRadius: 32,
    backgroundColor: 'rgba(255,255,255,0.2)',
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  actionContent: { flex: 1 },
  actionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 8,
  },
  actionDescription: {
    fontSize: 14,
    color: '#FFFFFF',
    opacity: 0.9,
    lineHeight: 20,
  },
  infoBox: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 22,
  },
  infoBold: {
    fontWeight: '600',
    color: '#1E293B',
  },
});

export default CasesScreen;