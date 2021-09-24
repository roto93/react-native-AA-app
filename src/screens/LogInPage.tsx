import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native'
import { useAuth } from '../hook/AuthContext'
import { LogInPageProp } from '../../types/types'
import { RowView } from '../components/RowView'
import * as Linking from 'expo-linking'

const winY: number = Dimensions.get('window').height

const LogInPage = () => {
    const { signInWithGoogleAsync, currentUser } = useAuth()
    const [email, setEmail] = useState('');
    const navigation = useNavigation<LogInPageProp>()
    const [data, setData] = useState<object>(null);

    console.log(currentUser?.email)

    const onGoogleSignIn = async () => {
        if (!currentUser) {
            try {
                await signInWithGoogleAsync()
                navigation.reset({
                    index: 0,
                    routes: [{ name: "Home" }]
                })
            } catch (e) {
                console.log(e)
            }
        }
    }

    useEffect(() => {
        if (currentUser) {
            navigation.reset({
                index: 0,
                routes: [{ name: 'Home' }]
            })
        }
    }, [currentUser])

    return (
        <View style={styles.container} >
            <Text style={styles.title}>Welcome!</Text>
            <Text>data:{data ? JSON.stringify(data) : 'no link'}</Text>
            <TextInput style={{ backgroundColor: '#888', width: 200, height: 40, }} value={email} onChangeText={t => setEmail(t)} />
            <TouchableOpacity style={styles.loginButton} onPress={() => { }} >
                <Text>Email 登入</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={onGoogleSignIn} >
                <Text>Google 登入</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={() => { }} >
                <Text>Facebook 登入</Text>
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

    loginButton: {
        width: 194,
        height: 48,
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },

})
