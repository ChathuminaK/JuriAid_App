import React, { useState } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  TextInput,
  FlatList
} from 'react-native';
import { 
  Search,
  FileText,
  Home,
  Briefcase,
  MessageCircle,
  BookOpen,
  User,
  X
} from 'lucide-react-native';

// Hardcoded Sri Lankan law database
const sriLankanLaws = [
  {
    id: '1',
    title: 'Marriage Registration Ordinance',
    reference: 'general_marriages_cap131',
    section: 'section_no 35',
    description: 'A marriage in the presence of the registrar shall be solemnized......',
    fullText: 'A marriage in the presence of the registrar shall be solemnized in the office of such registrar, or in any licensed place of worship within his district, between the hours of eight in the forenoon and six in the afternoon.',
    jurisdiction: 'Kandyan',
    validFrom: '1995-10-19',
    amended: 'Act 19/1995',
    status: 'active'
  },
  {
    id: '2',
    title: 'Kandyan Marriage and Divorce Act',
    reference: 'kandyan_marriages_cap132',
    section: 'section_no 1',
    description: 'This Act may be cited as the Kandyan Marriage and Divorce Act.',
    fullText: 'An Act to amend and consolidate the law relating to Kandyan marriages and divorces, and to make provision for matters connected therewith or incidental thereto.',
    jurisdiction: 'Kandyan',
    validFrom: '1995-10-19',
    amended: 'Act 19/1995',
    status: 'active',
    relatedSections: ['section 3', 'section 5']
  },
  {
    id: '3',
    title: 'Lawful age of marriage',
    reference: 'kandyan_marriages_cap132',
    section: 'section_no 4',
    description: 'No Kandyan marriage shall be valid if, at the time of marriage (a) either party thereto is under the lawful age of marriage;',
    fullText: 'No Kandyan marriage shall be valid if, at the time of marriage— (a) either party thereto is under the lawful age of marriage; or (b) both parties thereto are under the lawful age of marriage.',
    jurisdiction: 'Kandyan',
    validFrom: '1995-10-19',
    amended: 'Act 19/1995',
    status: 'active'
  },
  {
    id: '4',
    title: 'Effect of life insurance by husband in favour of wife or children',
    reference: 'jaffna_tesawalamai_cap58',
    section: 'section_no 12',
    description: 'A policy of insurance... by any married man... on his own life and expressed... for the benefit of his wife or of his wife and children...',
    fullText: 'A policy of insurance effected by any married man, expressed on its face to be for the benefit of his wife or of his children, or of his wife and children, or any of them, shall ensure and be deemed to be a trust for the benefit of his wife or children, or wife and children, or of any of them, according to the interest specified in the policy.',
    jurisdiction: 'General',
    validFrom: '1920-03-15',
    status: 'active'
  },
  {
    id: '5',
    title: 'Divorce Act - Grounds for Divorce',
    reference: 'divorce_act_cap51',
    section: 'section_no 2',
    description: 'Grounds on which divorce may be granted - Cruelty',
    fullText: 'The court may grant a decree of divorce on the ground that the defendant has been guilty of cruelty towards the plaintiff, where such cruelty consists of physical violence or mental cruelty of such a nature as to render it impossible for the parties to continue living together.',
    jurisdiction: 'General',
    validFrom: '1977-01-01',
    amended: 'Act 22/1995',
    status: 'active'
  },
  {
    id: '6',
    title: 'Divorce Act - Malicious Abandonment',
    reference: 'divorce_act_cap51',
    section: 'section_no 3',
    description: 'Grounds for divorce - Abandonment',
    fullText: 'The court may grant a decree of divorce on the ground that the defendant has maliciously deserted the plaintiff without reasonable cause for a period of one year or upwards immediately preceding the filing of the petition.',
    jurisdiction: 'General',
    validFrom: '1977-01-01',
    status: 'active'
  },
  {
    id: '7',
    title: 'Maintenance Act - Obligations of Husband',
    reference: 'maintenance_act_cap37',
    section: 'section_no 5',
    description: 'Maintenance obligations of married persons',
    fullText: 'Every married man shall maintain his wife and every married woman shall maintain her husband when such husband or wife is unable to maintain himself or herself. The court may order payment of monthly maintenance based on the financial capacity of the parties and the standard of living during marriage.',
    jurisdiction: 'General',
    validFrom: '1999-06-01',
    status: 'active'
  }
];

const ResourcesScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLaw, setSelectedLaw] = useState(null);
  const [recentSearches, setRecentSearches] = useState([
    'Marriage Registration Ordinance',
    'Kandyan Marriage and Divorce Act',
    'Lawful age of marriage',
    'Effect of life insurance by husband in favour of wife or children'
  ]);

  const filteredLaws = searchQuery.trim() 
    ? sriLankanLaws.filter(law => 
        law.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        law.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
        law.reference.toLowerCase().includes(searchQuery.toLowerCase())
      )
    : [];

  const handleSearch = (query) => {
    setSearchQuery(query);
    setSelectedLaw(null);
  };

  const handleSelectLaw = (law) => {
    setSelectedLaw(law);
    setSearchQuery('');
  };

  const handleClearSearch = () => {
    setSearchQuery('');
    setSelectedLaw(null);
  };

  const renderRecentSearch = (item, index) => (
    <TouchableOpacity 
      key={index}
      style={styles.recentSearchCard}
      onPress={() => {
        const law = sriLankanLaws.find(l => l.title === item);
        if (law) handleSelectLaw(law);
      }}
    >
      <View style={styles.lawIcon}>
        <FileText color="#1C4587" size={24} />
      </View>
      <View style={styles.recentSearchContent}>
        <Text style={styles.recentSearchTitle}>{item}</Text>
        <Text style={styles.recentSearchMeta}>
          {sriLankanLaws.find(l => l.title === item)?.reference} • {sriLankanLaws.find(l => l.title === item)?.section}
        </Text>
        <Text style={styles.recentSearchDescription} numberOfLines={2}>
          {sriLankanLaws.find(l => l.title === item)?.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderSearchResult = ({ item }) => (
    <TouchableOpacity 
      style={styles.searchResultCard}
      onPress={() => handleSelectLaw(item)}
    >
      <View style={styles.lawIcon}>
        <FileText color="#1C4587" size={24} />
      </View>
      <View style={styles.searchResultContent}>
        <Text style={styles.searchResultTitle}>{item.title}</Text>
        <Text style={styles.searchResultMeta}>
          {item.reference} • {item.section}
        </Text>
        <Text style={styles.searchResultDescription} numberOfLines={2}>
          {item.description}
        </Text>
      </View>
    </TouchableOpacity>
  );

  if (selectedLaw) {
    return (
      <SafeAreaView style={styles.container}>
        {/* Law Details Header */}
        <View style={styles.detailsHeader}>
          <Text style={styles.appTitle}>LawStatKG</Text>
          <TouchableOpacity style={styles.profileButton}>
            <User color="#1C4587" size={24} />
          </TouchableOpacity>
        </View>

        {/* Search Bar in Details */}
        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="age of marriage"
            placeholderTextColor="#999"
            value={searchQuery}
            onChangeText={handleSearch}
          />
        </View>

        <ScrollView style={styles.detailsContent} showsVerticalScrollIndicator={false}>
          <Text style={styles.sectionTitle}>Match Laws</Text>

          <View style={styles.lawDetailsCard}>
            <View style={styles.lawDetailsHeader}>
              <View style={styles.lawIcon}>
                <FileText color="#1C4587" size={24} />
              </View>
              <Text style={styles.lawDetailsTitle}>{selectedLaw.title}</Text>
            </View>

            <View style={styles.lawDetailsBody}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>version_id</Text>
                <Text style={styles.detailValue}>k132-s4-v1</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Act_id</Text>
                <Text style={styles.detailValue}>{selectedLaw.reference}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Law</Text>
                <Text style={styles.detailValue}>{selectedLaw.title}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Act_title</Text>
                <Text style={styles.detailValue}>An Act to amend and consolidate the law relating to Kandyan marriages and divorces, and to make provision for matters connected therewith or incidental thereto.</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Jurisdiction</Text>
                <Text style={styles.detailValue}>{selectedLaw.jurisdiction}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Section_no</Text>
                <Text style={styles.detailValue}>{selectedLaw.section.replace('section_no ', '')}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Section_title</Text>
                <Text style={styles.detailValue}>{selectedLaw.title}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Text</Text>
                <Text style={styles.detailValue}>{selectedLaw.fullText}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>valid_from</Text>
                <Text style={styles.detailValue}>{selectedLaw.validFrom}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>citations</Text>
                <Text style={styles.detailValue}>Act 19/1995</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>amended_by</Text>
                <Text style={styles.detailValue}>{selectedLaw.amended}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>repealed_by</Text>
                <Text style={styles.detailValue}>[]</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>current_status</Text>
                <Text style={styles.detailValue}>{selectedLaw.status}</Text>
              </View>
            </View>

            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={handleClearSearch}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <Text style={styles.appTitle}>LawStatKG</Text>
        <TouchableOpacity style={styles.profileButton}>
          <User color="#1C4587" size={24} />
        </TouchableOpacity>
      </View>

      {/* Amendments Badge */}
      <View style={styles.badgeContainer}>
        <TouchableOpacity 
          style={styles.badge}
          onPress={() => navigation.navigate('Amendments')}
        >
          <Text style={styles.badgeText}>Amendments</Text>
        </TouchableOpacity>
      </View>

      {/* Search Bar */}
      <View style={styles.searchContainer}>
        <Search color="#999" size={21} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Law Statutes"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={handleSearch}
        />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchQuery.trim() ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Search Results</Text>
              <TouchableOpacity onPress={handleClearSearch}>
                <X color="#1C4587" size={20} />
              </TouchableOpacity>
            </View>
            <FlatList
              data={filteredLaws}
              renderItem={renderSearchResult}
              keyExtractor={(item) => item.id}
              scrollEnabled={false}
            />
          </>
        ) : (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Recent Searches</Text>
              <TouchableOpacity>
                <Text style={styles.clearAllText}>Clear All</Text>
              </TouchableOpacity>
            </View>

            {recentSearches.map(renderRecentSearch)}
          </>
        )}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF'
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000'
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center'
  },
  badgeContainer: {
    paddingHorizontal: 20,
    paddingVertical: 10
  },
  badge: {
    backgroundColor: '#7C4DFF',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start'
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600'
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#F5F5F5',
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0'
  },
  searchIcon: {
    marginRight: 10
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000'
  },
  content: {
    flex: 1,
    paddingHorizontal: 20
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: 20,
    marginBottom: 15
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#1C4587'
  },
  clearAllText: {
    fontSize: 14,
    color: '#1C4587',
    fontWeight: '500'
  },
  recentSearchCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#7C4DFF',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2
  },
  lawIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12
  },
  recentSearchContent: {
    flex: 1
  },
  recentSearchTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4
  },
  recentSearchMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6
  },
  recentSearchDescription: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18
  },
  searchResultCard: {
    flexDirection: 'row',
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E0E0E0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1
  },
  searchResultContent: {
    flex: 1
  },
  searchResultTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4
  },
  searchResultMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 6
  },
  searchResultDescription: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0'
  },
  navItem: {
    padding: 8
  },
  detailsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 15
  },
  detailsContent: {
    flex: 1,
    paddingHorizontal: 20
  },
  lawDetailsCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 1,
    borderColor: '#7C4DFF'
  },
  lawDetailsHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0'
  },
  lawDetailsTitle: {
    flex: 1,
    fontSize: 18,
    fontWeight: '600',
    color: '#000',
    marginLeft: 12
  },
  lawDetailsBody: {
    marginBottom: 20
  },
  detailRow: {
    marginBottom: 15
  },
  detailLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1C4587',
    marginBottom: 4
  },
  detailValue: {
    fontSize: 14,
    color: '#333',
    lineHeight: 20
  },
  cancelButton: {
    backgroundColor: '#7C4DFF',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center'
  },
  cancelButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600'
  }
});

export default ResourcesScreen;