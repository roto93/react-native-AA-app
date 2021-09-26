import { IUser, IDBUserData, IDBRelationRequest } from './dbLibType';
import firebase from 'firebase'
import { db } from "../../firebase";
import { useAuth } from '../hook/AuthContext';


export const userWrite = (userId: string, data: IDBUserData) => {

    const userRef = db.ref(`/users/${userId}`)
    const entries = Object.entries(data)
    entries.forEach(([key, value]) => {
        if (key === 'relation_to_be_confirmed') {
            sendRequestToUser(userId, value)
        } else {
            userRef.child(key).set(value)
        }
    })

}

export const sendRequestToUser = (userId: string, myId: string) => {
    const newRequest: IDBRelationRequest = { request_sender_uid: myId }
    db.ref(`/users/${userId}/relations_to_be_confirmed/`).push().set(newRequest)

}