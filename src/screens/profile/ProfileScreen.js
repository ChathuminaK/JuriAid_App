import React, { useState, useEffect } from 'react';
import { 
  StyleSheet, 
  Text, 
  View, 
  SafeAreaView, 
  TouchableOpacity, 
  ScrollView,
  Switch,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { 
  ChevronRight, 
  LogOut, 
  Settings, 
  Shield, 
  Bell,
  Moon,
  HelpCircle,
  Star,
  Edit,
  User as UserIcon,
} from 'lucide-react-native';
import { useDispatch, useSelector } from 'react-redux';
import { fetchProfile, logout } from '../../redux/slices/authSlice';

const ProfileScreen = ({ navigation }) => {
  const dispatch = useDispatch();
  const { user, profileLoading } = useSelector((state) => state.auth);
  
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);
  const [darkModeEnabled, setDarkModeEnabled] = useState(false);

  useEffect(() => {
    if (!user) {
      dispatch(fetchProfile());
    }
  }, [dispatch, user]);

  const handleLogout = async () => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Logout',
          style: 'destructive',
          onPress: async () => {
            await dispatch(logout()).unwrap();
            navigation.getParent()?.replace('Login');
          },
        },
      ]
    );
  };

  const menuSections = [
    {
      title: 'Account',
      items: [
        { 
          icon: <Edit color="#005A9C" size={22} />, 
          title: 'Edit Profile', 
          subtitle: 'Update your personal information',
          hasChevron: true,
          onPress: () => navigation.navigate('EditProfile'),
        },
        { 
          icon: <Bell color="#005A9C" size={22} />, 
          title: 'Notifications', 
          subtitle: 'Manage your notification preferences',
          hasSwitch: true,
          switchValue: notificationsEnabled,
          onSwitchChange: setNotificationsEnabled,
        },
        { 
          icon: <Moon color="#005A9C" size={22} />, 
          title: 'Dark Mode', 
          subtitle: 'Switch to dark theme',
          hasSwitch: true,
          switchValue: darkModeEnabled,
          onSwitchChange: setDarkModeEnabled,
        }
      ]
    },
    {
      title: 'Security',
      items: [
        { 
          icon: <Shield color="#005A9C" size={22} />, 
          title: 'Privacy & Security', 
          subtitle: 'Manage your privacy settings',
          hasChevron: true,
        },
        { 
          icon: <Settings color="#005A9C" size={22} />, 
          title: 'Account Settings', 
          subtitle: 'Password, security, and more',
          hasChevron: true,
        }
      ]
    },
    {
      title: 'Support',
      items: [
        { 
          icon: <HelpCircle color="#005A9C" size={22} />, 
          title: 'Help & Support', 
          subtitle: 'Get help and contact support',
          hasChevron: true,
        },
        { 
          icon: <Star color="#005A9C" size={22} />, 
          title: 'Rate App', 
          subtitle: 'Share your feedback with us',
          hasChevron: true,
        }
      ]
    }
  ];

  const renderMenuItem = (item, index) => (
    <TouchableOpacity 
      key={index} 
      style={styles.menuItem}
      onPress={item.onPress}
    >
      <View style={styles.menuItemLeft}>
        <View style={styles.menuIconContainer}>
          {item.icon}
        </View>
        <View style={styles.menuTextContainer}>
          <Text style={styles.menuTitle}>{item.title}</Text>
          {item.subtitle && (
            <Text style={styles.menuSubtitle}>{item.subtitle}</Text>
          )}
        </View>
      </View>
      <View style={styles.menuItemRight}>
        {item.hasSwitch && (
          <Switch
            value={item.switchValue}
            onValueChange={item.onSwitchChange}
            trackColor={{ false: '#E2E8F0', true: '#005A9C' }}
            thumbColor="#FFFFFF"
          />
        )}
        {item.hasChevron && <ChevronRight color="#94A3B8" size={20} />}
      </View>
    </TouchableOpacity>
  );

  if (profileLoading) {
    return (
      <SafeAreaView style={styles.safeArea}>
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <ActivityIndicator size="large" color="#005A9C" />
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
        {/* Profile Header */}
        <View style={styles.profileHeader}>
          <View style={styles.avatarContainer}>
            <View style={styles.avatar}>
              <UserIcon color="#FFFFFF" size={48} />
            </View>
          </View>
          <Text style={styles.userName}>
            {user?.full_name || 'User Name'}
          </Text>
          <Text style={styles.userEmail}>
            {user?.email || 'user@example.com'}
          </Text>
          {user?.phone && (
            <Text style={styles.userPhone}>{user.phone}</Text>
          )}
          <Text style={styles.userRole}>Legal Professional</Text>

          <View style={styles.profileStats}>
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>15</Text>
              <Text style={styles.statLabel}>Active Cases</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>42</Text>
              <Text style={styles.statLabel}>Consultations</Text>
            </View>
            <View style={styles.statDivider} />
            <View style={styles.statItem}>
              <Text style={styles.statNumber}>98%</Text>
              <Text style={styles.statLabel}>Success Rate</Text>
            </View>
          </View>
        </View>

        {/* Menu Sections */}
        {menuSections.map((section, index) => (
          <View key={index} style={styles.menuSection}>
            <Text style={styles.sectionTitle}>{section.title}</Text>
            <View style={styles.menuContainer}>
              {section.items.map((item, itemIndex) => renderMenuItem(item, itemIndex))}
            </View>
          </View>
        ))}

        {/* Logout Button */}
        <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
          <View style={styles.logoutIconContainer}>
            <LogOut color="#EF4444" size={22} />
          </View>
          <Text style={styles.logoutText}>Logout</Text>
        </TouchableOpacity>

        <Text style={styles.versionText}>Version 1.0.0</Text>
      </ScrollView>
    </SafeAreaView>
  );
};

// Styles remain mostly the same, add:
const additionalStyles = {
  userPhone: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
};

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: '#F8FAFC' },
  container: { flex: 1, padding: 20 },
  profileHeader: {
    alignItems: 'center',
    marginBottom: 32,
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    padding: 32,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 4,
  },
  avatarContainer: { position: 'relative', marginBottom: 16 },
  avatar: {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 4,
    borderColor: '#EBF4FF',
    backgroundColor: '#005A9C',
    justifyContent: 'center',
    alignItems: 'center',
  },
  userName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#1E293B',
    marginBottom: 4,
  },
  userEmail: {
    fontSize: 16,
    color: '#64748B',
    marginBottom: 4,
  },
  userPhone: {
    fontSize: 14,
    color: '#64748B',
    marginBottom: 8,
  },
  userRole: {
    fontSize: 14,
    color: '#005A9C',
    fontWeight: '600',
    backgroundColor: '#EBF4FF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    marginBottom: 20,
  },
  profileStats: { flexDirection: 'row', alignItems: 'center' },
  statItem: { alignItems: 'center', paddingHorizontal: 20 },
  statNumber: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#005A9C',
    marginBottom: 4,
  },
  statLabel: { fontSize: 12, color: '#64748B' },
  statDivider: { width: 1, height: 30, backgroundColor: '#E2E8F0' },
  menuSection: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  menuContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  menuItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  menuIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#EBF4FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  menuTextContainer: { flex: 1 },
  menuTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#1E293B',
    marginBottom: 2,
  },
  menuSubtitle: { fontSize: 13, color: '#64748B' },
  menuItemRight: { alignItems: 'center' },
  logoutButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    marginBottom: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  logoutIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#FEE2E2',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  logoutText: { fontSize: 16, color: '#EF4444', fontWeight: '600' },
  versionText: {
    textAlign: 'center',
    fontSize: 12,
    color: '#94A3B8',
    marginBottom: 20,
  },
});

export default ProfileScreen;