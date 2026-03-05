import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import CasesScreen              from '../screens/Cases/CasesScreen';
import NewCaseScreen            from '../screens/Cases/NewCaseScreen';
import CaseAnalysisResultScreen from '../screens/Cases/CaseAnalysisResultScreen';
import GeneratedQuestionsScreen from '../screens/Cases/GeneratedQuestionsScreen';
import ReportScreen             from '../screens/ReportScreen';

const Stack = createNativeStackNavigator();

const CasesStackNavigator = () => (
  <Stack.Navigator screenOptions={{ headerShown: false }}>
    <Stack.Screen name="Cases"              component={CasesScreen} />
    <Stack.Screen name="NewCase"            component={NewCaseScreen} />
    <Stack.Screen name="CaseAnalysisResult" component={CaseAnalysisResultScreen} />
    <Stack.Screen name="GeneratedQuestions" component={GeneratedQuestionsScreen} />
    <Stack.Screen name="Report"             component={ReportScreen} />
  </Stack.Navigator>
);

export default CasesStackNavigator;