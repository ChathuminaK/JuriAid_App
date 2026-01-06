import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CasesScreen from '../screens/CasesScreen';
import NewCaseScreen from '../screens/Cases/NewCaseScreen';
import SimilarCasesScreen from '../screens/Cases/SimilarCasesScreen'; 
import CaseDetailScreen from '../screens/Cases/CaseDetailScreen';

const Stack = createStackNavigator();

const CasesStackNavigator = () => {
  return (
    <Stack.Navigator
      screenOptions={{
        headerShown: false,
      }}
    >
      <Stack.Screen name="CasesList" component={CasesScreen} />
      <Stack.Screen name="NewCase" component={NewCaseScreen} />
      <Stack.Screen name="CaseDetail" component={CaseDetailScreen} />
      <Stack.Screen name="SimilarCases" component={SimilarCasesScreen} />
    </Stack.Navigator>
  );
};

export default CasesStackNavigator;