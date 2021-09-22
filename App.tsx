import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './hook/AuthContext';
import { useAuth } from './hook/AuthContext'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './src/screens/HomePage';
import LogInPage from './src/screens/LogInPage';
import { RootStackParamList } from './types/types';


const Stack = createNativeStackNavigator()

const AppNavigation: React.FC = () => {
  const { currentUser } = useAuth()


  if (!currentUser) return <LogInPage />

  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen name={"Home"} component={HomePage} />
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