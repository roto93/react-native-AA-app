import { useNavigation } from '@react-navigation/core'
import React from 'react'
import { StyleSheet, Text, View, Button } from 'react-native'
import { useAuth } from '../../hook/AuthContext'
import { IHomePage } from '../../types/types'
import LogInPage from './LogInPage'

const HomePage = () => {
    const { currentUser, logout, username } = useAuth()
    const navigation: any = useNavigation()

    const onLogout = () => {
        logout()
    }
    return (
        <View style={styles.container}>
            <Text>Home page</Text>
            <Button title={"Log out"} onPress={onLogout} />
            <Text>{username}</Text>
        </View>
    )
}

export default HomePage

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
    }
})
