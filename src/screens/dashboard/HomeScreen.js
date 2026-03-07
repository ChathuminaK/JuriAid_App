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
import { useSelector } from 'react-redux';
import { selectUser } from '../../redux/selector/authSelector';
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
  Briefcase,
  Heart
} from 'lucide-react-native';

const { width } = Dimensions.get('window');

const HomeScreen = ({ navigation }) => {
  const user = useSelector(selectUser);
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

  // Get user's first name or full name
  const getUserName = () => {
    if (user?.full_name) {
      const firstName = user.full_name.split(' ')[0];
      return firstName;
    }
    return 'User';
  };

  // Get user initials for profile image
  const getUserInitials = () => {
    if (user?.full_name) {
      const names = user.full_name.split(' ');
      if (names.length >= 2) {
        return names[0][0] + names[1][0];
      }
      return names[0][0];
    }
    return 'U';
  };

  const quickStats = [
    { 
      label: 'Divorce Cases', 
      value: '8', 
      icon: <Heart color="#FFFFFF" size={20} />, 
      color: '#667EEA',
      trend: '+2',
      trendColor: '#10B981'
    },
    { 
      label: 'Client Meetings', 
      value: '12', 
      icon: <Users color="#FFFFFF" size={20} />, 
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
      label: 'Reports Generated', 
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
      title: 'Divorce Case - Cruelty & Abandonment',
      client: 'Mrs. Nadeeka Perera',
      status: 'urgent',
      progress: 75,
      nextAction: 'File petition in District Court'
    },
    {
      id: '2',
      title: 'Divorce Case - Adultery',
      client: 'Mr. Rohan Silva',
      status: 'progress',
      progress: 45,
      nextAction: 'Evidence gathering in progress'
    },
    {
      id: '3',
      title: 'Divorce Case - Separation',
      client: 'Mrs. Amali Fernando',
      status: 'completed',
      progress: 100,
      nextAction: 'Decree nisi granted'
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
      title: 'Case Report',
      subtitle: 'View divorce case analysis',
      icon: <FileText color="#FFFFFF" size={28} />,
      backgroundColor: '#667EEA',
      action: () => navigation?.navigate('Report')
    },
    {
      title: 'Law Search',
      subtitle: 'Find Sri Lankan laws',
      icon: <Search color="#005A9C" size={28} />,
      backgroundColor: '#F1F5F9',
      textColor: '#005A9C',
      action: () => navigation?.navigate('Resources')
    },
    {
      title: 'Search Past Case',
      subtitle: 'Find past cases',
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
          <View style={styles.headerCard}>
            <View style={styles.headerContent}>
              <View style={styles.profileSection}>
                {/* Show profile image if available, otherwise initials */}
                <View style={styles.profileImageContainer}>
                  {user?.profile_icon_url ? (
                    <Image
                      source={{ uri: user.profile_icon_url }}
                      style={styles.profileImage}
                    />
                  ) : (
                    <Text style={styles.profileInitials}>{getUserInitials()}</Text>
                  )}
                </View>
                <View style={styles.greetingContainer}>
                  <Text style={styles.greeting}>{greeting} 👋</Text>
                  <Text style={styles.header}>Welcome, {getUserName()}!</Text>
                  <Text style={styles.subHeader}>Ready to manage your legal practice?</Text>
                </View>
              </View>
              {/* <View style={styles.headerActions}>
                <TouchableOpacity style={styles.notificationButton}>
                  <Bell color="#005A9C" size={24} />
                  <View style={styles.notificationBadge}>
                    <Text style={styles.badgeText}>3</Text>
                  </View>
                </TouchableOpacity>
              </View> */}
            </View>
          </View>
        </Animated.View>

        {/* Enhanced Quick Stats with Trends */}
        {/* <Animated.View style={[styles.statsSection, { opacity: fadeAnim }]}>
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
        </Animated.View> */}

        {/* Main Feature - Full Divorce Case Analysis */}
        <TouchableOpacity
          style={styles.mainFeatureButton}
          onPress={() => navigation?.navigate('Cases', { screen: 'NewCase' })}
          activeOpacity={0.85}
        >
          {/* Decorative circles for visual depth */}
          <View style={styles.mainFeatureDecorCircle1} />
          <View style={styles.mainFeatureDecorCircle2} />

          <View style={styles.mainFeatureInner}>
            <View style={styles.mainFeatureIconBox}>
              <Scale color="#FFFFFF" size={36} />
            </View>
            <View style={styles.mainFeatureText}>
              <Text style={styles.mainFeatureLabel}>MAIN FEATURE</Text>
              <Text style={styles.mainFeatureTitle}>Full Divorce Case{'\n'}Analysis</Text>
              <Text style={styles.mainFeatureSubtitle}>
                AI-powered • Sri Lankan law insights
              </Text>
            </View>
            <View style={styles.mainFeatureArrow}>
              <ChevronRight color="#FFFFFF" size={24} />
            </View>
          </View>
          <View style={styles.mainFeatureFooter}>
            <View style={styles.mainFeatureBadge}>
              <Zap color="#FFD700" size={12} />
              <Text style={styles.mainFeatureBadgeText}>AI Powered</Text>
            </View>
            <Text style={styles.mainFeatureTapText}>Tap to start →</Text>
          </View>
        </TouchableOpacity>

        {/* Enhanced Quick Actions Grid */}
        <View style={styles.card}>
          <View style={styles.cardHeader}>
            <Text style={styles.cardTitle}>Quick Actions</Text>
            <View style={styles.cardHeaderBadge}>
              <Zap color="#005A9C" size={14} />
              <Text style={styles.cardHeaderBadgeText}>4 actions</Text>
            </View>
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
                <View style={styles.actionTextContainer}>
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
                </View>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Enhanced AI Assistant Card */}
        {/* <TouchableOpacity 
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
        </TouchableOpacity> */}

        {/* Enhanced Case Reports Card */}
        <TouchableOpacity 
          style={styles.aiAssistantCard}
          onPress={() => navigation?.navigate('Report')}
          activeOpacity={0.9}
        >
          <View style={styles.aiBackground}>
            <View style={styles.aiContent}>
              <View style={styles.aiIconContainer}>
                <FileText color="#FFFFFF" size={32} />
                <View style={styles.aiPulse} />
              </View>
              <View style={styles.aiTextContainer}>
                <Text style={styles.aiTitle}>Divorce Case Reports</Text>
                <Text style={styles.aiSubtitle}>
                  Access comprehensive Sri Lankan divorce case analysis
                </Text>
                {/* <View style={styles.aiStats}>
                  <Text style={styles.aiStatsText}>2 Active Reports • Updated Today</Text>
                </View> */}
              </View>
              <ChevronRight color="rgba(255,255,255,0.8)" size={24} />
            </View>
          </View>
        </TouchableOpacity>

        {/* Recent Cases with Enhanced Design */}
        {/* <View style={styles.card}>
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
        </View> */}

        {/* Today's Schedule Enhanced */}
        {/* <View style={styles.card}>
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
        </View> */}

        {/* Performance Insights */}
        {/* <View style={styles.card}>
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
        </View> */}
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  safeArea: { 
    flex: 1, 
    backgroundColor: '#EEF4FB',
  },
  container: { 
    padding: 20,
    paddingBottom: 100,
  },

  // ── Header ────────────────────────────────────────────────────────────────
  headerSection: {
    marginBottom: 20,
  },
  headerCard: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 20,
    shadowColor: '#005A9C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.08,
    shadowRadius: 12,
    elevation: 4,
  },
  headerContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  profileSection: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  profileImageContainer: {
    width: 56,
    height: 56,
    borderRadius: 28,
    marginRight: 14,
    borderWidth: 3,
    borderColor: '#EBF4FF',
    backgroundColor: '#005A9C',
    justifyContent: 'center',
    alignItems: 'center',
    overflow: 'hidden',
  },
  profileImage: {
    width: 56,
    height: 56,
    borderRadius: 28,
  },
  profileInitials: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  greetingContainer: {
    flex: 1,
  },
  greeting: {
    fontSize: 13,
    color: '#64748B',
    marginBottom: 2,
  },
  header: { 
    fontSize: 20, 
    fontWeight: '800', 
    color: '#1E293B',
    marginBottom: 2,
  },
  subHeader: { 
    fontSize: 12, 
    color: '#94A3B8',
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
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
    elevation: 4,
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
    borderColor: '#FFFFFF',
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },

  // ── Stats (commented out but styles kept) ────────────────────────────────
  statsSection: { marginBottom: 24 },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  sectionTitle: { fontSize: 18, fontWeight: '700', color: '#1E293B' },
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
    elevation: 4,
  },
  statHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  statIcon: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 8,
    borderRadius: 12,
  },
  trendContainer: {
    backgroundColor: 'rgba(255,255,255,0.2)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 8,
  },
  trendText: { fontSize: 12, fontWeight: '600' },
  statValue: { fontSize: 28, fontWeight: 'bold', color: '#FFFFFF' },
  statLabel: { fontSize: 13, color: '#FFFFFF', opacity: 0.9, fontWeight: '500' },

  // ── Main Feature Button ───────────────────────────────────────────────────
  mainFeatureButton: {
    backgroundColor: '#2d4e8d',
    borderRadius: 28,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#003D6B',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 10,
    overflow: 'hidden',
  },
  mainFeatureDecorCircle1: {
    position: 'absolute',
    width: 180,
    height: 180,
    borderRadius: 90,
    backgroundColor: 'rgba(255,255,255,0.05)',
    top: -60,
    right: -40,
  },
  mainFeatureDecorCircle2: {
    position: 'absolute',
    width: 100,
    height: 100,
    borderRadius: 50,
    backgroundColor: 'rgba(255,255,255,0.05)',
    bottom: -30,
    left: 20,
  },
  mainFeatureInner: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  mainFeatureIconBox: {
    width: 68,
    height: 68,
    borderRadius: 22,
    backgroundColor: 'rgba(255,255,255,0.18)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  mainFeatureText: {
    flex: 1,
  },
  mainFeatureLabel: {
    fontSize: 10,
    fontWeight: '800',
    color: 'rgba(255,255,255,0.6)',
    letterSpacing: 1.5,
    marginBottom: 4,
  },
  mainFeatureTitle: {
    fontSize: 20,
    fontWeight: '800',
    color: '#FFFFFF',
    lineHeight: 26,
    marginBottom: 6,
  },
  mainFeatureSubtitle: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.75)',
  },
  mainFeatureArrow: {
    backgroundColor: 'rgba(255,255,255,0.15)',
    borderRadius: 14,
    padding: 10,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.2)',
  },
  mainFeatureFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderTopWidth: 1,
    borderTopColor: 'rgba(255,255,255,0.12)',
    paddingTop: 14,
  },
  mainFeatureBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.12)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    gap: 6,
  },
  mainFeatureBadgeText: {
    fontSize: 12,
    fontWeight: '700',
    color: '#FFD700',
  },
  mainFeatureTapText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.55)',
    fontWeight: '500',
  },

  // ── Cards ─────────────────────────────────────────────────────────────────
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 24,
    marginBottom: 20,
    shadowColor: '#005A9C',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.07,
    shadowRadius: 16,
    elevation: 4,
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  cardTitle: { 
    fontSize: 18, 
    fontWeight: '700', 
    color: '#1E293B',
  },
  cardHeaderBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 10,
    paddingVertical: 5,
    borderRadius: 12,
    gap: 4,
  },
  cardHeaderBadgeText: {
    fontSize: 12,
    fontWeight: '600',
    color: '#005A9C',
  },
  viewAllText: {
    fontSize: 14,
    color: '#005A9C',
    fontWeight: '600',
  },

  // ── Quick Actions ─────────────────────────────────────────────────────────
  actionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
  },
  actionButton: {
    width: '48%',
    padding: 16,
    borderRadius: 20,
    alignItems: 'flex-start',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
    minHeight: 140,
    marginBottom: 12,
  },
  actionIconContainer: {
    width: 50,
    height: 50,
    borderRadius: 14,
    backgroundColor: 'rgba(255,255,255,0.25)',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 12,
  },
  actionTextContainer: {
    flex: 1,
    justifyContent: 'flex-end',
  },
  actionButtonTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  actionButtonSubtitle: {
    fontSize: 11,
    color: 'rgba(255,255,255,0.85)',
    lineHeight: 14,
  },

  // ── AI / Report Card ──────────────────────────────────────────────────────
  aiAssistantCard: {
    marginBottom: 20,
    borderRadius: 24,
    overflow: 'hidden',
    shadowColor: '#667EEA',
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 5,
  },
  aiBackground: {
    backgroundColor: '#667EEA',
    padding: 24,
  },
  aiContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiIconContainer: {
    position: 'relative',
    backgroundColor: 'rgba(255,255,255,0.2)',
    padding: 16,
    borderRadius: 20,
    marginRight: 16,
  },
  aiPulse: {
    position: 'absolute',
    top: 8,
    right: 8,
    width: 12,
    height: 12,
    borderRadius: 6,
    backgroundColor: '#10B981',
  },
  aiTextContainer: { flex: 1 },
  aiTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#FFFFFF',
    marginBottom: 4,
  },
  aiSubtitle: {
    fontSize: 13,
    color: 'rgba(255,255,255,0.9)',
    marginBottom: 8,
  },
  aiStats: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  aiStatsText: {
    fontSize: 12,
    color: 'rgba(255,255,255,0.8)',
    fontWeight: '500',
  },

  // ── Case Items (commented out but styles kept) ────────────────────────────
  caseItem: {
    backgroundColor: '#F8FAFC',
    borderRadius: 16,
    padding: 16,
    marginBottom: 12,
  },
  caseHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 12,
  },
  caseLeft: { flex: 1 },
  caseTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  caseClient: { fontSize: 14, color: '#64748B' },
  statusBadge: { padding: 8, borderRadius: 12 },
  progressContainer: { marginBottom: 12 },
  progressInfo: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  progressLabel: { fontSize: 12, color: '#64748B', fontWeight: '500' },
  progressValue: { fontSize: 12, color: '#005A9C', fontWeight: '600' },
  progressBar: { height: 6, backgroundColor: '#E2E8F0', borderRadius: 3 },
  progressFill: { height: '100%', backgroundColor: '#005A9C', borderRadius: 3 },
  nextAction: { fontSize: 12, color: '#64748B', fontStyle: 'italic' },

  // ── Schedule (commented out but styles kept) ──────────────────────────────
  scheduleItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  timeSlot: { alignItems: 'center', marginRight: 16, minWidth: 80 },
  timeText: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 8 },
  completedTime: { color: '#64748B' },
  timeIndicator: { width: 12, height: 12, borderRadius: 6, backgroundColor: '#005A9C' },
  timeIndicatorCompleted: { backgroundColor: '#10B981' },
  scheduleContent: { flex: 1 },
  scheduleTitle: { fontSize: 16, fontWeight: '600', color: '#1E293B', marginBottom: 4 },
  scheduleSubtitle: { fontSize: 14, color: '#64748B', marginBottom: 8 },
  scheduleLocation: { flexDirection: 'row', alignItems: 'center' },
  locationText: { fontSize: 12, color: '#64748B', marginLeft: 4 },
  completedText: { opacity: 0.6 },
  scheduleAction: { padding: 8 },
  completedBadge: { padding: 8 },

  // ── Insights (commented out but styles kept) ──────────────────────────────
  insightsList: { gap: 16 },
  insightItem: { flexDirection: 'row', alignItems: 'center' },
  insightIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#F8FAFC',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  insightContent: { flex: 1 },
  insightTitle: { fontSize: 14, fontWeight: '600', color: '#1E293B', marginBottom: 2 },
  insightValue: { fontSize: 13, color: '#64748B' },
});

export default HomeScreen;