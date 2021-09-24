import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react'
import { ScrollView, StyleSheet, Text, TextInput, TouchableOpacity, View, Dimensions } from 'react-native'
import { useAuth } from '../hook/AuthContext'
import { LogInPageProp } from '../../types/types'
import { RowView } from '../components/RowView'
import * as Linking from 'expo-linking'
import { useDispatch } from 'redux-react-hook'
import * as Action from '../redux/action'

const winY: number = Dimensions.get('window').height

const LogInPage = () => {
    const { signInWithGoogleAsync, currentUser } = useAuth()
    const navigation = useNavigation<LogInPageProp>()
    const setShowToast = (bool, options) => dispatch(Action.setShowToast(bool, options))
    const dispatch = useDispatch()

    const onGoogleSignIn = async () => {
        if (currentUser) return
        try {
            const res = await signInWithGoogleAsync()
            if (res) navigation.reset({
                index: 0,
                routes: [{ name: "Home" }]
            })
        } catch (e) {
            console.log(e)
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
