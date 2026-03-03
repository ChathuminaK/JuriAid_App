import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  TouchableOpacity,
  ScrollView,
  TextInput,
} from 'react-native';
import {
  ArrowLeft,
  Search,
  User,
  FileText,
  Home,
  Briefcase,
  MessageCircle,
  BookOpen,
} from 'lucide-react-native';

const AmendmentsScreen = ({ navigation }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedLaw, setSelectedLaw] = useState(null);

  const handleSelectLaw = (law) => {
    setSelectedLaw(law);
  };

  const handleCancel = () => {
    setSelectedLaw(null);
    setSearchQuery('');
  };

  // Sample law for demonstration
  const sampleLaw = {
    title: 'Kandyan Marriage and Divorce Act',
    reference: 'kandyan_marriages_cap132',
    section: 'section_no 4',
    description: 'No Kandyan marriage shall be valid if, at the time of marriage (a) either party thereto is under the lawful age of marriage;',
    versionId: 'k132-s4-v1',
    actTitle: 'An Act to amend and consolidate the law relating to Kandyan marriages and divorces, and to make provision for matters connected therewith or incidental thereto.',
    jurisdiction: 'Kandyan',
    sectionTitle: 'Lawful age of marriage',
    fullText: 'No Kandyan marriage shall be valid if, at the time of marriage— (a) either party thereto is under the lawful age of marriage; or (b) both parties thereto are under the lawful age of marriage.',
    validFrom: '1995-10-19',
    citations: 'Act 19/1995',
    amendedBy: 'Act 19/1995',
    repealedBy: '[]',
    currentStatus: 'active'
  };

  if (selectedLaw) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.appTitle}>LawStatKG</Text>
          <TouchableOpacity style={styles.profileButton}>
            <User color="#000" size={24} />
          </TouchableOpacity>
        </View>

        <View style={styles.blueHeader}>
          <Text style={styles.blueHeaderText}>Law Statute and amendment</Text>
        </View>

        <View style={styles.searchContainer}>
          <TextInput
            style={styles.searchInput}
            placeholder="Kandyan Marriage and Divorce Act"
            placeholderTextColor="#000"
            value={searchQuery}
            onChangeText={setSearchQuery}
          />
        </View>

        <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
          <View style={styles.detailCard}>
            <View style={styles.detailHeader}>
              <View style={styles.lawIcon}>
                <FileText color="#000" size={24} />
              </View>
              <View style={styles.detailHeaderText}>
                <Text style={styles.detailTitle}>{selectedLaw.title}</Text>
                <Text style={styles.detailMeta}>
                  {selectedLaw.reference}    {selectedLaw.section}
                </Text>
              </View>
            </View>

            <View style={styles.detailBody}>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>version_id </Text>
                <Text style={styles.detailValue}>- {selectedLaw.versionId}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Act_id </Text>
                <Text style={styles.detailValue}>-{selectedLaw.reference}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Law</Text>
                <Text style={styles.detailValue}>- {selectedLaw.title}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Act_title </Text>
                <Text style={styles.detailValue}>-{selectedLaw.actTitle}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Jurisdiction</Text>
                <Text style={styles.detailValue}>- {selectedLaw.jurisdiction}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Section_no</Text>
                <Text style={styles.detailValue}>-{selectedLaw.section.replace('section_no ', '')}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Section_title</Text>
                <Text style={styles.detailValue}>-{selectedLaw.sectionTitle}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>Text </Text>
                <Text style={styles.detailValue}>-{selectedLaw.fullText}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>valid_from</Text>
                <Text style={styles.detailValue}>- {selectedLaw.validFrom}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>citations</Text>
                <Text style={styles.detailValue}>- {selectedLaw.citations}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>amended_by</Text>
                <Text style={styles.detailValue}>-{selectedLaw.amendedBy}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>repealed_by</Text>
                <Text style={styles.detailValue}>{selectedLaw.repealedBy}</Text>
              </Text>
              <Text style={styles.detailText}>
                <Text style={styles.detailLabel}>current_status</Text>
                <Text style={styles.detailValue}>- {selectedLaw.currentStatus}</Text>
              </Text>
            </View>

            <TouchableOpacity style={styles.cancelButton} onPress={handleCancel}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.appTitle}>LawStatKG</Text>
        <TouchableOpacity style={styles.profileButton}>
          <User color="#000" size={24} />
        </TouchableOpacity>
      </View>

      <TouchableOpacity 
        style={styles.backLink}
        onPress={() => navigation.goBack()}
      >
        <Text style={styles.backLinkText}>{'<<'}Laws</Text>
      </TouchableOpacity>

      <View style={styles.blueHeader}>
        <Text style={styles.blueHeaderText}>Law Statute and amendment</Text>
      </View>

      <View style={styles.searchContainer}>
        <Search color="#999" size={20} style={styles.searchIcon} />
        <TextInput
          style={styles.searchInput}
          placeholder="Find Statute"
          placeholderTextColor="#999"
          value={searchQuery}
          onChangeText={setSearchQuery}
        />
      </View>

      <View style={styles.versionButtons}>
        <TouchableOpacity style={styles.newVersionButton}>
          <Text style={styles.newVersionButtonText}>New Version {'>>'}</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.oldVersionButton}>
          <Text style={styles.oldVersionButtonText}>Old Version{'>>'}</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {searchQuery ? (
          <TouchableOpacity 
            style={styles.lawCard}
            onPress={() => handleSelectLaw(sampleLaw)}
          >
            <View style={styles.lawCardHeader}>
              <View style={styles.lawIcon}>
                <FileText color="#000" size={24} />
              </View>
              <View style={styles.lawCardContent}>
                <Text style={styles.lawCardTitle}>{sampleLaw.title}</Text>
                <Text style={styles.lawCardMeta}>
                  {sampleLaw.reference}    {sampleLaw.section}
                </Text>
                <Text style={styles.lawCardDescription} numberOfLines={3}>
                  {sampleLaw.description}
                </Text>
              </View>
            </View>
            <TouchableOpacity style={styles.cancelButtonInline}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </TouchableOpacity>
        ) : null}
      </ScrollView>
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
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 10,
  },
  appTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000',
  },
  profileButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backLink: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  backLinkText: {
    fontSize: 14,
    color: '#4A90E2',
    fontWeight: '500',
  },
  blueHeader: {
    paddingHorizontal: 20,
    paddingVertical: 10,
  },
  blueHeaderText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  searchIcon: {
    marginRight: 10,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000',
  },
  versionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 20,
    gap: 12,
  },
  newVersionButton: {
    backgroundColor: '#5856D6',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  newVersionButtonText: {
    color: '#FFFFFF',
    fontSize: 14,
    fontWeight: '600',
  },
  oldVersionButton: {
    backgroundColor: '#FFFFFF',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E0E0E0',
  },
  oldVersionButtonText: {
    color: '#000',
    fontSize: 14,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  lawCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 15,
    marginBottom: 15,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  lawCardHeader: {
    flexDirection: 'row',
    marginBottom: 15,
  },
  lawIcon: {
    width: 40,
    height: 40,
    borderRadius: 8,
    backgroundColor: '#F5F5F5',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  lawCardContent: {
    flex: 1,
  },
  lawCardTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  lawCardMeta: {
    fontSize: 12,
    color: '#666',
    marginBottom: 8,
  },
  lawCardDescription: {
    fontSize: 13,
    color: '#333',
    lineHeight: 18,
  },
  cancelButtonInline: {
    alignSelf: 'flex-end',
  },
  detailCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    borderWidth: 2,
    borderColor: '#4A90E2',
  },
  detailHeader: {
    flexDirection: 'row',
    marginBottom: 20,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  detailHeaderText: {
    flex: 1,
    marginLeft: 12,
  },
  detailTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginBottom: 4,
  },
  detailMeta: {
    fontSize: 12,
    color: '#666',
  },
  detailBody: {
    marginBottom: 20,
  },
  detailText: {
    fontSize: 14,
    color: '#000',
    lineHeight: 24,
    marginBottom: 8,
  },
  detailLabel: {
    fontWeight: '600',
  },
  detailValue: {
    fontWeight: '400',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    alignSelf: 'flex-end',
  },
  cancelButtonText: {
    color: '#4A90E2',
    fontSize: 16,
    fontWeight: '600',
  },
  bottomNav: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    alignItems: 'center',
    paddingVertical: 12,
    backgroundColor: '#FFFFFF',
    borderTopWidth: 1,
    borderTopColor: '#E0E0E0',
  },
  navItem: {
    padding: 8,
  },
});

export default AmendmentsScreen;