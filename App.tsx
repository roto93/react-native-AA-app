import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { AuthProvider } from './hook/AuthContext';
import { useAuth } from './hook/AuthContext'

function App() {
  const { login, logout, currentUser, username } = useAuth()


  const onLogin = async () => {
    let email = 'roto93@yahoo.com.tw'
    let pwd = '123456'
    const res = await login(email, pwd)
    console.log(res.user?.email)
  }

  const onLogout = async () => {
    await logout()
    console.log('logged out')
  }


  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title={"login"} onPress={onLogin} />
      <Button title={"logout"} onPress={onLogout} />
      <StatusBar style="auto" />
    </View>
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
      <App />
    </AuthProvider>
  )
}