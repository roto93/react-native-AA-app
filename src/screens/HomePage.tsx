import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { useAuth } from '../hook/AuthContext'
import { db } from '../../firebase'
import { DataSnapShot, HomePageProp } from '../../types/types'
import useNavigate from '../hook/useNavigate'



const HomePage = () => {
    const { currentUser, logout, deleteUserAfterReAuth } = useAuth()

    const userRef = db.ref('/users/' + currentUser?.uid)

    const [email, setEmail] = useState('');
    const [logInBy, setLogInBy] = useState('');
    const [username, setUsername] = useState('');
    const { oneWayNavigate } = useNavigate()

    const write = () => {
        userRef.child("list").set([{ id: 1, name: 'aaa' }, { id: 2, name: 'bbb' }])
    }

    const onDeleteUser = async () => {
        try {
            const { complete } = await deleteUserAfterReAuth()
            if (complete) oneWayNavigate('LogIn')
        } catch (e) {
            console.log(e.message)
            console.log(e.code)
        }
    }

    const checkUserName = (username: string) => {
        if (username) return setUsername(username)
    }

    useEffect(() => {
        userRef.on('value', (snap: DataSnapShot) => {
            if (!snap.val()) return
            const { email, logInBy, username } = snap.val()
            setEmail(email)
            setLogInBy(logInBy)
            checkUserName(username)
        })

        return () => { userRef.off() }
    }, [currentUser])

    const onLogout = async (): Promise<void> => {
        await logout()
        oneWayNavigate('LogIn')
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
