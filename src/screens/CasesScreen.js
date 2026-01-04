import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  FlatList,
  TextInput,
  Animated
} from 'react-native';
import { PlusCircle, Search, Filter, Clock, CheckCircle, AlertCircle } from 'lucide-react-native';

const mockCases = [
  { 
    id: '1', 
    title: 'Civil Case #1023', 
    status: 'In Progress', 
    date: '2023-10-15',
    client: 'John Smith',
    priority: 'High',
    progress: 65,
    nextAction: 'Court hearing scheduled'
  },
  { 
    id: '2', 
    title: 'Property Dispute', 
    status: 'Closed', 
    date: '2023-08-20',
    client: 'Mary Johnson',
    priority: 'Medium',
    progress: 100,
    nextAction: 'Case resolved'
  },
  { 
    id: '3', 
    title: 'Contract Negotiation', 
    status: 'Review', 
    date: '2023-11-01',
    client: 'Tech Corp Inc.',
    priority: 'High',
    progress: 30,
    nextAction: 'Document review pending'
  }
];

const CasesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [filterVisible, setFilterVisible] = useState(false);

  const getStatusIcon = (status) => {
    switch (status) {
      case 'In Progress':
        return <Clock color="#F59E0B" size={16} />;
      case 'Closed':
        return <CheckCircle color="#10B981" size={16} />;
      case 'Review':
        return <AlertCircle color="#EF4444" size={16} />;
      default:
        return <Clock color="#6B7280" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'In Progress':
        return { backgroundColor: '#FEF3C7', color: '#D97706' };
      case 'Closed':
        return { backgroundColor: '#D1FAE5', color: '#065F46' };
      case 'Review':
        return { backgroundColor: '#FEE2E2', color: '#DC2626' };
      default:
        return { backgroundColor: '#F3F4F6', color: '#374151' };
    }
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High':
        return '#EF4444';
      case 'Medium':
        return '#F59E0B';
      case 'Low':
        return '#10B981';
      default:
        return '#6B7280';
    }
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.caseCard}>
      <View style={styles.caseHeader}>
        <View style={styles.caseTitleContainer}>
          <Text style={styles.caseTitle}>{item.title}</Text>
          <View style={[styles.priorityDot, { backgroundColor: getPriorityColor(item.priority) }]} />
        </View>
        <View style={[styles.statusContainer, getStatusColor(item.status)]}>
          {getStatusIcon(item.status)}
          <Text style={[styles.statusText, { color: getStatusColor(item.status).color }]}>
            {item.status}
          </Text>
        </View>
      </View>

      <Text style={styles.clientName}>Client: {item.client}</Text>
      <Text style={styles.caseDate}>Opened: {item.date}</Text>

      <View style={styles.progressContainer}>
        <Text style={styles.progressLabel}>Progress</Text>
        <View style={styles.progressBar}>
          <View style={[styles.progressFill, { width: `${item.progress}%` }]} />
        </View>
        <Text style={styles.progressText}>{item.progress}%</Text>
      </View>

      <View style={styles.nextActionContainer}>
        <Text style={styles.nextActionLabel}>Next Action:</Text>
        <Text style={styles.nextActionText}>{item.nextAction}</Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        {/* Header */}
        <View style={styles.headerContainer}>
          <View>
            <Text style={styles.header}>Your Case Files</Text>
            <Text style={styles.subHeader}>Manage and track your legal matters</Text>
          </View>
          <TouchableOpacity style={styles.addButton}
            onPress={() => navigation.navigate('NewCase')}>
          
            <PlusCircle color="#FFFFFF" size={20} />
            <Text style={styles.addButtonText}>New Case</Text>
          </TouchableOpacity>
        </View>

        {/* Search and Filter */}
        <View style={styles.searchContainer}>
          <View style={styles.searchInputContainer}>
            <Search color="#6B7280" size={20} />
            <TextInput
              style={styles.searchInput}
              placeholder="Search cases..."
              value={searchQuery}
              onChangeText={setSearchQuery}
              placeholderTextColor="#9CA3AF"
            />
          </View>
          <TouchableOpacity 
            style={styles.filterButton}
            onPress={() => setFilterVisible(!filterVisible)}
          >
            <Filter color="#005A9C" size={20} />
          </TouchableOpacity>
        </View>

        {/* Stats Row */}
        <View style={styles.statsRow}>
          <View style={styles.statItem}>
            <Text style={styles.statNumber}>8</Text>
            <Text style={styles.statLabel}>Total Cases</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#F59E0B' }]}>3</Text>
            <Text style={styles.statLabel}>In Progress</Text>
          </View>
          <View style={styles.statItem}>
            <Text style={[styles.statNumber, { color: '#10B981' }]}>5</Text>
            <Text style={styles.statLabel}>Completed</Text>
          </View>
        </View>

        {/* Cases List */}
        <FlatList
          data={mockCases}
          renderItem={renderItem}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No cases found</Text>
              <Text style={styles.emptySubtext}>Start by creating your first case</Text>
            </View>
          }
        />
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  container: { 
    flex: 1, 
    padding: 20 
  },
  headerContainer: { 
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    alignItems: 'flex-start', 
    marginBottom: 24 
  },
  header: { 
    fontSize: 28, 
    fontWeight: 'bold', 
    color: '#1E293B',
    marginBottom: 4
  },
  subHeader: {
    fontSize: 14,
    color: '#64748B'
  },
  addButton: {
    flexDirection: 'row',
    backgroundColor: '#005A9C',
    paddingVertical: 12,
    paddingHorizontal: 16,
    borderRadius: 16,
    alignItems: 'center',
    shadowColor: '#005A9C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4
  },
  addButtonText: { 
    color: '#FFFFFF', 
    fontWeight: '600', 
    marginLeft: 8,
    fontSize: 14
  },
  searchContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    color: '#1E293B'
  },
  filterButton: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2
  },
  statsRow: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3
  },
  statItem: {
    flex: 1,
    alignItems: 'center'
  },
  statNumber: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#005A9C',
    marginBottom: 4
  },
  statLabel: {
    fontSize: 12,
    color: '#64748B',
    textAlign: 'center'
  },
  caseCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  caseTitleContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center'
  },
  caseTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1E293B',
    flex: 1
  },
  priorityDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginLeft: 8
  },
  statusContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    gap: 6
  },
  statusText: {
    fontSize: 12,
    fontWeight: '600'
  },
  clientName: {
    fontSize: 14,
    color: '#005A9C',
    fontWeight: '500',
    marginBottom: 4
  },
  caseDate: { 
    fontSize: 13, 
    color: '#64748B',
    marginBottom: 16
  },
  progressContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
    width: 60
  },
  progressBar: {
    flex: 1,
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3,
    marginHorizontal: 12
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#005A9C',
    borderRadius: 3
  },
  progressText: {
    fontSize: 12,
    color: '#005A9C',
    fontWeight: '600',
    width: 35,
    textAlign: 'right'
  },
  nextActionContainer: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  nextActionLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500',
    marginRight: 8
  },
  nextActionText: {
    fontSize: 12,
    color: '#1E293B',
    flex: 1
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60
  },
  emptyText: { 
    fontSize: 18,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 8
  },
  emptySubtext: {
    fontSize: 14,
    color: '#9CA3AF'
  }
});

export default CasesScreen;