import React, { useState } from 'react';
import {
  StyleSheet,
  Text,
  View,
  SafeAreaView,
  ScrollView,
  TouchableOpacity,
  Animated,
  Alert,
} from 'react-native';
import {
  ArrowLeft,
  Scale,
  BookOpen,
  FileText,
  ChevronDown,
  ChevronUp,
  ExternalLink,
  AlertCircle,
  CheckCircle2,
  Gavel,
  Users,
  Calendar,
  Download,
  Sparkles,
} from 'lucide-react-native';

const CaseAnalysisResultScreen = ({ navigation, route }) => {
  const [expandedSections, setExpandedSections] = useState({
    summary: true,
    laws: true,
    cases: true,
  });

  // Extract data from API response
  const { analysisData } = route.params || {};
  
  // Parse API response structure
  const parseApiResponse = (data) => {
    console.log('[CaseAnalysisResult] Parsing API response:', data);
    
    if (!data || !data.results) {
      console.log('[CaseAnalysisResult] No data or results - using fallback');
      return null; // Use hardcoded fallback
    }

    const parsed = {
      summary: null,
      relevantLaws: [],
      relevantCases: [],
      recommendedActions: [],
    };

    // Extract data from results array
    data.results.forEach(result => {
      console.log(`[CaseAnalysisResult] Processing tool: ${result.tool}`);
      
      // Handle both 'summarize' and 'core_summary'
      if ((result.tool === 'summarize' || result.tool === 'core_summary') && result.output) {
        console.log('[CaseAnalysisResult] Found summary data:', result.output);
        parsed.summary = {
          title: result.output.title || 'Case Analysis',
          type: result.output.type || data.case_type || 'Legal Matter',
          description: result.output.description || 'No description available',
          parties: result.output.parties || { plaintiff: 'Petitioner', defendant: 'Respondent' },
          dateFilied: result.output.dateFilied || result.output.dateFiled || 'Not specified',
          damagesClaimed: result.output.damagesClaimed || 'To be determined',
        };
        parsed.recommendedActions = result.output.recommendedActions || [];
      }
      
      if (result.tool === 'family_statutes' && result.output) {
        console.log('[CaseAnalysisResult] Found statutes:', result.output.length);
        parsed.relevantLaws = Array.isArray(result.output) ? result.output : [];
      }
      
      if (result.tool === 'family_precedents' && result.output) {
        console.log('[CaseAnalysisResult] Found precedents:', result.output.length);
        parsed.relevantCases = Array.isArray(result.output) ? result.output : [];
      }
    });

    console.log('[CaseAnalysisResult] Parsed data:', {
      hasSummary: !!parsed.summary,
      lawsCount: parsed.relevantLaws.length,
      casesCount: parsed.relevantCases.length,
      actionsCount: parsed.recommendedActions.length,
    });

    return parsed;
  };

  // Try to use API data, fallback to hardcoded
  const apiData = parseApiResponse(analysisData);
  console.log('[CaseAnalysisResult] Using API data?', !!apiData);
  
  const caseData = apiData || {
    summary: {
      title: "Divorce Case - Cruelty and Abandonment",
      type: "Matrimonial Law",
      description: "The wife seeks divorce on grounds of cruelty and abandonment under the Divorce Act. The wife alleges continuous physical and mental cruelty by the husband over a period of 3 years, including verbal abuse, threats, and physical assault. Additionally, the husband abandoned the matrimonial home 18 months ago without providing financial support or communication. The wife seeks divorce, maintenance, and custody of their two minor children.",
      parties: {
        plaintiff: "Wife (Petitioner)",
        defendant: "Husband (Respondent)"
      },
      dateFilied: "November 10, 2025",
      damagesClaimed: "Divorce decree, Monthly maintenance Rs. 50,000, Child custody",
    },
    relevantLaws: [
      {
        id: '1',
        code: "Divorce Act (Chapter 51) - Section 2",
        title: "Grounds for Divorce - Cruelty",
        description: "Defines cruelty as grounds for divorce under Sri Lankan matrimonial law",
        applicability: "High",
        keyPoints: [
          "Physical violence causing bodily harm",
          "Mental cruelty causing reasonable apprehension of harm",
          "Persistent pattern of conduct making cohabitation impossible",
          "Courts assess cruelty based on conduct, not subjective feelings"
        ]
      },
      {
        id: '2',
        code: "Divorce Act - Section 3",
        title: "Malicious Abandonment",
        description: "Addresses abandonment as grounds for divorce without reasonable cause",
        applicability: "High",
        keyPoints: [
          "Intentional separation for continuous period of one year or more",
          "Abandonment must be without reasonable cause",
          "Failure to provide maintenance during abandonment",
          "No intention to return to matrimonial home"
        ]
      },
      {
        id: '3',
        code: "Maintenance Act (Chapter 37)",
        title: "Maintenance for Wife and Children",
        description: "Governs financial support obligations for dependents",
        applicability: "High",
        keyPoints: [
          "Court considers earning capacity of both parties",
          "Standard of living during marriage",
          "Needs of children including education and healthcare",
          "Court may order interim and permanent maintenance"
        ]
      }
    ],
    relevantCases: [
      {
        id: '1',
        title: "Fernando v Fernando (2018)",
        citation: "2 SLR 145",
        court: "Supreme Court of Sri Lanka",
        year: "2018",
        relevance: "High",
        summary: "Landmark case interpreting the definition of cruelty under the Divorce Act, particularly mental cruelty and its impact on matrimonial relationship",
        keyHolding: "Mental cruelty includes conduct that causes reasonable apprehension of danger to life, limb or health, whether mental or physical. The test is objective - whether a reasonable person would find the conduct unbearable.",
        applicablePoints: [
          "Definition and scope of mental cruelty",
          "Burden of proof lies on petitioner to establish cruelty",
          "Pattern of conduct to be considered, not isolated incidents",
          "Court must assess impact on petitioner's wellbeing"
        ],
        outcome: "Petitioner granted divorce - mental cruelty established through pattern of degrading treatment"
      },
      {
        id: '2',
        title: "Perera v Perera (2016)",
        citation: "1 SLR 298",
        court: "Court of Appeal, Sri Lanka",
        year: "2016",
        relevance: "High",
        summary: "Addressed the requirements for proving malicious abandonment and its interaction with maintenance obligations",
        keyHolding: "Abandonment must be willful and without just cause. Mere physical separation does not constitute abandonment if there is reasonable cause. Failure to provide maintenance strengthens the case for abandonment.",
        applicablePoints: [
          "Elements required to prove abandonment",
          "Relevance of financial support during separation",
          "Intention to permanently desert must be demonstrated",
          "Communication attempts and reconciliation efforts considered"
        ],
        outcome: "Divorce granted on grounds of abandonment - husband left without cause and failed to maintain wife"
      },
      {
        id: '3',
        title: "Silva v Silva (2020)",
        citation: "3 SLR 67",
        court: "High Court of Colombo",
        year: "2020",
        relevance: "Medium",
        summary: "Established principles for determining maintenance amounts in divorce proceedings with custody considerations",
        keyHolding: "Maintenance must be calculated considering the standard of living during marriage, earning capacity of both parties, and the best interests of children. Court may order interim maintenance pending final decree.",
        applicablePoints: [
          "Factors for calculating maintenance payments",
          "Interim vs. permanent maintenance orders",
          "Child custody and its impact on maintenance",
          "Enforcement mechanisms for maintenance orders"
        ],
        outcome: "Monthly maintenance of Rs. 45,000 awarded to wife with child custody"
      }
    ],
    recommendedActions: [
      {
        id: '1',
        action: "Collect Evidence of Cruelty",
        priority: "High",
        description: "Gather medical records, police complaints, photographs of injuries, and witness statements documenting instances of physical and mental cruelty"
      },
      {
        id: '2',
        action: "Document Abandonment Timeline",
        priority: "High",
        description: "Prepare detailed chronology of husband's departure, attempts at communication, and lack of financial support over the 18-month period"
      },
      {
        id: '3',
        action: "File for Interim Maintenance",
        priority: "High",
        description: "Apply for interim maintenance and custody orders pending the final divorce decree to secure immediate financial support"
      },
      {
        id: '4',
        action: "Review Precedent Cases",
        priority: "Medium",
        description: "Study Fernando v Fernando (2018) and Perera v Perera (2016) to understand how courts interpret cruelty and abandonment"
      },
      {
        id: '5',
        action: "Prepare Financial Affidavit",
        priority: "Medium",
        description: "Complete comprehensive financial disclosure including income, assets, liabilities, and monthly expenses for maintenance determination"
      }
    ]
  };

  const toggleSection = (section) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  const getApplicabilityColor = (level) => {
    switch (level) {
      case 'High': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#64748B';
      default: return '#64748B';
    }
  };

  const getRelevanceColor = (level) => {
    switch (level) {
      case 'High': return '#10B981';
      case 'Medium': return '#F59E0B';
      case 'Low': return '#64748B';
      default: return '#64748B';
    }
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
          <Text style={styles.headerTitle}>Generate Client Questions</Text>
          <Text style={styles.headerSubtitle}>AI-Generated Legal Insights</Text>
        </View>
        <TouchableOpacity style={styles.downloadButton}>
          <Download color="#005A9C" size={20} />
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Case Summary Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('summary')}
          >
            <View style={styles.sectionTitleContainer}>
              <FileText color="#005A9C" size={24} />
              <Text style={styles.sectionTitle}>Case Summary</Text>
            </View>
            {expandedSections.summary ? (
              <ChevronUp color="#64748B" size={20} />
            ) : (
              <ChevronDown color="#64748B" size={20} />
            )}
          </TouchableOpacity>

          {expandedSections.summary && (
            <View style={styles.sectionContent}>
              <View style={styles.caseHeader}>
                <Text style={styles.caseTitle}>{caseData.summary.title}</Text>
                <View style={styles.caseTypeBadge}>
                  <Text style={styles.caseTypeText}>{caseData.summary.type}</Text>
                </View>
              </View>

              <View style={styles.caseMetadata}>
                <View style={styles.metadataItem}>
                  <Users color="#64748B" size={16} />
                  <Text style={styles.metadataText}>
                    {caseData.summary.parties.plaintiff} v. {caseData.summary.parties.defendant}
                  </Text>
                </View>
                <View style={styles.metadataItem}>
                  <Calendar color="#64748B" size={16} />
                  <Text style={styles.metadataText}>{caseData.summary.dateFilied}</Text>
                </View>
                <View style={styles.metadataItem}>
                  <AlertCircle color="#64748B" size={16} />
                  <Text style={styles.metadataText}>
                    Damages: {caseData.summary.damagesClaimed}
                  </Text>
                </View>
              </View>

              <Text style={styles.descriptionText}>{caseData.summary.description}</Text>
            </View>
          )}
        </View>

        {/* Relevant Laws Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('laws')}
          >
            <View style={styles.sectionTitleContainer}>
              <Scale color="#667EEA" size={24} />
              <View>
                <Text style={styles.sectionTitle}>Relevant Laws</Text>
                <Text style={styles.sectionCount}>{caseData.relevantLaws.length} statutes identified</Text>
              </View>
            </View>
            {expandedSections.laws ? (
              <ChevronUp color="#64748B" size={20} />
            ) : (
              <ChevronDown color="#64748B" size={20} />
            )}
          </TouchableOpacity>

          {expandedSections.laws && (
            <View style={styles.sectionContent}>
              {caseData.relevantLaws.map((law) => (
                <View key={law.id} style={styles.lawCard}>
                  <View style={styles.lawHeader}>
                    <View style={styles.lawCodeContainer}>
                      <Gavel color="#667EEA" size={18} />
                      <Text style={styles.lawCode}>{law.code}</Text>
                    </View>
                    <View style={[
                      styles.applicabilityBadge,
                      { backgroundColor: `${getApplicabilityColor(law.applicability)}15` }
                    ]}>
                      <Text style={[
                        styles.applicabilityText,
                        { color: getApplicabilityColor(law.applicability) }
                      ]}>
                        {law.applicability}
                      </Text>
                    </View>
                  </View>

                  <Text style={styles.lawTitle}>{law.title}</Text>
                  <Text style={styles.lawDescription}>{law.description}</Text>

                  <View style={styles.keyPointsContainer}>
                    <Text style={styles.keyPointsTitle}>Key Points:</Text>
                    {law.keyPoints.map((point, index) => (
                      <View key={index} style={styles.keyPoint}>
                        <View style={styles.bulletPoint} />
                        <Text style={styles.keyPointText}>{point}</Text>
                      </View>
                    ))}
                  </View>

                  <TouchableOpacity style={styles.viewMoreButton}>
                    <ExternalLink color="#005A9C" size={16} />
                    <Text style={styles.viewMoreText}>View Full Statute</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Relevant Past Cases Section */}
        <View style={styles.section}>
          <TouchableOpacity
            style={styles.sectionHeader}
            onPress={() => toggleSection('cases')}
          >
            <View style={styles.sectionTitleContainer}>
              <BookOpen color="#10B981" size={24} />
              <View>
                <Text style={styles.sectionTitle}>Relevant Past Cases</Text>
                <Text style={styles.sectionCount}>{caseData.relevantCases.length} precedents found</Text>
              </View>
            </View>
            {expandedSections.cases ? (
              <ChevronUp color="#64748B" size={20} />
            ) : (
              <ChevronDown color="#64748B" size={20} />
            )}
          </TouchableOpacity>

          {expandedSections.cases && (
            <View style={styles.sectionContent}>
              {caseData.relevantCases.map((case_) => (
                <View key={case_.id} style={styles.caseCard}>
                  <View style={styles.caseCardHeader}>
                    <View style={styles.caseNameContainer}>
                      <Text style={styles.caseName}>{case_.title}</Text>
                      <View style={[
                        styles.relevanceBadge,
                        { backgroundColor: `${getRelevanceColor(case_.relevance)}15` }
                      ]}>
                        <Text style={[
                          styles.relevanceText,
                          { color: getRelevanceColor(case_.relevance) }
                        ]}>
                          {case_.relevance} Relevance
                        </Text>
                      </View>
                    </View>
                  </View>

                  <View style={styles.caseCitation}>
                    <Text style={styles.citationText}>{case_.citation}</Text>
                    <Text style={styles.courtText}>{case_.court} ({case_.year})</Text>
                  </View>

                  <View style={styles.caseSection}>
                    <Text style={styles.caseSectionTitle}>Summary</Text>
                    <Text style={styles.caseSectionText}>{case_.summary}</Text>
                  </View>

                  <View style={styles.caseSection}>
                    <Text style={styles.caseSectionTitle}>Key Holding</Text>
                    <Text style={styles.keyHoldingText}>{case_.keyHolding}</Text>
                  </View>

                  <View style={styles.caseSection}>
                    <Text style={styles.caseSectionTitle}>Applicable Points</Text>
                    {case_.applicablePoints.map((point, index) => (
                      <View key={index} style={styles.applicablePoint}>
                        <CheckCircle2 color="#10B981" size={16} />
                        <Text style={styles.applicablePointText}>{point}</Text>
                      </View>
                    ))}
                  </View>

                  <View style={styles.outcomeContainer}>
                    <Text style={styles.outcomeLabel}>Outcome:</Text>
                    <Text style={styles.outcomeText}>{case_.outcome}</Text>
                  </View>

                  <TouchableOpacity style={styles.readCaseButton}>
                    <BookOpen color="#005A9C" size={16} />
                    <Text style={styles.readCaseText}>Read Full Case</Text>
                  </TouchableOpacity>
                </View>
              ))}
            </View>
          )}
        </View>

        {/* Recommended Actions */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <View style={styles.sectionTitleContainer}>
              <AlertCircle color="#F59E0B" size={24} />
              <Text style={styles.sectionTitle}>Recommended Actions</Text>
            </View>
          </View>

          <View style={styles.sectionContent}>
            {caseData.recommendedActions.map((action) => (
              <View key={action.id} style={styles.actionCard}>
                <View style={styles.actionHeader}>
                  <Text style={styles.actionTitle}>{action.action}</Text>
                  <View style={[
                    styles.priorityBadge,
                    { backgroundColor: `${getPriorityColor(action.priority)}15` }
                  ]}>
                    <Text style={[
                      styles.priorityText,
                      { color: getPriorityColor(action.priority) }
                    ]}>
                      {action.priority}
                    </Text>
                  </View>
                </View>
                <Text style={styles.actionDescription}>{action.description}</Text>
              </View>
            ))}
          </View>
        </View>

        {/* Generate Questions Button - Only show for full analysis */}
        {(caseData.relevantLaws.length > 0 || caseData.relevantCases.length > 0) && (
          <TouchableOpacity 
            style={styles.generateQuestionsButton}
            onPress={() => {
              console.log('[Navigation] Attempting to navigate to GeneratedQuestions');
              console.log('[Navigation] Current route params:', route.params);
              
              try {
                navigation.navigate('GeneratedQuestions', {
                  caseTitle: caseData.summary?.title || 'Case Analysis',
                  analysisData: analysisData, // Pass full API response
                });
              } catch (error) {
                console.error('[Navigation Error]:', error);
                Alert.alert('Navigation Error', error.toString());
              }
            }}
          >
            <Sparkles color="#FFFFFF" size={22} />
            <Text style={styles.generateQuestionsText}>Generate Client Questions</Text>
          </TouchableOpacity>
        )}

        <View style={{ height: 40 }} />
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  backButton: {
    marginRight: 12,
  },
  headerContent: {
    flex: 1,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 13,
    color: '#64748B',
  },
  downloadButton: {
    padding: 8,
    backgroundColor: '#EBF4FF',
    borderRadius: 12,
  },
  content: {
    flex: 1,
  },
  section: {
    marginTop: 16,
    marginHorizontal: 20,
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 20,
    backgroundColor: '#FFFFFF',
  },
  sectionTitleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    flex: 1,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  sectionCount: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  sectionContent: {
    padding: 20,
    paddingTop: 0,
  },
  caseHeader: {
    marginBottom: 16,
  },
  caseTitle: {
    fontSize: 20,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  caseTypeBadge: {
    alignSelf: 'flex-start',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 8,
  },
  caseTypeText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#005A9C',
  },
  caseMetadata: {
    gap: 12,
    marginBottom: 16,
  },
  metadataItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  metadataText: {
    fontSize: 14,
    color: '#64748B',
  },
  descriptionText: {
    fontSize: 15,
    lineHeight: 24,
    color: '#475569',
  },
  lawCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#667EEA',
  },
  lawHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  lawCodeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    flex: 1,
  },
  lawCode: {
    fontSize: 13,
    fontWeight: '600',
    color: '#667EEA',
  },
  applicabilityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  applicabilityText: {
    fontSize: 12,
    fontWeight: '600',
  },
  lawTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 8,
  },
  lawDescription: {
    fontSize: 14,
    color: '#64748B',
    lineHeight: 20,
    marginBottom: 12,
  },
  keyPointsContainer: {
    marginBottom: 12,
  },
  keyPointsTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8,
  },
  keyPoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bulletPoint: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#667EEA',
    marginTop: 6,
    marginRight: 8,
  },
  keyPointText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
  },
  viewMoreButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 4,
  },
  viewMoreText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#005A9C',
  },
  caseCard: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#10B981',
  },
  caseCardHeader: {
    marginBottom: 12,
  },
  caseNameContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
  },
  caseName: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  relevanceBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  relevanceText: {
    fontSize: 11,
    fontWeight: '600',
  },
  caseCitation: {
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  citationText: {
    fontSize: 13,
    color: '#64748B',
    fontStyle: 'italic',
    marginBottom: 4,
  },
  courtText: {
    fontSize: 12,
    color: '#94A3B8',
  },
  caseSection: {
    marginBottom: 12,
  },
  caseSectionTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 6,
  },
  caseSectionText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
  },
  keyHoldingText: {
    fontSize: 13,
    color: '#475569',
    lineHeight: 20,
    fontStyle: 'italic',
    backgroundColor: '#FEF3C7',
    padding: 10,
    borderRadius: 8,
  },
  applicablePoint: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  applicablePointText: {
    flex: 1,
    fontSize: 13,
    color: '#475569',
    lineHeight: 18,
    marginLeft: 8,
  },
  outcomeContainer: {
    backgroundColor: '#FFFFFF',
    padding: 12,
    borderRadius: 8,
    marginBottom: 12,
  },
  outcomeLabel: {
    fontSize: 12,
    fontWeight: '600',
    color: '#64748B',
    marginBottom: 4,
  },
  outcomeText: {
    fontSize: 13,
    color: '#1E293B',
    lineHeight: 18,
  },
  readCaseButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
  },
  readCaseText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#005A9C',
  },
  actionCard: {
    backgroundColor: '#FFFBEB',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  actionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
    flex: 1,
  },
  priorityBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 8,
  },
  priorityText: {
    fontSize: 11,
    fontWeight: '600',
  },
  actionDescription: {
    fontSize: 13,
    color: '#64748B',
    lineHeight: 18,
  },
  generateQuestionsButton: {
    flexDirection: 'row',
    backgroundColor: '#667EEA',
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    paddingVertical: 18,
    alignItems: 'center',
    justifyContent: 'center',
    gap: 12,
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.3,
    shadowRadius: 12,
    elevation: 6,
  },
  generateQuestionsText: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
  },
});

export default CaseAnalysisResultScreen;