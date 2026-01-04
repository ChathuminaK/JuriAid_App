import React from 'react';
import { createStackNavigator } from '@react-navigation/stack';
import CasesScreen from '../screens/CasesScreen';
import NewCaseScreen from '../screens/Cases/NewCaseScreen';

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
    </Stack.Navigator>
  );
};

export default CasesStackNavigator;