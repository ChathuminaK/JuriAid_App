import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CasesScreen from '../screens/Cases/CasesScreen';
import NewCaseScreen from '../screens/Cases/NewCaseScreen';
import CaseAnalysisResultScreen from '../screens/Cases/CaseAnalysisResultScreen';
import GeneratedQuestionsScreen from '../screens/Cases/GeneratedQuestionsScreen';

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
      <Stack.Screen name="CaseAnalysisResult" component={CaseAnalysisResultScreen} />
      <Stack.Screen name="GeneratedQuestions" component={GeneratedQuestionsScreen} />

    </Stack.Navigator>
  );
};

export default CasesStackNavigator;