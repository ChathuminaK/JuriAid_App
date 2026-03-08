import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Linking,
} from 'react-native';
import { BookOpen, ExternalLink, FileText, Globe } from 'lucide-react-native';

const ResourcesScreen = ({ navigation }) => {
  const resources = [
    {
      title: 'Sri Lankan Legal Database',
      url: 'http://www.commonlii.org/lk/',
      icon: <Globe color="#005A9C" size={24} />,
      description: 'Free Sri Lankan legal information',
    },
    {
      title: 'Supreme Court of Sri Lanka',
      url: 'https://www.supremecourt.lk/',
      icon: <FileText color="#005A9C" size={24} />,
      description: 'Official Supreme Court website',
    },
    {
      title: 'Parliament of Sri Lanka',
      url: 'https://www.parliament.lk/',
      icon: <BookOpen color="#005A9C" size={24} />,
      description: 'Acts and legislation',
    },
  ];

  const handleOpenLink = (url) => {
    Linking.openURL(url).catch((err) => {
      Alert.alert('Error', 'Unable to open link');
    });
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <BookOpen color="#005A9C" size={28} />
        <Text style={styles.headerTitle}>Legal Resources</Text>
      </View>

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.sectionTitle}>External Legal Resources</Text>
        
        {resources.map((resource, index) => (
          <TouchableOpacity
            key={index}
            style={styles.resourceCard}
            onPress={() => handleOpenLink(resource.url)}
          >
            <View style={styles.resourceIcon}>{resource.icon}</View>
            <View style={styles.resourceContent}>
              <Text style={styles.resourceTitle}>{resource.title}</Text>
              <Text style={styles.resourceDescription}>{resource.description}</Text>
              <Text style={styles.resourceUrl}>{resource.url}</Text>
            </View>
            <ExternalLink color="#64748B" size={20} />
          </TouchableOpacity>
        ))}

        <View style={styles.infoBox}>
          <Text style={styles.infoText}>
            These resources provide additional legal information for Sri Lankan law. JuriAid is not affiliated with these organizations.
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
  sectionTitle: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  resourceCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    gap: 12,
  },
  resourceIcon: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: '#EBF4FF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  resourceContent: { flex: 1 },
  resourceTitle: {
    fontSize: 15,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4,
  },
  resourceDescription: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 4,
  },
  resourceUrl: {
    fontSize: 11,
    color: '#3B82F6',
  },
  infoBox: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    padding: 16,
    marginTop: 20,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  infoText: {
    fontSize: 13,
    color: '#92400E',
    lineHeight: 20,
  },
});

export default ResourcesScreen;