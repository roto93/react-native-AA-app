import React, { useState, useEffect } from 'react'
import { StyleSheet, Text, TouchableOpacity, View, ActivityIndicator } from 'react-native'
import { db } from '../../firebase'
import { useAuth } from '../hook/AuthContext'
import { getUserRequestArray, acceptRelation } from '../lib/dbLib'
import { RowView } from '../components/RowView'
import { IRelationRequest, IRequestsProps } from '../lib/dbLibType'

const RequestPage = () => {
    const { currentUser } = useAuth()
    const [requestArray, setRequestArray] = useState([]);
    const [isFetching, setIsFetching] = useState(true);

    useEffect(() => {
        const userRequestRef = db.ref(`/relation_requests/${currentUser.uid}`)
        userRequestRef.on('value', (snap) => {
            getUserRequestArray(currentUser.uid)
                .then(requests => {
                    setRequestArray(requests)
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



const RequestBox = ({ request }: { request: IRequestsProps }) => {
    const { username, id, at } = request
    const { currentUser } = useAuth()
    const onAccept = async () => {
        try {
            await acceptRelation(id, currentUser.uid)
        } catch (e) {
            alert(e.message)
        }
    }
    const onReject = async () => {

    }

    return (
        <View style={styles.requestContainer}>
            <Text>{username}</Text>
            <RowView style={{ width: 120, justifyContent: 'space-between' }}>
                <TouchableOpacity style={styles.confirmButton} onPress={onAccept}>
                    <Text>確認</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.confirmButton} onPress={onReject}>
                    <Text>刪除</Text>
                </TouchableOpacity>
            </RowView>
        </View >
    )
}

