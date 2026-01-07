import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import ResourcesScreen from '../screens/laws/ResourcesScreen';
import AmendmentsScreen from '../screens/laws/AmendmentsScreen';

const Stack = createStackNavigator();

const LawsStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="ResourcesMain" component={ResourcesScreen} />
      <Stack.Screen name="Amendments" component={AmendmentsScreen} />
    </Stack.Navigator>
  );
};

export default LawsStackNavigator;