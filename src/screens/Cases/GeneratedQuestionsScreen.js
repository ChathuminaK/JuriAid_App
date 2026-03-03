import React from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Download,
  Share2,
  CheckCircle2,
  Copy,
} from 'lucide-react-native';

const GeneratedQuestionsScreen = ({ navigation, route }) => {
  const { caseTitle } = route.params || {};

  // Hardcoded divorce case questions for Sri Lankan law
  const generatedQuestions = {
    summary: {
      title: caseTitle || "Divorce Case - Cruelty and Abandonment",
      totalQuestions: 14,
      generatedAt: new Date().toLocaleString(),
    },
    questions: [
      "Under which provisions of the Sri Lankan Divorce Act is the divorce petition filed?",
      "Does the court have jurisdiction to hear this divorce application?",
      "What specific acts constitute cruelty as alleged by the wife?",
      "For what duration has the husband allegedly abandoned the wife?",
      "Do the alleged facts satisfy the legal threshold for cruelty under Sri Lankan law?",
      "What documentary or witness evidence supports the claim of cruelty?",
      "Is there medical, police, or third-party evidence to substantiate the allegations?",
      "Can the abandonment be proven as intentional and without reasonable cause?",
      "Has the husband raised any defences against the allegations of cruelty or abandonment?",
      "Are there any counterclaims or reconciliation attempts presented by the husband?",
      "Is the wife seeking maintenance, alimony, or custody of children?",
      "What factors should the court consider when deciding maintenance or custody?",
      "How does Fernando v Fernando (2018) interpret cruelty under the Divorce Act?",
      "Are the facts of the present case comparable to those in the precedent?",
    ],
    recommendations: [
      {
        id: '1',
        text: "Gather all medical records, police reports, and witness statements that document instances of cruelty",
        priority: "High"
      },
      {
        id: '2',
        text: "Document the timeline of abandonment with dates, locations, and any communication attempts",
        priority: "High"
      },
      {
        id: '3',
        text: "Prepare financial statements for maintenance and alimony calculations if applicable",
        priority: "High"
      },
      {
        id: '4',
        text: "Review Fernando v Fernando (2018) and other relevant precedents on cruelty definitions",
        priority: "Medium"
      },
      {
        id: '5',
        text: "Consider alternative dispute resolution or mediation before proceeding to court",
        priority: "Medium"
      },
    ]
  };

  const handlePreviewReport = () => {
    // Navigate to Report tab to preview the report
    navigation.navigate('Report');
    };

  const handleDownloadReport = () => {
    Alert.alert(
      'Download Report',
      'Full divorce case analysis report with questions will be downloaded as PDF',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Download',
          onPress: () => {
            // Implement download functionality
            Alert.alert('Success', 'Divorce case report downloaded successfully!');
          }
        }
      ]
    );
  };

  const handleShareQuestions = () => {
    Alert.alert(
      'Share Questions',
      'Share these questions with your client via email or messaging',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Share',
          onPress: () => {
            Alert.alert('Success', 'Questions shared successfully!');
          }
        }
      ]
    );
  };

  const copyAllQuestions = () => {
    Alert.alert('Copied', 'All divorce case questions copied to clipboard!');
  };

  const getPriorityColor = (priority) => {
    switch (priority) {
      case 'High': return '#EF4444';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#10B981';
      default: return '#64748B';
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <ArrowLeft color="#1E293B" size={24} />
        </TouchableOpacity>
        <View style={styles.headerContent}>
          <Text style={styles.headerTitle}>Generated Questions</Text>
          <Text style={styles.headerSubtitle}>{generatedQuestions.summary.totalQuestions} questions ready</Text>
        </View>
        <TouchableOpacity style={styles.shareButton} onPress={handleShareQuestions}>
          <Share2 color="#005A9C" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Summary Card */}
        <View style={styles.summaryCard}>
          <View style={styles.summaryHeader}>
            <CheckCircle2 color="#10B981" size={28} />
            <View style={styles.summaryContent}>
              <Text style={styles.summaryTitle}>Questions Generated Successfully</Text>
              <Text style={styles.summaryText}>{generatedQuestions.summary.title}</Text>
            </View>
          </View>
          
          <View style={styles.summaryStats}>
            <View style={styles.statBox}>
              <Text style={styles.statNumber}>{generatedQuestions.summary.totalQuestions}</Text>
              <Text style={styles.statLabel}>Questions</Text>
            </View>
          </View>

          <Text style={styles.generatedTime}>Generated on {generatedQuestions.summary.generatedAt}</Text>
        </View>

        {/* Action Buttons */}
        <View style={styles.actionButtons}>
          <TouchableOpacity style={styles.primaryActionButton} onPress={handlePreviewReport}>
            <Download color="#FFFFFF" size={20} />
            <Text style={styles.primaryActionText}>Preview Report</Text>          
        </TouchableOpacity>
          
          <TouchableOpacity style={styles.secondaryActionButton} onPress={copyAllQuestions}>
            <Copy color="#005A9C" size={20} />
            <Text style={styles.secondaryActionText}>Copy All</Text>
          </TouchableOpacity>
        </View>

        {/* Questions List */}
        <View style={styles.questionsSection}>
          <Text style={styles.sectionTitle}>Client Questions</Text>
          {generatedQuestions.questions.map((question, index) => (
            <View key={index} style={styles.questionItem}>
              <View style={styles.questionNumber}>
                <Text style={styles.questionNumberText}>{index + 1}</Text>
              </View>
              <Text style={styles.questionText}>{question}</Text>
            </View>
          ))}
        </View>

        {/* Recommendations */}
        <View style={styles.recommendationsSection}>
          <Text style={styles.sectionTitle}>Next Steps & Recommendations</Text>
          {generatedQuestions.recommendations.map((rec) => (
            <View key={rec.id} style={styles.recommendationItem}>
              <View style={[
                styles.priorityIndicator,
                { backgroundColor: getPriorityColor(rec.priority) }
              ]} />
              <View style={styles.recommendationContent}>
                <Text style={styles.recommendationText}>{rec.text}</Text>
                <View style={[
                  styles.priorityBadge,
                  { backgroundColor: `${getPriorityColor(rec.priority)}15` }
                ]}>
                  <Text style={[
                    styles.priorityText,
                    { color: getPriorityColor(rec.priority) }
                  ]}>
                    {rec.priority} Priority
                  </Text>
                </View>
              </View>
            </View>
          ))}
        </View>

        {/* Download Report Button (Bottom) */}
        <TouchableOpacity style={styles.bottomDownloadButton} onPress={handleDownloadReport}>
          <Download color="#FFFFFF" size={22} />
          <Text style={styles.bottomDownloadText}>Download Complete Report (PDF)</Text>
        </TouchableOpacity>

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#F8FAFC' },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: { marginRight: 12 },
  headerContent: { flex: 1 },
  headerTitle: { fontSize: 20, fontWeight: '700', color: '#1E293B' },
  headerSubtitle: { fontSize: 13, color: '#64748B', marginTop: 2 },
  shareButton: {
    padding: 8,
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
  },
  content: { flex: 1 },
  summaryCard: {
    backgroundColor: '#FFFFFF',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  summaryHeader: {
    flexDirection: 'row',
    marginBottom: 20,
  },
  summaryContent: {
    flex: 1,
    marginLeft: 12,
  },
  summaryTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 4,
  },
  summaryText: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
  },
  summaryStats: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  statBox: {
    flex: 1,
    alignItems: 'center',
  },
  statNumber: {
    fontSize: 24,
    fontWeight: '700',
    color: '#005A9C',
    marginBottom: 4,
  },
  statLabel: {
    fontSize: 13,
    color: '#64748B',
  },
  statDivider: {
    width: 1,
    backgroundColor: '#E2E8F0',
    marginHorizontal: 16,
  },
  generatedTime: {
    fontSize: 12,
    color: '#94A3B8',
    textAlign: 'center',
  },
  actionButtons: {
    flexDirection: 'row',
    gap: 12,
    marginHorizontal: 20,
    marginTop: 20,
  },
  primaryActionButton: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#10B981',
    borderRadius: 12,
    paddingVertical: 14,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  primaryActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#FFFFFF',
  },
  secondaryActionButton: {
    flexDirection: 'row',
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 14,
    alignItems: 'center',
    gap: 8,
  },
  secondaryActionText: {
    fontSize: 15,
    fontWeight: '600',
    color: '#005A9C',
  },
  categorySection: {
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
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  categoryInfo: { flex: 1 },
  categoryName: {
    fontSize: 17,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 2,
  },
  categoryCount: {
    fontSize: 13,
    color: '#64748B',
  },
  questionsContainer: { gap: 16 },
  questionItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  questionNumber: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
    marginTop: 2,
  },
  questionNumberText: {
    fontSize: 13,
    fontWeight: '700',
    color: '#005A9C',
  },
  questionText: {
    flex: 1,
    fontSize: 15,
    color: '#1E293B',
    lineHeight: 22,
  },
  recommendationsSection: {
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 16,
  },
  recommendationItem: {
    flexDirection: 'row',
    backgroundColor: '#F8FAFC',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
  },
  priorityIndicator: {
    width: 4,
    borderRadius: 2,
    marginRight: 12,
  },
  recommendationContent: { flex: 1 },
  recommendationText: {
    fontSize: 14,
    color: '#1E293B',
    lineHeight: 20,
    marginBottom: 8,
  },
  priorityBadge: {
    alignSelf: 'flex-start',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  bottomDownloadButton: {
    flexDirection: 'row',
    backgroundColor: '#005A9C',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#005A9C',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  bottomDownloadText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
  questionsSection: {
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
});

export default GeneratedQuestionsScreen;