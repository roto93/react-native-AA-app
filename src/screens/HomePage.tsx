import { useNavigation } from '@react-navigation/core'
import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, View, Button, TextInput, Keyboard } from 'react-native'
import { useAuth } from '../hook/AuthContext'
import { db } from '../../firebase'
import useNavigate from '../hook/useNavigate'
import { IDBUserDataProps } from '../lib/dbLibType'
import { checkIsAlreadyPartner, sendRequestToUser } from '../lib/dbLib'
import RequestModal from './RequestPage'
import { useDispatch } from 'redux-react-hook'
import * as Action from '../redux/action'



const HomePage = () => {
    const { currentUser, logout, deleteUserAfterReAuth } = useAuth()
    const userRef = db.ref('/users/' + currentUser?.uid)
    const [emailToInvite, setEmailToInvite] = useState('');
    const [logInBy, setLogInBy] = useState('');
    const { oneWayNavigate, navigate } = useNavigate()
    const [showRequestModal, setShowRequestModal] = useState(false);
    const setShowToast = (bool, options) => dispatch(Action.setShowToast(bool, options))
    const dispatch = useDispatch()

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
        Keyboard.dismiss()
        // check partner_list
        try {
            // 查詢用戶
            const partnerDataSnap = await db.ref(`/users/`).orderByChild('email').equalTo(emailToInvite).once('value')
            if (!partnerDataSnap.exists()) return alert('用戶不存在')
            // 將自己的uid寫入對方的 relation_to_be_confirmed
            const partnerData = partnerDataSnap.val() // {"7xMF23...":{"email":"...", ...}}

            const partnerId = Object.keys(partnerData)[0]
            const isAlreadyPartner = await checkIsAlreadyPartner(currentUser.uid, partnerId)
            if (isAlreadyPartner) throw Error("你們已經是朋友囉! 不能再邀請一次了")
            await sendRequestToUser(partnerId, currentUser.uid)
            setEmailToInvite('')
            setShowToast(true, { text: "已送出邀請" })
        } catch (e) {
            alert(e.message)
        }

    }

    const onCheck = () => {
        navigate("Request")
    }


    useEffect(() => {
        console.log('run useEffect')
        userRef.on('value', (snap) => {
            const data: IDBUserDataProps = snap.val()
            setLogInBy(data?.log_in_by)

        })

        return () => { userRef.off() }
    }, [])


    useEffect(() => {
        if (!currentUser) return
        const getUserDataOnceAsync = async () => {
            const data: IDBUserDataProps = (await userRef.get()).val()
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
            <Text>{currentUser?.providerData[0].email}</Text>
            <Text>Your login methed is {logInBy === 'password' ? 'email and password' : logInBy}</Text>
            <Button title={"delete"} onPress={onDeleteUser} />

            <TextInput
                value={emailToInvite}
                onChangeText={(text) => { setEmailToInvite(text) }}
                style={styles.textInput}
            />
            <Button title={"invite"} onPress={onInvite} />
            <Button title="Check requests" onPress={onCheck} />
            <Button title="test" onPress={() => { }} />
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
