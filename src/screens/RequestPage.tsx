import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { db } from '../../firebase'
import { useAuth } from '../hook/AuthContext'
import { addNewPartnerToList, checkUserRequest, createRelation } from '../lib/dbLib'
import AppLoading from 'expo-app-loading'

const RequestPage = () => {
    const { currentUser } = useAuth()
    const [requestArray, setRequestArray] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const userRequestRef = db.ref(`/relation_requests/${currentUser.uid}`)
        userRequestRef.on('value', (snap) => {
            console.log('data changed')
            checkUserRequest(currentUser.uid)
                .then(requests => {
                    setRequestArray(requests)
                    console.log(requests)
                })
                .then(() => { setIsFetching(false) })
        })

        return () => {
            userRequestRef.off('value')
        }
    }, [])

    if (isFetching) return (
        <View style={styles.container}>
            <ActivityIndicator size={40} color="gray" />
        </View>

    )
    return (
        <View style={styles.container}>
            <Text style={{ marginBottom: 24, }}>你有{requestArray.length}個請求</Text>
            {requestArray.map((request) => <RequestBox key={request.at} request={request} />)}
        </View>

    )
}

export default RequestPage

const styles = StyleSheet.create({
    container: {
        width: '100%',
        flex: 1,
        backgroundColor: '#fff',
        justifyContent: 'flex-start',
        alignItems: 'center',
        paddingVertical: 20
    },
    requestContainer: {
        width: "80%",
        marginVertical: 4,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',

    },
    confirmButton: {
        borderWidth: 1,
        paddingHorizontal: 8,
        paddingVertical: 4,
    }
})

type IRequestProps = {
    request: {
        from: string,
        fromId: string,
        at: string,
    }
}

const RequestBox = ({ request }: IRequestProps) => {
    const { from, fromId, at } = request
    const { currentUser } = useAuth()
    const onConfirm = async () => {
        try {
            await createRelation(fromId, currentUser.uid)
            await addNewPartnerToList(currentUser.uid, fromId)
        } catch (e) {
            alert(e.message)
        }
    }

    return (
        <View style={styles.requestContainer}>
            <Text>{from}</Text>
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={onConfirm}
            >
                <Text>確認</Text>
            </TouchableOpacity>
        </View>
    )
}

