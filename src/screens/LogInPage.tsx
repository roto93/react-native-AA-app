import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, Dimensions, ActivityIndicator } from 'react-native'
import { useAuth } from '../hook/AuthContext'
import { useDispatch } from 'redux-react-hook'
import * as Action from '../redux/action'
import useNavigate from '../hook/useNavigate'

const winY: number = Dimensions.get('window').height

const LogInPage = () => {
    const { signInWithGoogleAsync, currentUser, signInWithFacebookAsync } = useAuth()
    const setShowToast = (bool, options) => dispatch(Action.setShowToast(bool, options))
    const dispatch = useDispatch()
    const { oneWayNavigate } = useNavigate()
    const [isLoading, setIsLoading] = useState(true);
    const [autoEndLoading, setAutoEndLoading] = useState(true);
    const [timeoutID, setTimeoutID] = useState<NodeJS.Timeout>(null);


    const onSignIn = async (method: "Google" | "Facebook") => {
        if (currentUser) return
        try {
            switch (method) {
                case "Google":
                    return await signInWithGoogleAsync()
                case "Facebook":
                    return await signInWithFacebookAsync()
                default: return null
            }
        } catch (e) {
            console.log(e.message)
        }
    }

    useEffect(() => {
        if (autoEndLoading) {
            const isLoadingTimeoutID = setTimeout(() => {
                if (isLoading && autoEndLoading) console.log('setTimeout'); setIsLoading(false)
            }, 1500);
            setTimeoutID(isLoadingTimeoutID)
        }

    }, [autoEndLoading])

    useEffect(() => {
        if (currentUser) {
            clearTimeout(timeoutID)
            setAutoEndLoading(false)
            oneWayNavigate("Home")
        }
    }, [currentUser])

    if (isLoading) return (
        <View style={[styles.container, { justifyContent: 'center', }]}>
            <ActivityIndicator size={50} color="grey" />
            <Text style={styles.loading}>Loading</Text>
        </View>
    )
    return (
        <View style={styles.container} >
            <Text style={styles.title}>Welcome!</Text>
            <TouchableOpacity style={styles.loginButton} onPress={() => { }} >
                <Text>Email 登入</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={() => { onSignIn("Google") }} >
                <Text>Google 登入</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.loginButton} onPress={() => { onSignIn("Facebook") }} >
                <Text>Facebook 登入</Text>
            </TouchableOpacity>
        </View>
    )
}

export default LogInPage

const styles = StyleSheet.create({
    container: {
        position: 'relative',
        height: "100%",
        backgroundColor: '#fff',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center'
    },
    loading: {
        fontSize: 20,
        margin: 8
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
