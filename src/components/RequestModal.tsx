import React, { useState, useEffect, memo } from 'react'
import { StyleSheet, Text, TouchableOpacity, View } from 'react-native'
import Modal from 'react-native-modal'
import { db } from '../../firebase'
import { useAuth } from '../hook/AuthContext'
import { checkUserRequest } from '../lib/dbLib'

const RequestModal = ({ isVisible, dismiss }) => {
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


    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver
            hideModalContentWhileAnimating
            onBackButtonPress={dismiss}
            onBackdropPress={dismiss}
            animationIn={'zoomIn'}
            animationOut={'zoomOut'}
            style={{ margin: 0, alignItems: 'center', }}
        >
            <View style={styles.container}>
                <Text style={{ marginBottom: 24, }}>你有{requestArray.length}個請求</Text>
                {!isFetching && requestArray.map((request) => <Request key={request.at} request={request} />)}
            </View>
        </Modal>
    )
}

export default memo(RequestModal)

const styles = StyleSheet.create({
    container: {
        width: 200,
        height: 300,
        backgroundColor: '#fff',
        justifyContent: 'center',
        alignItems: 'center',
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
        at: string,
    }
}

const Request = ({ request }: IRequestProps) => {
    const { from, at } = request
    console.log(from, at)
    const JSDate = new Date(Date.parse(at))
    const month: string = (JSDate.getMonth() + 1).toString()
    const date: string = (JSDate.getDate()).toString()
    return (
        <View style={styles.requestContainer}>
            <Text>{from}</Text>
            <TouchableOpacity
                style={styles.confirmButton}
                onPress={() => { }}
            >
                <Text>確認</Text>
            </TouchableOpacity>
        </View>
    )
}

