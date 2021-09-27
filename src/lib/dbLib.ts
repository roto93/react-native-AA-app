import { IDBUserData } from './dbLibType';
import { db } from "../../firebase";
import { IAsyncResult } from '../hook/AuthContext';


/**
 * ### Update an user's data.
 * 
 * @param userId The user id which is going to be used to write data.
 * @param data The data to be written.
 */
export const userWrite = (userId: string, data: IDBUserData) => {

    const userRef = db.ref(`/users/${userId}`)
    const entries = Object.entries(data)
    entries.forEach(([key, value]) => {
        if (key === 'relation_to_be_confirmed') {
            sendRequestToUser(userId, value)
                .catch(e => console.log('userWrite error: ', e.message))
        } else {
            userRef.child(key).set(value)

                .catch(e => console.log('userWrite error: ', e.message))
        }
    })
    console.log("userWrite done")
}

export const requestWrite = (userId: string, value: IDBRequest) => {
    const requestRef = db.ref(`/requests/${userId}`)
    requestRef.push().set(value)
}


/**
 * ### Send a request to make a relation. waiting for partner to confirm.
 * 
 * @param userId The user id of the partner who you want to make a relation.
 * @param myId The user id of the curren user
 */
export const sendRequestToUser = async (userId: string, myId: string): Promise<IAsyncResult> => {
    try {
        // 取得對方的 request
        const userRequestsRef = db.ref(`/relation_requests/${userId}/`)
        await userRequestsRef.child(myId).set((new Date).toUTCString())

    } catch (e) {
        console.log(e.message)
        return { complete: false }
    }

}