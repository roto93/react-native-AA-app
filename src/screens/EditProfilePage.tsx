import React, { useEffect, useState } from 'react'
import { StyleSheet, Text, View, TextInput, Button, TouchableOpacity as TO, } from 'react-native'
import { db } from '../../firebase';
import AAInputBox from '../components/AAInputBox'
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
        db.ref(`/users/${currentUser.uid}`).on('value', (snap) => {
            const data: IDBUserDataProps = snap.val()
            setNewUsername(data.username)
        })
    }, [])

    return (
        <View style={styles.container}>
            <AAInputBox
                style={{ width: '80%' }}
                label={"用戶名稱"}
                value={newUsername}
                onChangeText={(text) => { setNewUsername(text) }}
            />

            <TO onPress={onSave}>
                <Text>確定</Text>
            </TO>

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
    }
})
