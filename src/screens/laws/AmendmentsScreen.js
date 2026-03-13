import React from 'react';
import {
  StyleSheet, Text, View, SafeAreaView, ScrollView, TouchableOpacity,
} from 'react-native';
import { Scale, BookOpen } from 'lucide-react-native';

const AmendmentsScreen = ({ navigation }) => {
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Scale color="#065F46" size={28} />
        <Text style={styles.headerTitle}>Legal Resources</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <TouchableOpacity
          style={styles.actionCard}
          onPress={() => navigation.navigate('SearchLaws')}
        >
          <View style={styles.actionIconContainer}>
            <Scale color="#FFFFFF" size={32} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>Search Relevant Laws</Text>
            <Text style={styles.actionDescription}>
              Upload a case PDF to find relevant laws and statutes from our knowledge graph
            </Text>
          </View>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, { backgroundColor: '#3B82F6' }]}
          onPress={() => navigation.navigate('Resources')}
        >
          <View style={styles.actionIconContainer}>
            <BookOpen color="#FFFFFF" size={32} />
          </View>
          <View style={styles.actionContent}>
            <Text style={styles.actionTitle}>External Resources</Text>
            <Text style={styles.actionDescription}>
              Access external Sri Lankan legal databases and official websites
            </Text>
          </View>
        </TouchableOpacity>

        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>ℹ️ About Legal Search</Text>
          <Text style={styles.infoText}>
            Our AI-powered legal search uses a knowledge graph of Sri Lankan laws to find the most relevant statutes and case laws for your case.
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
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
    gap: 12,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1E293B',
  },
  content: { flex: 1 },
  contentContainer: { padding: 20 },
  actionCard: {
    flexDirection: 'row',
    backgroundColor: '#065F46',
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
    backgroundColor: '#ECFDF5',
    borderRadius: 12,
    padding: 20,
    marginTop: 8,
    borderLeftWidth: 4,
    borderLeftColor: '#065F46',
  },
  infoTitle: {
    fontSize: 16,
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

export default AmendmentsScreen;