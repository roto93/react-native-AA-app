import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, ScrollView, TouchableOpacity, TextInput, Dimensions } from 'react-native'
import { useAuth } from '../hook/AuthContext'
import { SignUpPageProp } from '../../types/types'

const winY: number = Dimensions.get('window').height



const SignUpPage = () => {
    const { signup } = useAuth()
    const [email, setEmail] = useState<string>('');
    const [password, setPassword] = useState<string>('');
    const [password2, setPassword2] = useState('');
    const [error, setError] = useState('');
    const navigation = useNavigation<SignUpPageProp>()

    const onSignUp = async () => {
        if (password !== password2) {
            setError('Password confirmation failed')
            setPassword('')
            setPassword2('')
            return
        }
        try {
            const res = await signup(email, password)
            navigation.navigate('LogIn')
        } catch (e) {
        }
    }

    return (
        <ScrollView style={styles.container} contentContainerStyle={{ justifyContent: 'flex-start', alignItems: 'center' }}>
            <Text style={styles.title}>註冊新帳號</Text>
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

            <View style={[styles.inputBox, { marginTop: 8 }]}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    value={password2}
                    onChangeText={(text) => { setPassword2(text) }}
                />
            </View>



            <TouchableOpacity style={styles.loginButton} onPress={onSignUp} >
                <Text>註冊</Text>
            </TouchableOpacity>

        </ScrollView>
    )
}

export default SignUpPage

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: winY,
        backgroundColor: '#fff',
        width: '100%',
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
        marginTop: 32
    },
    GoogleLoginButton: {
        marginTop: 20
    }
})
