import { StatusBar } from 'expo-status-bar';
import React, { useEffect, useState } from 'react';
import { Button, StyleSheet, Text, View } from 'react-native';
import { useAuth } from './hook/useAuth';


export default function App() {
  const { login, logout, currentUser, username } = useAuth()

  console.log('hi', username)

  const onLogin = async () => {
    let email = 'roto93@yahoo.com.tw'
    let pwd = '123456'
    await login(email, pwd)
  }



  return (
    <View style={styles.container}>
      <Text>Open up App.tsx to start working on your app!</Text>
      <Button title={"login"} onPress={onLogin} />
      <Button title={"logout"} onPress={logout} />
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
