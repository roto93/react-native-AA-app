import { IDBUserDataProps, IDBRelationProps, IpartnerProps } from './dbLibType';
import { db } from "../../firebase";
// import { v4 } from 'uuid' //npm install @types/uuid


/**
 * ### Update an user's data.
 * 
 * @param userId The user id which is going to be used to write data.
 * @param data The data to be written.
 */
export const userWrite = (userId: string, data: IDBUserDataProps) => {
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
    if (!requestList) return []
    const entries: [string, string][] = Object.entries(requestList)

    const requests = []
    for (const entry of entries) {
        const [fromId, UTC] = entry
        const username = await getUserProfile(fromId, 'username')
        console.log(username)
        requests.push({ from: username, fromId: fromId, at: UTC })
    }
    return requests
}


export const checkPartnerList = (userId: string, partnerId: string) => {
    const userPartnerListRef = db.ref(`/users/${userId}/partner_list/`).get()

}


export const createRelation = async (createrId: string, partnerId: string) => {

    const relationsRef = db.ref(`/relations/`)
    const newRelationKey = relationsRef.push().key
    const newRelation: IDBRelationProps = {
        creater_uid: createrId,
        partner_uid: partnerId,
        relation_id: newRelationKey
    }
    relationsRef.child(newRelationKey).set(newRelation)

    await deleteRelationRequest(createrId, partnerId)
}


export const deleteRelationRequest = async (createrId: string, partnerId: string) => {
    await db.ref(`relation_requests/${partnerId}/${createrId}`)
        .remove()
}

/**
 * ### 雙方互相寫入 partner_list
 * 
 * @param user1Id 第一個用戶id
 * @param user2Id 第二個用戶id
 */
export const addNewPartnerToList = async (user1Id: string, user2Id: string) => {
    const user1Ref = db.ref(`/users/${user1Id}`)
    const user2Ref = db.ref(`/users/${user2Id}`)
    const user1Data: IDBUserDataProps = (await db.ref(`/users/${user1Id}`).get()).val()
    const user2Data: IDBUserDataProps = (await db.ref(`/users/${user2Id}`).get()).val()

    const user1 = {
        id: user1Data.uid,
        email: user1Data.email,
        username: user1Data.username,
    }
    const user2 = {
        id: user2Id,
        email: user2Data.email,
        username: user2Data.username,
    }
    user1Ref.child(`partner_list/${user2Id}`).set(user2)
    user2Ref.child(`partner_list/${user1Id}`).set(user1)
}

export const addNewRelationToList = async () => {

}