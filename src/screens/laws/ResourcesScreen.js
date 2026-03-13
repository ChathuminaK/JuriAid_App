import React from 'react';
import {
  View, Text, StyleSheet, SafeAreaView, TouchableOpacity,
  ScrollView, Alert, Linking,
} from 'react-native';
import { Globe, ExternalLink } from 'lucide-react-native';

const resources = [
  {
    id: '1',
    title: 'CommonLII - Sri Lanka',
    description: 'Free access to Sri Lankan legal materials and case law',
    url: 'http://www.commonlii.org/lk/',
    color: '#1D4ED8',
  },
  {
    id: '2',
    title: 'Supreme Court of Sri Lanka',
    description: 'Official Supreme Court judgments and information',
    url: 'http://www.supremecourt.lk/',
    color: '#065F46',
  },
  {
    id: '3',
    title: 'Parliament of Sri Lanka',
    description: 'Acts, bills, and parliamentary documents',
    url: 'https://www.parliament.lk/acts-of-parliament',
    color: '#7C3AED',
  },
  {
    id: '4',
    title: 'Legal Aid Commission',
    description: 'Free legal assistance and resources for Sri Lankans',
    url: 'https://www.legalaid.gov.lk/',
    color: '#B45309',
  },
];

const ResourcesScreen = ({ navigation }) => {
  const handleOpenLink = async (url) => {
    try {
      const supported = await Linking.canOpenURL(url);
      if (supported) {
        await Linking.openURL(url);
      } else {
        Alert.alert('Error', `Cannot open: ${url}`);
      }
    } catch {
      Alert.alert('Error', 'Failed to open link');
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backBtn}>
          <Text style={styles.backText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>External Legal Resources</Text>
        <View style={{ width: 60 }} />
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <View style={styles.iconContainer}>
          <Globe color="#1D4ED8" size={48} />
        </View>
        <Text style={styles.subtitle}>
          Access trusted Sri Lankan legal databases and official resources
        </Text>

        {resources.map((item) => (
          <TouchableOpacity
            key={item.id}
            style={[styles.card, { borderLeftColor: item.color }]}
            onPress={() => handleOpenLink(item.url)}
            activeOpacity={0.75}
          >
            <View style={styles.cardContent}>
              <Text style={styles.cardTitle}>{item.title}</Text>
              <Text style={styles.cardDescription}>{item.description}</Text>
            </View>
            <ExternalLink color={item.color} size={20} />
          </TouchableOpacity>
        ))}
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
  backText: { color: '#1D4ED8', fontSize: 15 },
  headerTitle: { fontSize: 17, fontWeight: 'bold', color: '#1E293B' },
  content: { flex: 1 },
  contentContainer: { padding: 20 },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 12,
  },
  subtitle: {
    fontSize: 14,
    color: '#64748B',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 20,
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderLeftWidth: 4,
    elevation: 1,
  },
  cardContent: { flex: 1, marginRight: 12 },
  cardTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  cardDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
});

export default ResourcesScreen;