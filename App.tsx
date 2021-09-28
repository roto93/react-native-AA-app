import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View, LogBox } from 'react-native';
import { AuthProvider } from './src/hook/AuthContext';
import { useAuth } from './src/hook/AuthContext'
import { NavigationContainer } from '@react-navigation/native'
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomePage from './src/screens/HomePage';
import LogInPage from './src/screens/LogInPage';
import { RootStackParamList } from './types/types'
import Toast from './src/components/Toast';
import { StoreContext, useMappedState, useDispatch } from 'redux-react-hook'
import * as Action from './src/redux/action'
import store from './src/redux/store'
import RequestPage from './src/screens/RequestPage';

LogBox.ignoreLogs(['Setting a timer for a long'])

const Stack = createNativeStackNavigator<RootStackParamList>()

const AppNavigation: React.FC = () => {
  const showToast = useMappedState(state => state.showToastReducer.showToast)
  const showToastOptions = useMappedState(state => state.showToastReducer.options)
  const setShowToast = (bool: boolean) => dispatch(Action.setShowToast(bool))
  const dispatch = useDispatch()

  return (
    <NavigationContainer >
      <Stack.Navigator>
        <Stack.Screen name={"LogIn"} component={LogInPage} options={{ headerShown: false }} />
        <Stack.Screen name={"Home"} component={HomePage} />
        <Stack.Screen name={"Request"} component={RequestPage} />

      </Stack.Navigator>
      <Toast isVisible={showToast} setIsVisible={setShowToast} options={showToastOptions} />
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
    <StoreContext.Provider value={store()}>
      <AuthProvider>
        <AppNavigation />
      </AuthProvider>
    </StoreContext.Provider>
  )
}