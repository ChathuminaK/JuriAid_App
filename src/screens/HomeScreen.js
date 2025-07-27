import React, { useState, useRef, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  ScrollView, 
  TouchableOpacity,
  Dimensions,
  Animated,
  Image
} from 'react-native';
import { 
  FilePlus, 
  MessageSquare, 
  Search, 
  TrendingUp, 
  Calendar, 
  Bell,
  Clock,
  CheckCircle,
  AlertTriangle,
  Users,
  BookOpen,
  Award,
  ChevronRight,
  Zap,
  BarChart3,
  FileText,
  Scale,
  Briefcase
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const [greeting, setGreeting] = useState('Good Morning');
  const fadeAnim = useRef(new Animated.Value(0)).current;
  const slideAnim = useRef(new Animated.Value(50)).current;

  useEffect(() => {
    // Set greeting based on time
    const hour = new Date().getHours();
    if (hour < 12) setGreeting('Good Morning');
    else if (hour < 18) setGreeting('Good Afternoon');
    else setGreeting('Good Evening');

    // Entrance animations
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: 0,
        duration: 800,
        useNativeDriver: true,
      }),
    ]).start();
  }, []);

  const quickStats = [
    { 
      label: 'Active Cases', 
      value: '8', 
      icon: <Briefcase color="#FFFFFF" size={20} />, 
      color: '#667EEA',
      trend: '+2',
      trendColor: '#10B981'
    },
    { 
      label: 'Consultations', 
      value: '12', 
      icon: <MessageSquare color="#FFFFFF" size={20} />, 
      color: '#764BA2',
      trend: '+5',
      trendColor: '#10B981'
    },
    { 
      label: 'Success Rate', 
      value: '94%', 
      icon: <TrendingUp color="#FFFFFF" size={20} />, 
      color: '#F093FB',
      trend: '+3%',
      trendColor: '#10B981'
    },
    { 
      label: 'Documents', 
      value: '47', 
      icon: <FileText color="#FFFFFF" size={20} />, 
      color: '#43E97B',
      trend: '+8',
      trendColor: '#10B981'
    },
  ];

  const recentCases = [
    {
      id: '1',
      title: 'Property Dispute #1023',
      client: 'John Smith',
      status: 'urgent',
      progress: 75,
      nextAction: 'Court hearing tomorrow'
    },
    {
      id: '2',
      title: 'Contract Review',
      client: 'Tech Corp Inc.',
      status: 'progress',
      progress: 45,
      nextAction: 'Client review pending'
    },
    {
      id: '3',
      title: 'Employment Case',
      client: 'Mary Johnson',
      status: 'completed',
      progress: 100,
      nextAction: 'Case closed successfully'
    }
  ];

  const quickActions = [
    {
      title: 'New Case',
      subtitle: 'Start tracking a legal matter',
      icon: <FilePlus color="#FFFFFF" size={28} />,
      backgroundColor: '#005A9C',
      action: () => navigation?.navigate('Cases')
    },
    {
      title: 'AI Assistant',
      subtitle: 'Get instant legal guidance',
      icon: <MessageSquare color="#FFFFFF" size={28} />,
      backgroundColor: '#667EEA',
      action: () => navigation?.navigate('AI Chat')
    },
    {
      title: 'Find Lawyer',
      subtitle: 'Connect with professionals',
      icon: <Search color="#005A9C" size={28} />,
      backgroundColor: '#F1F5F9',
      textColor: '#005A9C',
      action: () => navigation?.navigate('Resources')
    },
    {
      title: 'Legal Resources',
      subtitle: 'Access law library',
      icon: <BookOpen color="#005A9C" size={28} />,
      backgroundColor: '#EBF4FF',
      textColor: '#005A9C',
      action: () => navigation?.navigate('Resources')
    }
  ];

  const getStatusIcon = (status) => {
    switch (status) {
      case 'urgent':
        return <AlertTriangle color="#EF4444" size={16} />;
      case 'progress':
        return <Clock color="#F59E0B" size={16} />;
      case 'completed':
        return <CheckCircle color="#10B981" size={16} />;
      default:
        return <Clock color="#6B7280" size={16} />;
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'urgent':
        return '#FEE2E2';
      case 'progress':
        return '#FEF3C7';
      case 'completed':
        return '#D1FAE5';
      default:
        return '#F3F4F6';
    }
  };

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView 
        contentContainerStyle={styles.container} 
        showsVerticalScrollIndicator={false}
        bounces={true}
      >
        {/* Enhanced Header Section */}
        <Animated.View 
          style={[
            styles.headerSection,
            {
              opacity: fadeAnim,
              transform: [{ translateY: slideAnim }]
            }
          ]}
        >
          <View style={styles.headerContent}>
            <View style={styles.profileSection}>
              <Image
                source={{ uri: 'https://placehold.co/60x60/EBF4FF/005A9C?text=JD' }}
                style={styles.profileImage}
              />
              <View style={styles.greetingContainer}>
                <Text style={styles.greeting}>{greeting}</Text>
                <Text style={styles.header}>Welcome back, John!</Text>
                <Text style={styles.subHeader}>Ready to manage your legal practice?</Text>
              </View>
            </View>
            <View style={styles.headerActions}>
              <TouchableOpacity style={styles.notificationButton}>
                <Bell color="#005A9C" size={24} />
                <View style={styles.notificationBadge}>
                  <Text style={styles.badgeText}>3</Text>
                </View>
              </TouchableOpacity>
            </View>
          </View>
        </Animated.View>

        {/* Enhanced Quick Stats with Trends */}
        <Animated.View style={[styles.statsSection, { opacity: fadeAnim }]}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Overview</Text>
            <TouchableOpacity>
              <BarChart3 color="#005A9C" size={20} />
            </TouchableOpacity>
          </View>
          <ScrollView horizontal showsHorizontalScrollIndicator={false}>
            {quickStats.map((stat, index) => (
              <TouchableOpacity key={index} style={[styles.statCard, { backgroundColor: stat.color }]}>
                <View style={styles.statHeader}>
                  <View style={styles.statIcon}>{stat.icon}</View>
                  <View style={styles.trendContainer}>
                    <Text style={[styles.trendText, { color: stat.trendColor }]}>
                      {stat.trend}
                    </Text>
                  </View>
                </View>
                <Text style={styles.statValue}>{stat.value}</Text>
                <Text style={styles.statLabel}>{stat.label}</Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </Animated.View>

        {/* Enhanced Quick Actions Grid */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <Zap color="#005A9C" size={20} />
          </View>
          <View style={styles.actionsGrid}>
            {quickActions.map((action, index) => (
              <TouchableOpacity 
                key={index}
                style={[
                  styles.actionButton,
                  { backgroundColor: action.backgroundColor }
                ]}
                onPress={action.action}
                activeOpacity={0.8}
              >
                <View style={[
                  styles.actionIconContainer,
                  action.textColor && { backgroundColor: 'rgba(0,90,156,0.1)' }
                ]}>
                  {action.icon}
                </View>
                <Text style={[
                  styles.actionButtonTitle,
                  action.textColor && { color: action.textColor }
                ]}>
                  {action.title}
                </Text>
                <Text style={[
                  styles.actionButtonSubtitle,
                  action.textColor && { color: '#64748B' }
                ]}>
                  {action.subtitle}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enhanced AI Assistant Card */}
        <TouchableOpacity 
          style={styles.aiAssistantCard}
          onPress={() => navigation?.navigate('AI Chat')}
          activeOpacity={0.9}
        >
          <View style={styles.aiBackground}>
            <View style={styles.aiContent}>
              <View style={styles.aiIconContainer}>
                <MessageSquare color="#FFFFFF" size={32} />
                <View style={styles.aiPulse} />
              </View>
              <View style={styles.aiTextContainer}>
                <Text style={styles.aiTitle}>AI Legal Assistant</Text>
                <Text style={styles.aiSubtitle}>
                  Get instant answers to your legal questions
                </Text>
                <View style={styles.aiStats}>
                  <Text style={styles.aiStatsText}>Available 24/7 • 2 unread messages</Text>
                </View>
              </View>
              <ChevronRight color="rgba(255,255,255,0.8)" size={24} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Recent Cases with Enhanced Design */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Recent Cases</Text>
            <TouchableOpacity onPress={() => navigation?.navigate('Cases')}>
              <Text style={styles.viewAllText}>View All</Text>
            </TouchableOpacity>
          </View>
          {recentCases.map((caseItem, index) => (
            <TouchableOpacity key={caseItem.id} style={styles.caseItem}>
              <View style={styles.caseHeader}>
                <View style={styles.caseLeft}>
                  <Text style={styles.caseTitle}>{caseItem.title}</Text>
                  <Text style={styles.caseClient}>Client: {caseItem.client}</Text>
                </View>
                <View style={[styles.statusBadge, { backgroundColor: getStatusColor(caseItem.status) }]}>
                  {getStatusIcon(caseItem.status)}
                </View>
              </View>
              <View style={styles.progressContainer}>
                <View style={styles.progressInfo}>
                  <Text style={styles.progressLabel}>Progress</Text>
                  <Text style={styles.progressValue}>{caseItem.progress}%</Text>
                </View>
                <View style={styles.progressBar}>
                  <View style={[styles.progressFill, { width: `${caseItem.progress}%` }]} />
                </View>
              </View>
              <Text style={styles.nextAction}>{caseItem.nextAction}</Text>
            </TouchableOpacity>
          ))}
        </View>

        {/* Today's Schedule Enhanced */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Today's Schedule</Text>
            <TouchableOpacity>
              <Calendar color="#005A9C" size={20} />
            </TouchableOpacity>
          </View>
          <View style={styles.scheduleItem}>
            <View style={styles.timeSlot}>
              <Text style={styles.timeText}>2:00 PM</Text>
              <View style={styles.timeIndicator} />
            </View>
            <View style={styles.scheduleContent}>
              <Text style={styles.scheduleTitle}>Client Consultation</Text>
              <Text style={styles.scheduleSubtitle}>Property Law Discussion</Text>
              <View style={styles.scheduleLocation}>
                <Users color="#64748B" size={14} />
                <Text style={styles.locationText}>Conference Room A</Text>
              </View>
            </View>
            <TouchableOpacity style={styles.scheduleAction}>
              <ChevronRight color="#64748B" size={16} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.scheduleItem}>
            <View style={styles.timeSlot}>
              <Text style={[styles.timeText, styles.completedTime]}>10:00 AM</Text>
              <View style={[styles.timeIndicator, styles.timeIndicatorCompleted]} />
            </View>
            <View style={styles.scheduleContent}>
              <Text style={[styles.scheduleTitle, styles.completedText]}>Court Filing</Text>
              <Text style={[styles.scheduleSubtitle, styles.completedText]}>Contract Dispute Documentation</Text>
              <View style={styles.scheduleLocation}>
                <Scale color="#10B981" size={14} />
                <Text style={[styles.locationText, styles.completedText]}>District Court</Text>
              </View>
            </View>
            <View style={styles.completedBadge}>
              <CheckCircle color="#10B981" size={16} />
            </View>
          </View>
        </View>

        {/* Performance Insights */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Performance Insights</Text>
            <Award color="#005A9C" size={20} />
          </View>
          <View style={styles.insightsList}>
            <View style={styles.insightItem}>
              <View style={styles.insightIcon}>
                <TrendingUp color="#10B981" size={20} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Case Resolution Time</Text>
                <Text style={styles.insightValue}>15% faster this month</Text>
              </View>
            </View>
            <View style={styles.insightItem}>
              <View style={styles.insightIcon}>
                <Users color="#F59E0B" size={20} />
              </View>
              <View style={styles.insightContent}>
                <Text style={styles.insightTitle}>Client Satisfaction</Text>
                <Text style={styles.insightValue}>4.8/5 rating average</Text>
              </View>
            </View>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#F8FAFC' 
  },
  container: { 
    padding: 20,
    paddingBottom: 100
  },
  headerSection: {
    marginBottom: 24
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1
  },
  profileImage: {
    width: 60,
    height: 60,
    borderRadius: 30,
    marginRight: 16,
    borderWidth: 3,
    borderColor: '#EBF4FF'
  },
  greetingContainer: {
    flex: 1
  },
  greeting: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 2
  },
  header: { 
    fontSize: 24, 
    fontWeight: 'bold', 
    color: '#1E293B',
    marginBottom: 4
  },
  subHeader: { 
    fontSize: 14, 
    color: '#64748B' 
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  notificationButton: {
    position: 'relative',
    padding: 12,
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  notificationBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: '#FFFFFF'
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold'
  },
  statsSection: {
    marginBottom: 24
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B'
  },
  statCard: {
    width: 140,
    height: 120,
    borderRadius: 20,
    padding: 20,
    marginRight: 16,
    justifyContent: 'space-between',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start'
  },
  statIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12
  },
  trendContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8
  },
  trendText: {
    fontSize: 12,
    fontWeight: '600'
  },
  statValue: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#FFFFFF'
  },
  statLabel: {
    fontSize: 13,
    color: '#FFFFFF',
    opacity: 0.9,
    fontWeight: '500'
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 16,
    elevation: 6,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20
  },
  cardTitle: { 
    fontSize: 20, 
    fontWeight: '700', 
    color: '#1E293B'
  },
  viewAllText: {
    fontSize: 14,
    color: '#005A9C',
    fontWeight: '600'
  },
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12
  },
  actionButton: {
    width: (width - 76) / 2,
    padding: 20,
    borderRadius: 20,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3
  },
  actionIconContainer: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: 'rgba(255,255,255,0.2)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12
  },
  actionButtonTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
    textAlign: 'center'
  },
  actionButtonSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    textAlign: 'center',
    lineHeight: 16
  },
  aiAssistantCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden'
  },
  aiBackground: {
    backgroundColor: '#667EEA',
    padding: 24
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  aiIconContainer: {
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 20,
    marginRight: 16
  },
  aiPulse: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981'
  },
  aiTextContainer: {
    flex: 1
  },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4
  },
  aiSubtitle: {
    fontSize: 14,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8
  },
  aiStats: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  aiStatsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500'
  },
  caseItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12
  },
  caseLeft: {
    flex: 1
  },
  caseTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4
  },
  caseClient: {
    fontSize: 14,
    color: '#64748B'
  },
  statusBadge: {
    padding: 8,
    borderRadius: 12
  },
  progressContainer: {
    marginBottom: 12
  },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8
  },
  progressLabel: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '500'
  },
  progressValue: {
    fontSize: 12,
    color: '#005A9C',
    fontWeight: '600'
  },
  progressBar: {
    height: 6,
    backgroundColor: '#E2E8F0',
    borderRadius: 3
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#005A9C',
    borderRadius: 3
  },
  nextAction: {
    fontSize: 12,
    color: '#64748B',
    fontStyle: 'italic'
  },
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9'
  },
  timeSlot: {
    alignItems: 'center',
    marginRight: 16,
    minWidth: 80
  },
  timeText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 8
  },
  completedTime: {
    color: '#64748B'
  },
  timeIndicator: {
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#005A9C'
  },
  timeIndicatorCompleted: {
    backgroundColor: '#10B981'
  },
  scheduleContent: {
    flex: 1
  },
  scheduleTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 4
  },
  scheduleSubtitle: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8
  },
  scheduleLocation: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  locationText: {
    fontSize: 12,
    color: '#64748B',
    marginLeft: 4
  },
  completedText: {
    opacity: 0.6
  },
  scheduleAction: {
    padding: 8
  },
  completedBadge: {
    padding: 8
  },
  insightsList: {
    gap: 16
  },
  insightItem: {
    flexDirection: 'row',
    alignItems: 'center'
  },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16
  },
  insightContent: {
    flex: 1
  },
  insightTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2
  },
  insightValue: {
    fontSize: 13,
    color: '#64748B'
  }
});

export default HomeScreen;