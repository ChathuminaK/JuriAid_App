import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchLawsScreen from '../screens/laws/SearchLawsScreen';
import LawResultsScreen from '../screens/laws/LawResultsScreen';
import ResourcesScreen from '../screens/laws/ResourcesScreen';

const Stack = createStackNavigator();

const LawsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchLaws" component={SearchLawsScreen} />
      <Stack.Screen name="LawResults" component={LawResultsScreen} />
      <Stack.Screen name="Resources" component={ResourcesScreen} />
    </Stack.Navigator>
  );
};

export default LawsStackNavigator;