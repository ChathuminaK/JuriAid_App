import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  SafeAreaView,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import {
  FileText,
  Scale,
  Calendar,
  User,
  Download,
  Share2,
  ChevronRight,
  Gavel,
  BookOpen,
  AlertCircle,
  Heart,
  Users,
  Home,
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const ReportScreen = ({ navigation }) => {
  const [selectedReport, setSelectedReport] = useState(null);

  // Hardcoded Sri Lankan divorce case reports
  const divorceReports = [
    {
      id: '1',
      title: 'Divorce Case - Cruelty and Abandonment',
      caseNumber: 'DC/2025/1234',
      client: 'Mrs. Nadeeka Perera',
      dateCreated: '2026-01-05',
      status: 'Active',
      type: 'Divorce - Cruelty & Abandonment',
      summary: 'Petition filed under Divorce Act for cruelty and abandonment. Wife seeks divorce, maintenance of Rs. 50,000/month, and custody of two minor children.',
      sections: {
        parties: {
          petitioner: 'Mrs. Nadeeka Perera (Wife)',
          respondent: 'Mr. Kasun Perera (Husband)',
        },
        grounds: [
          'Physical and mental cruelty under Divorce Act Section 2',
          'Malicious abandonment for 18 months under Section 3',
          'Failure to provide maintenance',
        ],
        reliefSought: [
          'Decree of divorce',
          'Monthly maintenance Rs. 50,000',
          'Custody of two children (ages 8 and 6)',
          'Division of matrimonial property',
        ],
        evidence: [
          'Medical records documenting injuries from domestic violence',
          'Police complaints filed over 3-year period',
          'Witness statements from neighbors and family',
          'Bank statements showing lack of financial support',
        ],
        relevantLaws: [
          'Divorce Act (Chapter 51) - Section 2 (Cruelty)',
          'Divorce Act - Section 3 (Abandonment)',
          'Maintenance Act (Chapter 37)',
        ],
        precedents: [
          'Fernando v Fernando (2018) 2 SLR 145 - Mental cruelty definition',
          'Perera v Perera (2016) 1 SLR 298 - Abandonment requirements',
          'Silva v Silva (2020) 3 SLR 67 - Maintenance calculations',
        ],
        nextSteps: [
          'File petition in District Court of Colombo',
          'Apply for interim maintenance order',
          'Gather additional witness statements',
          'Prepare financial affidavit for court',
        ],
      },
    },
    {
      id: '2',
      title: 'Divorce Case - Adultery',
      caseNumber: 'DC/2025/1567',
      client: 'Mr. Rohan Silva',
      dateCreated: '2025-12-28',
      status: 'Active',
      type: 'Divorce - Adultery',
      summary: 'Husband petitions for divorce on grounds of adultery. Seeking custody of one child and division of marital assets.',
      sections: {
        parties: {
          petitioner: 'Mr. Rohan Silva (Husband)',
          respondent: 'Mrs. Chamila Silva (Wife)',
        },
        grounds: [
          'Adultery under Divorce Act Section 1',
          'Breakdown of marriage irretrievably',
        ],
        reliefSought: [
          'Decree of divorce',
          'Custody of child (age 10)',
          'Equal division of matrimonial property',
        ],
        evidence: [
          'Private investigator reports',
          'Photographic evidence',
          'Text message exchanges',
          'Third-party witness statements',
        ],
        relevantLaws: [
          'Divorce Act (Chapter 51) - Section 1 (Adultery)',
          'Custody of Children Act',
        ],
        precedents: [
          'De Silva v De Silva (2019) - Adultery burden of proof',
          'Jayawardena v Jayawardena (2017) - Best interests of child in custody',
        ],
        nextSteps: [
          'Complete evidence gathering',
          'File petition with supporting affidavits',
          'Arrange child welfare assessment',
        ],
      },
    },
  ];

  const renderReportCard = (report) => (
    <TouchableOpacity
      key={report.id}
      style={styles.reportCard}
      onPress={() => setSelectedReport(report)}
    >
      <View style={styles.reportHeader}>
        <View style={styles.reportIcon}>
          <FileText color="#005A9C" size={24} />
        </View>
        <View style={styles.reportInfo}>
          <Text style={styles.reportTitle}>{report.title}</Text>
          <Text style={styles.reportMeta}>Case: {report.caseNumber}</Text>
          <Text style={styles.reportClient}>Client: {report.client}</Text>
        </View>
        <View style={[
          styles.statusBadge,
          { backgroundColor: report.status === 'Active' ? '#D1FAE5' : '#FEF3C7' }
        ]}>
          <Text style={[
            styles.statusText,
            { color: report.status === 'Active' ? '#065F46' : '#D97706' }
          ]}>
            {report.status}
          </Text>
        </View>
      </View>

      <View style={styles.reportFooter}>
        <View style={styles.reportDate}>
          <Calendar color="#64748B" size={14} />
          <Text style={styles.dateText}>{report.dateCreated}</Text>
        </View>
        <View style={styles.reportType}>
          <Scale color="#667EEA" size={14} />
          <Text style={styles.typeText}>{report.type}</Text>
        </View>
      </View>
    </TouchableOpacity>
  );

  const renderDetailedReport = () => {
    if (!selectedReport) return null;

    return (
      <ScrollView style={styles.detailView} showsVerticalScrollIndicator={false}>
        {/* Report Header */}
        <View style={styles.detailHeader}>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => setSelectedReport(null)}
          >
            <Text style={styles.backText}>← Back to Reports</Text>
          </TouchableOpacity>
          
          <Text style={styles.detailTitle}>{selectedReport.title}</Text>
          <Text style={styles.detailCaseNumber}>Case No: {selectedReport.caseNumber}</Text>
          
          <View style={styles.clientInfo}>
            <User color="#005A9C" size={16} />
            <Text style={styles.clientText}>Client: {selectedReport.client}</Text>
          </View>

          <View style={styles.actionButtons}>
            <TouchableOpacity style={styles.downloadButton}>
              <Download color="#FFFFFF" size={18} />
              <Text style={styles.buttonText}>Download PDF</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.shareButton}>
              <Share2 color="#005A9C" size={18} />
              <Text style={styles.shareButtonText}>Share</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Summary */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText color="#005A9C" size={20} />
            <Text style={styles.sectionTitle}>Case Summary</Text>
          </View>
          <Text style={styles.summaryText}>{selectedReport.summary}</Text>
        </View>

        {/* Parties */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Users color="#10B981" size={20} />
            <Text style={styles.sectionTitle}>Parties</Text>
          </View>
          <View style={styles.partyRow}>
            <Text style={styles.partyLabel}>Petitioner:</Text>
            <Text style={styles.partyValue}>{selectedReport.sections.parties.petitioner}</Text>
          </View>
          <View style={styles.partyRow}>
            <Text style={styles.partyLabel}>Respondent:</Text>
            <Text style={styles.partyValue}>{selectedReport.sections.parties.respondent}</Text>
          </View>
        </View>

        {/* Grounds */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Gavel color="#667EEA" size={20} />
            <Text style={styles.sectionTitle}>Grounds for Divorce</Text>
          </View>
          {selectedReport.sections.grounds.map((ground, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{ground}</Text>
            </View>
          ))}
        </View>

        {/* Relief Sought */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Heart color="#EF4444" size={20} />
            <Text style={styles.sectionTitle}>Relief Sought</Text>
          </View>
          {selectedReport.sections.reliefSought.map((relief, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{relief}</Text>
            </View>
          ))}
        </View>

        {/* Evidence */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <FileText color="#F59E0B" size={20} />
            <Text style={styles.sectionTitle}>Supporting Evidence</Text>
          </View>
          {selectedReport.sections.evidence.map((evidence, index) => (
            <View key={index} style={styles.listItem}>
              <View style={styles.bullet} />
              <Text style={styles.listText}>{evidence}</Text>
            </View>
          ))}
        </View>

        {/* Relevant Laws */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Scale color="#667EEA" size={20} />
            <Text style={styles.sectionTitle}>Relevant Laws</Text>
          </View>
          {selectedReport.sections.relevantLaws.map((law, index) => (
            <View key={index} style={styles.lawItem}>
              <Text style={styles.lawText}>{law}</Text>
            </View>
          ))}
        </View>

        {/* Precedents */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <BookOpen color="#10B981" size={20} />
            <Text style={styles.sectionTitle}>Relevant Precedents</Text>
          </View>
          {selectedReport.sections.precedents.map((precedent, index) => (
            <View key={index} style={styles.precedentItem}>
              <Text style={styles.precedentText}>{precedent}</Text>
            </View>
          ))}
        </View>

        {/* Next Steps */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <AlertCircle color="#F59E0B" size={20} />
            <Text style={styles.sectionTitle}>Next Steps</Text>
          </View>
          {selectedReport.sections.nextSteps.map((step, index) => (
            <View key={index} style={styles.stepItem}>
              <View style={styles.stepNumber}>
                <Text style={styles.stepNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.stepText}>{step}</Text>
            </View>
          ))}
        </View>

        <View style={{ height: 40 }} />
      </ScrollView>
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      {!selectedReport ? (
        <>
          {/* Header */}
          <View style={styles.header}>
            <View>
              <Text style={styles.headerTitle}>Divorce Case Reports</Text>
              <Text style={styles.headerSubtitle}>Sri Lankan Matrimonial Law Cases</Text>
            </View>
            <TouchableOpacity style={styles.addButton}>
              <FileText color="#005A9C" size={20} />
            </TouchableOpacity>
          </View>

          {/* Reports List */}
          <ScrollView style={styles.reportsList} showsVerticalScrollIndicator={false}>
            <View style={styles.reportsContent}>
              {divorceReports.map(renderReportCard)}
            </View>
          </ScrollView>
        </>
      ) : (
        renderDetailedReport()
      )}
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: { fontSize: 24, fontWeight: '700', color: '#1E293B' },
  headerSubtitle: { fontSize: 14, color: '#64748B', marginTop: 4 },
  addButton: {
    padding: 12,
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
  },
  reportsList: { flex: 1 },
  reportsContent: { padding: 20 },
  reportCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  reportHeader: {
    flexDirection: 'row',
    marginBottom: 16,
  },
  reportIcon: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  reportInfo: { flex: 1 },
  reportTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  reportMeta: { fontSize: 13, color: '#64748B', marginBottom: 2 },
  reportClient: { fontSize: 13, color: '#005A9C', fontWeight: '500' },
  statusBadge: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
    alignSelf: 'flex-start',
  },
  statusText: { fontSize: 12, fontWeight: '600' },
  reportFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#F1F5F9',
  },
  reportDate: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  dateText: { fontSize: 12, color: '#64748B' },
  reportType: { flexDirection: 'row', alignItems: 'center', gap: 6 },
  typeText: { fontSize: 12, color: '#667EEA', fontWeight: '500' },
  detailView: { flex: 1 },
  detailHeader: {
    backgroundColor: '#FFFFFF',
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: { marginBottom: 16 },
  backText: { fontSize: 15, color: '#005A9C', fontWeight: '600' },
  detailTitle: { fontSize: 22, fontWeight: '700', color: '#1E293B', marginBottom: 8 },
  detailCaseNumber: { fontSize: 14, color: '#64748B', marginBottom: 12 },
  clientInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 20,
  },
  clientText: { fontSize: 15, color: '#005A9C', fontWeight: '500' },
  actionButtons: { flexDirection: 'row', gap: 12 },
  downloadButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#005A9C',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  buttonText: { fontSize: 15, fontWeight: '600', color: '#FFFFFF' },
  shareButton: {
    flexDirection: 'row',
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 8,
  },
  shareButtonText: { fontSize: 15, fontWeight: '600', color: '#005A9C' },
  section: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 16,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
  summaryText: { fontSize: 15, color: '#475569', lineHeight: 24 },
  partyRow: { marginBottom: 12 },
  partyLabel: { fontSize: 13, color: '#64748B', marginBottom: 4 },
  partyValue: { fontSize: 15, color: '#1E293B', fontWeight: '600' },
  listItem: { flexDirection: 'row', alignItems: 'flex-start', marginBottom: 12 },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#005A9C',
    marginTop: 8,
    marginRight: 12,
  },
  listText: { flex: 1, fontSize: 15, color: '#475569', lineHeight: 22 },
  lawItem: {
    backgroundColor: '#F8FAFC',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#667EEA',
  },
  lawText: { fontSize: 14, color: '#1E293B', fontWeight: '500' },
  precedentItem: {
    backgroundColor: '#F0FDF4',
    padding: 12,
    borderRadius: 12,
    marginBottom: 8,
    borderLeftWidth: 3,
    borderLeftColor: '#10B981',
  },
  precedentText: { fontSize: 14, color: '#1E293B', lineHeight: 20 },
  stepItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 12,
    backgroundColor: '#FFFBEB',
    padding: 12,
    borderRadius: 12,
  },
  stepNumber: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  stepNumberText: { fontSize: 12, fontWeight: '700', color: '#FFFFFF' },
  stepText: { flex: 1, fontSize: 14, color: '#78350F', lineHeight: 20 },
});

export default ReportScreen;