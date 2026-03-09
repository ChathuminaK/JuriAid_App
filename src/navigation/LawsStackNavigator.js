import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import SearchLawsScreen from '../screens/laws/SearchLawsScreen';
import LawResultsScreen from '../screens/laws/LawResultsScreen';
import ResourcesScreen from '../screens/laws/ResourcesScreen';
import AmendmentsListScreen from '../screens/laws/AmendmentsListScreen';
import LawQuerySearchScreen from '../screens/laws/LawQuerySearchScreen';

const Stack = createStackNavigator();

const LawsStackNavigator = () => {
  return (
    <Stack.Navigator screenOptions={{ headerShown: false }}>
      <Stack.Screen name="SearchLaws" component={SearchLawsScreen} />
      <Stack.Screen name="LawResults" component={LawResultsScreen} />
      <Stack.Screen name="Resources" component={ResourcesScreen} />
      <Stack.Screen name="AmendmentsList" component={AmendmentsListScreen} />
      <Stack.Screen name="LawQuerySearch" component={LawQuerySearchScreen} />
    </Stack.Navigator>
  );
};

export default LawsStackNavigator;