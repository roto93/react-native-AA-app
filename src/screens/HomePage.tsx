import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, TextInput } from 'react-native'
import { useAuth } from '../hook/AuthContext'
import { db } from '../../firebase'
import { HomePageProp } from '../../types/types'
import useNavigate from '../hook/useNavigate'
import { IDBUserData, IUser } from '../lib/dbLibType'
import { sendRequestToUser, userWrite } from '../lib/dbLib'



const HomePage = () => {
    const { currentUser, logout, deleteUserAfterReAuth } = useAuth()

    const userRef = db.ref('/users/' + currentUser?.uid)

    const [emailToInvite, setEmailToInvite] = useState('');
    const [logInBy, setLogInBy] = useState('');
    const { oneWayNavigate } = useNavigate()

    const onDeleteUser = async () => {
        try {
            const { complete } = await deleteUserAfterReAuth()
            if (complete) oneWayNavigate('LogIn')
        } catch (e) {
            console.log(e.message)
            console.log(e.code)
        }
    }

    // 寄送邀請 
    const onInvite = async () => {
        // 查詢用戶
        const partnerDataSnap = await db.ref(`/users/`).orderByChild('email').equalTo(emailToInvite).once('value')
        if (!partnerDataSnap.exists()) return console.log('not exists')
        // 將自己的uid寫入對方的 relation_to_be_confirmed
        const partnerData: IDBUserData = partnerDataSnap.val()

        const partnerId = Object.keys(partnerDataSnap.val())[0]
        sendRequestToUser(partnerId, currentUser.uid)


    }
    useEffect(() => {
        console.log('run useEffect')
        userRef.on('value', (snap) => {
            const data: IDBUserData = snap.val()
            setLogInBy(data?.log_in_by)

        })

        return () => { userRef.off() }
    }, [])

    useEffect(() => {
        const getUserDataOnceAsync = async () => {
            const data: IDBUserData = (await userRef.get()).val()
            setLogInBy(data?.log_in_by)
        }
        getUserDataOnceAsync().catch(e => console.log(e.message))
    }, [currentUser])

    const onLogout = async (): Promise<void> => {
        await logout()
        oneWayNavigate('LogIn')
    }
    return (
        <View style={styles.container}>
            <Text style={styles.title}>Home page</Text>
            <Button title={"Log out"} onPress={onLogout} />
            <Text>{currentUser?.email}</Text>
            <Text>Your login methed is {logInBy === 'password' ? 'email and password' : logInBy}</Text>
            <Button title={"delete"} onPress={onDeleteUser} />

            <TextInput
                value={emailToInvite}
                onChangeText={(text) => { setEmailToInvite(text) }}
                style={styles.textInput}
            />
            <Button title={"invite"} onPress={onInvite} />
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
    textInput: {
        width: 220,
        height: 48,
        borderWidth: 1,
        padding: 8,
        marginTop: 16,
        fontSize: 16,
    }
})
