import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { useAuth } from '../hook/AuthContext'
import { db } from '../../firebase'
import { DataSnapShot, HomePageProp } from '../../types/types'



const HomePage = () => {
    const { currentUser, logout, getUserCredential, deleteUser } = useAuth()

    const userRef = db.ref('/users/' + currentUser?.uid)

    const [email, setEmail] = useState('');
    const [logInBy, setLogInBy] = useState('');
    const [username, setUsername] = useState('');
    const navigation = useNavigation<HomePageProp>()

    const write = () => {
        userRef.set({
            profile_picture: currentUser?.photoURL,
            logInBy: currentUser?.providerData[0]?.providerId
        })
    }

    const onDeleteUser = async () => {
        try {
            await deleteUser()
            navigation.reset({
                index: 0,
                routes: [{ name: 'LogIn' }]
            })
        } catch (e) {
            console.log(e.message)
        }
    }

    const checkUserName = (username: string) => {
        if (username) return setUsername(username)

    }

    useEffect(() => {
        userRef.on('value', (snap: DataSnapShot) => {
            if (!snap.val()) return
            setEmail(snap.val().email)
            setLogInBy(snap.val().logInBy)
            checkUserName(snap.val().username)
        })

        return () => { userRef.off() }
    }, [])

    const onLogout = async () => {
        await logout()
        navigation.reset({
            index: 0,
            routes: [{ name: 'LogIn' }]
        })
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home page</Text>
            <Button title={"Log out"} onPress={onLogout} />

            <Text>Your log in methed is {logInBy === 'password' ? 'email and password' : logInBy}</Text>
            <Button title={"write"} onPress={write} />
            <Button title={"delete"} onPress={onDeleteUser} />
        </View>
    )
}

export default HomePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 24
    },
})
