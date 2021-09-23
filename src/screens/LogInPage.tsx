import { useNavigation } from '@react-navigation/core'
import React, { useState } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native'
import { useAuth } from '../../hook/AuthContext'
import { LogInPageProp } from '../../types/types'
import { RowView } from '../components/RowView'

const winY: number = Dimensions.get('window').height

const LogInPage = () => {
    const { login } = useAuth()
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [error, setError] = useState('');
    const navigation = useNavigation<LogInPageProp>()

    const onLogin = async () => {
        try {
            const res = await login(email, password)
            console.log(res.user)
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }],
            })
        } catch (e) {
            console.log(e.message)
            setError(e.message)
        }
    }





    return (
        <View style={styles.container} >
            <Text style={styles.title}>Welcome!</Text>
            {error !== "" && <Text style={styles.error}>{error}</Text>}
            <View style={styles.inputBox}>
                <Text style={styles.label}>Email</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => { setEmail(text) }}
                />
            </View>

            <View style={styles.inputBox}>
                <Text style={styles.label}>Password</Text>
                <TextInput
                    style={styles.input}
                    value={password}
                    onChangeText={(text) => { setPassword(text) }}
                />
            </View>

            <RowView style={{ width: 140, justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.forgetPwdButton} onPress={() => { }} >
                    <Text>忘記密碼?</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.forgetPwdButton} onPress={() => { navigation.navigate("SignUp") }} >
                    <Text>註冊帳號</Text>
                </TouchableOpacity>
            </RowView>

            <TouchableOpacity style={styles.loginButton} onPress={onLogin} >
                <Text>登入</Text>
            </TouchableOpacity>

            <View style={{ borderTopWidth: 1, height: 1, width: 320, marginTop: 100, borderColor: '#888' }} />

            <TouchableOpacity style={[styles.loginButton, styles.GoogleLoginButton]} onPress={() => { }} >
                <Text>Google 登入</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LogInPage

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: winY,
        backgroundColor: '#fff',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    title: {
        fontSize: 36,
        fontWeight: 'bold',
        marginTop: 80
    },
    inputBox: {
        // borderWidth: 1,
        marginTop: 24
    },
    label: {
        fontSize: 16
    },
    input: {
        fontSize: 16,
        paddingHorizontal: 12,
        marginTop: 4,
        borderWidth: 1,
        width: 256,
        height: 48,
    },
    error: {
        color: '#f66',
        width: 300,
        textAlign: 'center',

    },
    forgetPwdButton: {
        marginTop: 16,
        marginBottom: 24,
    },
    loginButton: {
        width: 194,
        height: 48,
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    GoogleLoginButton: {
        marginTop: 20
    }
})