import { IDBUserData } from './dbLibType';
import { db } from "../../firebase";
import { } from 'uuid'


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
        userRef.child(key).set(value)
            .catch(e => console.log('userWrite error: ', e.message))
    })
    console.log("update user profile")
}


export const getUserProfile = async (userId: string, type: string) => {
    const userRef = db.ref(`/users/${userId}`)
    const data = await userRef.child(type).get()
    return data.val()
}


/**
 * ### Send a request to make a relation. waiting for partner to confirm.
 * 
 * @param userId The user id of the partner who you want to make a relation.
 * @param myId The user id of the curren user
 */
export const sendRequestToUser = async (userId: string, myId: string): Promise<any> => {
    if (userId === myId) throw Error('You can\'t send a request to your self')
    const userRequestsRef = db.ref(`/relation_requests/${userId}/`)
    await userRequestsRef.child(myId).set((new Date).toUTCString())
}


export const checkUserRequest = async (userId: string): Promise<[string, string][]> => {

    const requestList = (await db.ref(`/relation_requests/${userId}`).get()).val()
    const entries: [string, string][] = Object.entries(requestList)

    const requests = []
    for (const entry of entries) {
        const [fromId, UTC] = entry
        const username = await getUserProfile(fromId, 'username')
        console.log(username)
        requests.push({ from: username, at: UTC })
    }
    return requests
}


export const createRelation = (userId: string, myId: string) => {

    const newRelationRef = db.ref(`/relations/$`)

}