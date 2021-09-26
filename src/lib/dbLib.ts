import { IUser, IDBUserData, IDBRelationRequest } from './dbLibType';
import firebase from 'firebase'
import { db } from "../../firebase";
import { IAsyncResult, useAuth } from '../hook/AuthContext';
import { LogInResult } from 'expo-google-app-auth';


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

export const sendRequestToUser = async (userId: string, myId: string): Promise<IAsyncResult> => {
    try {
        const userRequestRef = db.ref(`/users/${userId}/relations_to_be_confirmed`)

        // 取得對方的 relation_to_be_confirmed
        const snap = await userRequestRef.get()

        // 若無法取得
        if (!snap.exists()) {
            userRequestRef.push().set(myId)
            return { complete: true }
        }

        // 檢查是否已存在自己發出的請求
        const requestSenderList = Object.values(snap.val())

        // 若有，return
        if (requestSenderList.includes(myId)) return { complete: false }

        // 若無，新增請求
        await userRequestRef.push().set(myId)
        return { complete: true }

    } catch (e) {
        console.log(e.message)
        return { complete: false }
    }

}