import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  FlatList,
  Dimensions
} from 'react-native';
import { 
  Gavel, 
  Book, 
  Building, 
  Scale, 
  Users, 
  FileText, 
  Globe,
  Video,
  Award,
  MessageCircle
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const categories = [
  { id: 'all', title: 'All', icon: <Globe color="#1C4587" size={20} /> },
  { id: 'legal', title: 'Legal', icon: <Scale color="#1C4587" size={20} /> },
  { id: 'education', title: 'Education', icon: <Book color="#1C4587" size={20} /> },
  { id: 'services', title: 'Services', icon: <Building color="#1C4587" size={20} /> },
];

const resources = [
  { 
    id: '1',
    title: 'Legal Dictionary', 
    icon: <Book color="#FFFFFF" size={24}/>, 
    description: 'Comprehensive legal terminology and definitions',
    category: 'education',
    color: '#1C4587', // Navy Blue - Traditional legal color
    rating: 4.8,
    users: '1.2K'
  },
  { 
    id: '2',
    title: 'Find a Lawyer', 
    icon: <Gavel color="#FFFFFF" size={24}/>, 
    description: 'Connect with verified legal professionals',
    category: 'services',
    color: '#8B4513', // Saddle Brown - Professional & authoritative
    rating: 4.9,
    users: '856'
  },
  { 
    id: '3',
    title: 'Know Your Rights', 
    icon: <Scale color="#FFFFFF" size={24}/>, 
    description: 'Essential guides on legal rights and procedures',
    category: 'education',
    color: '#0F4C5C', 
    rating: 4.7,
    users: '2.1K'
  },
  { 
    id: '4',
    title: 'Legal Aid Clinics', 
    icon: <Building color="#FFFFFF" size={24}/>, 
    description: 'Free legal assistance and consultation centers',
    category: 'services',
    color: '#2C5F2D', 
    rating: 4.6,
    users: '743'
  },
  { 
    id: '5',
    title: 'Legal Documents', 
    icon: <FileText color="#FFFFFF" size={24}/>, 
    description: 'Templates and forms for common legal procedures',
    category: 'legal',
    color: '#6B2D5C', 
    rating: 4.5,
    users: '967'
  },
  { 
    id: '6',
    title: 'Video Tutorials', 
    icon: <Video color="#FFFFFF" size={24}/>, 
    description: 'Step-by-step legal process explanations',
    category: 'education',
    color: '#8B0000',
    rating: 4.8,
    users: '1.5K'
  }
];

const ResourcesScreen = () => {
  const [selectedCategory, setSelectedCategory] = useState('all');

  const filteredResources = selectedCategory === 'all' 
    ? resources 
    : resources.filter(resource => resource.category === selectedCategory);

  const renderCategory = ({ item }) => (
    <TouchableOpacity
      style={[
        styles.categoryButton,
        selectedCategory === item.id && styles.categoryButtonActive
      ]}
      onPress={() => setSelectedCategory(item.id)}
    >
      {item.icon}
      <Text style={[
        styles.categoryText,
        selectedCategory === item.id && styles.categoryTextActive
      ]}>
        {item.title}
      </Text>
    </TouchableOpacity>
  );

  const renderResource = ({ item, index }) => (
    <TouchableOpacity 
      style={[
        styles.resourceCard,
        { backgroundColor: item.color }
      ]}
    >
      <View style={styles.resourceHeader}>
        <View style={styles.resourceIconContainer}>
          {item.icon}
        </View>
        <View style={styles.resourceRating}>
          <Award color="#FFFFFF" size={16} />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
      </View>

      <View style={styles.resourceContent}>
        <Text style={styles.resourceTitle}>{item.title}</Text>
        <Text style={styles.resourceDescription}>{item.description}</Text>
        
        <View style={styles.resourceFooter}>
          <View style={styles.usersContainer}>
            <Users color="rgba(255,255,255,0.8)" size={16} />
            <Text style={styles.usersText}>{item.users} users</Text>
          </View>
          <TouchableOpacity style={styles.accessButton}>
            <Text style={styles.accessButtonText}>Access</Text>
          </TouchableOpacity>
        </View>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Header */}
        <View style={styles.headerSection}>
          <Text style={styles.header}>Legal Resources</Text>
          <Text style={styles.subHeader}>Empower yourself with knowledge and tools</Text>
        </View>

        {/* Quick Stats */}
        <View style={styles.statsContainer}>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>50+</Text>
            <Text style={styles.statLabel}>Resources</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>10K+</Text>
            <Text style={styles.statLabel}>Active Users</Text>
          </View>
          <View style={styles.statCard}>
            <Text style={styles.statNumber}>24/7</Text>
            <Text style={styles.statLabel}>Available</Text>
          </View>
        </View>

        {/* Categories */}
        <FlatList
          data={categories}
          renderItem={renderCategory}
          keyExtractor={(item) => item.id}
          horizontal
          showsHorizontalScrollIndicator={false}
          style={styles.categoriesContainer}
          contentContainerStyle={styles.categoriesContent}
        />

        {/* Featured Resource */}
        <View style={styles.featuredCard}>
          <View style={styles.featuredHeader}>
            <MessageCircle color="#1C4587" size={24} />
            <Text style={styles.featuredTitle}>AI Legal Assistant</Text>
          </View>
          <Text style={styles.featuredDescription}>
            Get instant answers to your legal questions with our AI-powered assistant
          </Text>
          <TouchableOpacity style={styles.featuredButton}>
            <Text style={styles.featuredButtonText}>Try Now</Text>
          </TouchableOpacity>
        </View>

        {/* Resources Grid */}
        <Text style={styles.sectionTitle}>Browse Resources</Text>
        <FlatList
          data={filteredResources}
          renderItem={renderResource}
          keyExtractor={(item) => item.id}
          numColumns={2}
          scrollEnabled={false}
          columnWrapperStyle={styles.resourceRow}
          contentContainerStyle={styles.resourcesGrid}
        />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F5F5F0' 
  },
  container: { 
    flex: 1,
    padding: 20 
  },
  headerSection: {
    marginBottom: 24
  },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1C2833', 
    marginBottom: 4
  },
  subHeader: { 
    fontSize: 16, 
    color: '#5D6D7E' 
  },
  statsContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12
  },
  statCard: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
    borderWidth: 1,
    borderColor: '#D5DBDB' // Subtle border
  },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#1C4587', // Navy blue
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: '#5D6D7E'
  },
  categoriesContainer: {
    marginBottom: 24
  },
  categoriesContent: {
    paddingRight: 20
  },
  categoryButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 16,
    marginRight: 12,
    borderWidth: 1,
    borderColor: '#D5DBDB'
  },
  categoryButtonActive: {
    backgroundColor: '#1C4587',
    borderColor: '#1C4587'
  },
  categoryText: {
    marginLeft: 8,
    fontSize: 14,
    fontWeight: '500',
    color: '#5D6D7E'
  },
  categoryTextActive: {
    color: '#FFFFFF'
  },
  featuredCard: {
    backgroundColor: '#E8EAF6',
    borderRadius: 20,
    padding: 24,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#C5CAE9'
  },
  featuredHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1C4587', // Navy blue
    marginLeft: 12
  },
  featuredDescription: {
    fontSize: 14,
    color: '#2C3E50', // Dark gray-blue
    marginBottom: 16,
    lineHeight: 20
  },
  featuredButton: {
    backgroundColor: '#1C4587', // Navy blue
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 12,
    alignSelf: 'flex-start'
  },
  featuredButtonText: {
    color: '#FFFFFF',
    fontWeight: '600',
    fontSize: 14
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1C2833', // Dark charcoal
    marginBottom: 16
  },
  resourcesGrid: {
    paddingBottom: 100
  },
  resourceRow: {
    justifyContent: 'space-between',
    marginBottom: 16
  },
  resourceCard: {
    width: (width - 52) / 2,
    borderRadius: 20,
    padding: 20,
    height: 200,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 5
  },
  resourceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 16
  },
  resourceIconContainer: {
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center'
  },
  resourceRating: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 12
  },
  ratingText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600',
    marginLeft: 4
  },
  resourceContent: {
    flex: 1,
    justifyContent: 'space-between'
  },
  resourceTitle: { 
    fontSize: 16, 
    fontWeight: '700', 
    color: '#FFFFFF',
    marginBottom: 8
  },
  resourceDescription: { 
    fontSize: 12, 
    color: 'rgba(255,255,255,0.95)',
    lineHeight: 16,
    flex: 1
  },
  resourceFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },
  usersContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  usersText: {
    color: 'rgba(255,255,255,0.85)',
    fontSize: 12,
    marginLeft: 4
  },
  accessButton: {
    backgroundColor: 'rgba(255,255,255,0.25)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8
  },
  accessButtonText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontWeight: '600'
  }
});

export default ResourcesScreen;