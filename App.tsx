import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, LogBox } from 'react-native';
import { AuthProvider } from './hook/AuthContext';
import { useAuth } from './hook/AuthContext'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './src/screens/HomePage';
import LogInPage from './src/screens/LogInPage';
import SignUpPage from './src/screens/SignUpPage';
import { RootStackParamList } from './types/types'

LogBox.ignoreLogs(['Setting a timer for a long'])

const Stack = createNativeStackNavigator()

const AppNavigation: React.FC = () => {
  const { currentUser } = useAuth()
  console.log(JSON.stringify(currentUser))



  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen name={"LogIn"} component={LogInPage} />
        <Stack.Screen name={"Home"} component={HomePage} />
        <Stack.Screen name={"SignUp"} component={SignUpPage} />

      </Stack.Navigator>
    </NavigationContainer>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default function APP() {

  return (
    <AuthProvider>
      <AppNavigation />
    </AuthProvider>
  )
}