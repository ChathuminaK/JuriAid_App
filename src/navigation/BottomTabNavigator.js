import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { View, Text, TouchableOpacity, Animated, Platform } from 'react-native';
import { Home, Briefcase, BookOpen, User, MessageCircle } from 'lucide-react-native';

// Import screens
import HomeScreen from '../screens/HomeScreen';
import CasesScreen from '../screens/CasesScreen';
import ResourcesScreen from '../screens/ResourcesScreen';
import ProfileScreen from '../screens/ProfileScreen';
import AIChatScreen from '../screens/AIChatScreen'; // Import the separate screen
import CasesStackNavigator from './CasesStackNavigator';

const Tab = createBottomTabNavigator();

const COLORS = {
  primary: '#005A9C',
  primaryLight: '#EBF4FF',
  inactive: '#64748B',
  background: '#FFFFFF',
  shadow: '#000000',
  accent: '#10B981',
};

// Custom animated tab bar button component
const CustomTabBarButton = ({ children, onPress, isActive }) => {
  const scaleValue = React.useRef(new Animated.Value(1)).current;
  const translateY = React.useRef(new Animated.Value(0)).current;

  React.useEffect(() => {
    Animated.parallel([
      Animated.spring(scaleValue, {
        toValue: isActive ? 1.1 : 1,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
      Animated.spring(translateY, {
        toValue: isActive ? -4 : 0,
        useNativeDriver: true,
        tension: 100,
        friction: 8,
      }),
    ]).start();
  }, [isActive]);

  const handlePress = () => {
    // Tap animation
    Animated.sequence([
      Animated.timing(scaleValue, {
        toValue: 0.95,
        duration: 100,
        useNativeDriver: true,
      }),
      Animated.timing(scaleValue, {
        toValue: isActive ? 1.1 : 1,
        duration: 100,
        useNativeDriver: true,
      }),
    ]).start();

    onPress();
  };

  return (
    <TouchableOpacity
      style={{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingVertical: 12,
      }}
      onPress={handlePress}
      activeOpacity={0.8}
    >
      <Animated.View
        style={{
          transform: [{ scale: scaleValue }, { translateY: translateY }],
          alignItems: 'center',
        }}
      >
        {isActive && (
          <View
            style={{
              position: 'absolute',
              width: 40,
              height: 40,
              borderRadius: 20,
              backgroundColor: COLORS.primaryLight,
              top: -4,
              zIndex: -1,
            }}
          />
        )}
        {children}
      </Animated.View>
    </TouchableOpacity>
  );
};

// Custom tab bar component
const CustomTabBar = ({ state, descriptors, navigation }) => {
  return (
    <View style={styles.tabBarContainer}>
      {/* Background blur effect */}
      <View style={styles.tabBarBackground} />
      
      {/* Active indicator */}
      <Animated.View
        style={[
          styles.activeIndicator,
          {
            left: `${(state.index * 100) / state.routes.length}%`,
            width: `${100 / state.routes.length}%`,
          },
        ]}
      />

      {/* Tab buttons */}
      <View style={styles.tabBarContent}>
        {state.routes.map((route, index) => {
          const { options } = descriptors[route.key];
          const label = options.tabBarLabel || route.name;
          const isFocused = state.index === index;

          const onPress = () => {
            const event = navigation.emit({
              type: 'tabPress',
              target: route.key,
              canPreventDefault: true,
            });

            if (!isFocused && !event.defaultPrevented) {
              navigation.navigate(route.name);
            }
          };

          // Get icon component
          const getIcon = () => {
            const iconSize = isFocused ? 24 : 22;
            const iconColor = isFocused ? COLORS.primary : COLORS.inactive;

            switch (route.name) {
              case 'Home':
                return <Home color={iconColor} size={iconSize} strokeWidth={isFocused ? 2.5 : 2} />;
              case 'Cases':
                return <Briefcase color={iconColor} size={iconSize} strokeWidth={isFocused ? 2.5 : 2} />;
              case 'Resources':
                return <BookOpen color={iconColor} size={iconSize} strokeWidth={isFocused ? 2.5 : 2} />;
              case 'AI Chat':
                return <MessageCircle color={iconColor} size={iconSize} strokeWidth={isFocused ? 2.5 : 2} />;
              case 'Profile':
                return <User color={iconColor} size={iconSize} strokeWidth={isFocused ? 2.5 : 2} />;
              default:
                return null;
            }
          };

          return (
            <CustomTabBarButton
              key={route.key}
              onPress={onPress}
              isActive={isFocused}
            >
              <View style={styles.tabItemContainer}>
                {getIcon()}
                <Text
                  style={[
                    styles.tabLabel,
                    {
                      color: isFocused ? COLORS.primary : COLORS.inactive,
                      fontWeight: isFocused ? '700' : '500',
                      fontSize: isFocused ? 11 : 10,
                    },
                  ]}
                >
                  {label}
                </Text>
                {isFocused && <View style={styles.activeDot} />}
              </View>
            </CustomTabBarButton>
          );
        })}
      </View>

      {/* Notification badge for AI Chat */}
      <View style={styles.badgeContainer}>
        <View style={styles.notificationBadge}>
          <Text style={styles.badgeText}>2</Text>
        </View>
      </View>
    </View>
  );
};

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      tabBar={(props) => <CustomTabBar {...props} />}
      screenOptions={{
        headerShown: false,
      }}
      initialRouteName="Home"
    >
      <Tab.Screen
        name="Home"
        component={HomeScreen}
        options={{
          tabBarLabel: 'Home',
        }}
      />
      <Tab.Screen
        name="Cases"
        component={CasesStackNavigator}
        options={{
          tabBarLabel: 'Cases',
        }}
      />
      <Tab.Screen
        name="AI Chat"
        component={AIChatScreen}
        options={{
          tabBarLabel: 'AI Chat',
        }}
      />
      <Tab.Screen
        name="Resources"
        component={ResourcesScreen}
        options={{
          tabBarLabel: 'Resources',
        }}
      />
      <Tab.Screen
        name="Profile"
        component={ProfileScreen}
        options={{
          tabBarLabel: 'Profile',
        }}
      />
    </Tab.Navigator>
  );
};

const styles = {
  tabBarContainer: {
    position: 'relative',
    backgroundColor: 'transparent',
    paddingBottom: Platform.OS === 'ios' ? 20 : 10,
  },
  tabBarBackground: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: COLORS.background,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    shadowColor: COLORS.shadow,
    shadowOffset: {
      width: 0,
      height: -4,
    },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  activeIndicator: {
    position: 'absolute',
    top: 0,
    height: 3,
    backgroundColor: COLORS.primary,
    borderRadius: 2,
  },
  tabBarContent: {
    flexDirection: 'row',
    paddingTop: 12,
    paddingHorizontal: 8,
  },
  tabItemContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 50,
  },
  tabLabel: {
    marginTop: 4,
    fontSize: 10,
    fontWeight: '500',
  },
  activeDot: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: COLORS.primary,
    marginTop: 2,
  },
  badgeContainer: {
    position: 'absolute',
    top: 8,
    right: '38%', // Position over AI Chat tab
  },
  notificationBadge: {
    backgroundColor: COLORS.accent,
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: COLORS.background,
  },
  badgeText: {
    color: '#FFFFFF',
    fontSize: 10,
    fontWeight: 'bold',
  },
};

export default BottomTabNavigator;