import React, { useState } from 'react'
import { Button, StyleSheet, Text, TextInput, View } from 'react-native'
import { useAuth } from '../../hook/AuthContext'

const LogInPage = () => {
    const { login, logout, currentUser, username } = useAuth()
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');


    const onLogin = async () => {
        let email = 'roto93@yahoo.com.tw'
        let pwd = '123456'
        const res = await login(email, pwd)
    }

    const onLogout = async () => {
        await logout()
        console.log('logged out')
    }



    return (
        <View style={styles.container}>
            <Text style={styles.title}>LogIn Page</Text>
            <View>
                <Text>Email</Text>
                <TextInput
                    value={email}
                    onChangeText={(text) => { setEmail(text) }}
                />
            </View>

            <View>
                <Text>Password</Text>
                <TextInput
                    value={password}
                    onChangeText={(text) => { setPassword(text) }}
                />
            </View>
            <Button title="log in" onPress={onLogin} />
        </View>
    )
}

export default LogInPage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 40

    }
})
