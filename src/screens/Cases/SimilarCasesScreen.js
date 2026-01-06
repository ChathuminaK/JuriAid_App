import React, { useState } from 'react';
import { 
  View, 
  Text, 
  FlatList, 
  StyleSheet, 
  SafeAreaView, 
  TouchableOpacity, 
  StatusBar 
} from 'react-native';
import { ArrowLeft, Scale, ChevronRight, Percent, User } from 'lucide-react-native';

const SimilarCasesScreen = ({ route, navigation }) => {
  // 1. State for Filtering
  const [activeFilter, setActiveFilter] = useState('All Roles');
  const filters = ['All Roles', 'Decision', 'Fact', 'Argument'];

  // Defensive extraction of results
  const { results = [], fileName = "Document" } = route.params || {};

  // 2. Logic to filter data based on selection
  const filteredData = results.filter(item => {
    if (activeFilter === 'All Roles') return true;
    // Matching logic (case-insensitive to handle 'FACT' vs 'Fact')
    return item.role?.toLowerCase() === activeFilter.toLowerCase();
  });

  const renderItem = ({ item }) => {
    const displayScore = (parseFloat(item.final_score) * 100).toFixed(1);

    return (
      <TouchableOpacity 
        style={styles.card}
        activeOpacity={0.7}
        onPress={() => navigation.navigate('CaseDetail', { caseId: item.case_id })}
      >
        <View style={styles.cardHeader}>
          <View style={styles.idContainer}>
            <Scale color="#005A9C" size={18} />
            <Text style={styles.caseId}>Case: {item.case_id}</Text>
          </View>
          <View style={[styles.badge, item.role === 'ARGUMENT' ? styles.argBadge : styles.factBadge]}>
            <Text style={styles.badgeText}>{item.role}</Text>
          </View>
        </View>

        <View style={styles.scoreRow}>
          <Percent size={14} color="#059669" />
          <Text style={styles.scoreText}>Match Confidence: {displayScore}%</Text>
        </View>

        <Text style={styles.snippet} numberOfLines={4}>
          {item.snippet}
        </Text>

        <View style={styles.cardFooter}>
          <Text style={styles.viewMoreText}>View Full Case Analysis</Text>
          <ChevronRight size={16} color="#005A9C" />
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" />
      
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#1E293B" size={24} />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Similar Past Cases</Text>
        <TouchableOpacity style={styles.profileButton}>
            <View style={styles.avatarCircle}>
                <User color="white" size={20} />
            </View>
        </TouchableOpacity>
      </View>

      {/* Filter Bar */}
      <View style={styles.filterWrapper}>
        <View style={styles.filterContainer}>
            {filters.map((filter) => (
            <TouchableOpacity
                key={filter}
                onPress={() => setActiveFilter(filter)}
                style={[
                styles.filterButton,
                activeFilter === filter && styles.activeFilterButton
                ]}
            >
                <Text style={[
                styles.filterText,
                activeFilter === filter && styles.activeFilterText
                ]}>
                {filter}
                </Text>
            </TouchableOpacity>
            ))}
        </View>
      </View>

      {/* Results List */}
      <FlatList
        data={filteredData}
        keyExtractor={(item, index) => `${item.case_id}-${index}`}
        renderItem={renderItem}
        contentContainerStyle={styles.listContent}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <Text style={styles.emptyText}>No matching {activeFilter} found.</Text>
          </View>
        }
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 12,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '800',
    color: '#000000',
  },
  avatarCircle: {
    width: 35,
    height: 35,
    borderRadius: 17.5,
    backgroundColor: '#000',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterWrapper: {
    paddingHorizontal: 16,
    marginBottom: 8,
  },
  filterContainer: {
    flexDirection: 'row',
    backgroundColor: '#D1D5DB', 
    borderRadius: 12,
    padding: 4,
  },
  filterButton: {
    flex: 1,
    paddingVertical: 8,
    alignItems: 'center',
    borderRadius: 10,
  },
  activeFilterButton: {
    backgroundColor: '#3B82F6', 
  },
  filterText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#374151',
  },
  activeFilterText: {
    color: '#FFFFFF',
  },
  listContent: {
    padding: 16,
  },
  card: {
    backgroundColor: '#D1D5DB', 
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  idContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  caseId: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#000',
    marginLeft: 4,
  },
  badgeText: {
    fontSize: 12,
    fontWeight: '800',
    color: '#000',
  },
  scoreRow: {
    backgroundColor: '#3B82F6',
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  scoreText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#FFF',
  },
  snippet: {
    fontSize: 14,
    color: '#374151',
    lineHeight: 20,
  },
  cardFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 15,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#005A9C',
  },
  emptyContainer: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#94A3B8',
    fontSize: 16,
  },
});

export default SimilarCasesScreen;