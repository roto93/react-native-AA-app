import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity as TO, } from 'react-native'
import { db } from '../../firebase';
import AAInputBox from '../components/AAInputBox'
import AALoginButton from '../components/buttons/AALoginButton';
import { useAuth } from '../hook/AuthContext';
import { userUpdate } from '../lib/dbLib';
import { IDBUserDataProps } from '../lib/dbLibType';

const UpdateProfilePage = () => {
    const [newUsername, setNewUsername] = useState('');
    const { currentUser } = useAuth()




    const onSave = () => {
        if (!newUsername) return
        userUpdate(currentUser.uid, { username: newUsername })
    }


    useEffect(() => {
        const userRef = db.ref(`/users/${currentUser.uid}`)
        userRef.on('value', (snap) => {
            const data: IDBUserDataProps = snap.val()
            setNewUsername(data.username)
        })
        return () => {
            userRef.off('value')
        }
    }, [])

    return (
        <View style={styles.container}>
            <AAInputBox
                style={{ width: '80%' }}
                label={"用戶名稱"}
                value={newUsername}
                onChangeText={(text) => { setNewUsername(text) }}
            />

            <AALoginButton onPress={onSave} text={"確定"} />

        </View>
    )
}

export default UpdateProfilePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        width: '100%',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingTop: 20
    }
})
