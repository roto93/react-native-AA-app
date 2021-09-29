import { IDBUserDataProps, IDBRelationProps, IpartnerProps, IRelationRequest, IRequestEntries } from './dbLibType';
import { db } from "../../firebase";
import firebase from 'firebase'

/**
 * ### Update an user's data.
 * 
 * @param userId The user id which is going to be used to write data.
 * @param data The data object to be written.
 */
export const userUpdate = async (userId: string, data: IDBUserDataProps) => {
    const userRef = db.ref(`/users/${userId}`)

    const dataEntries = Object.entries(data)
    let updateObj = {}
    dataEntries.forEach(([key, val]) => {
        updateObj[getfullKey(userRef) + `/${key}`] = val
    })

    // lookup
    const userRelations = (await db.ref(`/user_relations/${userId}`).once('value')).val()
    const userRelationsUpdateObj = {}
    if (userRelations) {
        const suerRelationsEntries = Object.entries(userRelations)
        suerRelationsEntries.forEach(async ([relationKey, relationRole]) => {
            dataEntries.forEach(([dataKey, dataVal]) => {
                userRelationsUpdateObj[`/relations/${relationKey}/${relationRole}/${dataKey}`] = dataVal
                // userRelationsUpdateObj[`/relations/${key}/partner/${dataKey}`] = dataVal
            })
        })
    }

    updateObj = {
        ...updateObj,
        ...userRelationsUpdateObj
    }

    db.ref().update(updateObj)
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
    const updateObj = {}
    const myUserObj = (await db.ref(`/users/${myId}`).once('value')).val()
    updateObj[getfullKey(userRequestsRef) + `/${myId}` + `/from`] = myUserObj
    updateObj[getfullKey(userRequestsRef) + `/${myId}` + `/at`] = (new Date()).toUTCString()
    await db.ref().update(updateObj)
}

type entry = [string, IRelationRequest]
export const getUserRequestArray = async (userId: string): Promise<[string, string][]> => {

    const requestList = (await db.ref(`/relation_requests/${userId}`).get()).val()
    if (!requestList) return []
    const requests = []
    const entries: entry[] = Object.entries(requestList)
    entries.forEach(([idKey, val]: entry) => {
        const newItem = {
            at: val.at,
            username: val.from.username,
            id: val.from.uid
        }
        requests.push(newItem)
    })


    //{username,id,at}[]
    return requests
}


export const acceptRelation = async (createrId: string, partnerId: string) => {
    const relationsRef = db.ref(`/relations/`)
    const newRelationKey = relationsRef.push().key

    const obj1 = await createRelation(createrId, partnerId, newRelationKey)
    const obj2 = await addNewPartnerToList(createrId, partnerId)
    const obj3 = await addNewRelationToList(createrId, partnerId, newRelationKey)

    const updateObj = { ...obj1, ...obj2, ...obj3 }
    db.ref().update(updateObj)
}


export const createRelation = async (createrId: string, partnerId: string, newRelationKey: string) => {
    const createrData = (await db.ref(`/users/${createrId}`).once('value')).val()
    const partnerData = (await db.ref(`/users/${partnerId}`).once('value')).val()
    const relationPath = `/relations/${newRelationKey}`


    const newRelation: IDBRelationProps = {
        creater: createrData,
        partner: partnerData,
        relation_id: newRelationKey
    }

    const newRelationUpdateObj = {}
    newRelationUpdateObj[`${relationPath}`] = newRelation

    // relationsRef.child(newRelationKey).set(newRelation)

    let updateObj = createUserRelationUpdateObject(createrId, partnerId, newRelationKey)



    let deleteRelationRequestObject = deleteRelationRequest(createrId, partnerId)

    updateObj = { ...updateObj, ...newRelationUpdateObj, ...deleteRelationRequestObject }
    return updateObj
}


export const createUserRelationUpdateObject = (createrId: string, partnerId: string, relationId: string) => {
    const user1RelaitonsRef = db.ref(`/user_relations/${createrId}/${relationId}`)
    const user2RelaitonsRef = db.ref(`/user_relations/${partnerId}/${relationId}`)

    const updateObj = {}
    updateObj[getfullKey(user1RelaitonsRef)] = 'creater'
    updateObj[getfullKey(user2RelaitonsRef)] = 'partner'

    return updateObj

}


export const deleteRelationRequest = (createrId: string, partnerId: string) => {
    const ref = db.ref(`/relation_requests/${partnerId}/${createrId}`)
    const updateObj = {}
    updateObj[getfullKey(ref)] = null
    return updateObj
}



// TODO
/**
 * ### 雙方互相寫入 partner_list
 * 
 * @param user1Id 第一個用戶id
 * @param user2Id 第二個用戶id
 */
export const addNewPartnerToList = async (user1Id: string, user2Id: string) => {
    const user1Ref = db.ref(`/users/${user1Id}/partner_list/${user2Id}`)
    const user2Ref = db.ref(`/users/${user2Id}/partner_list/${user1Id}`)
    const userRefArray = [user1Ref, user2Ref]

    const [user1DataSnap, user2DataSnap] = await Promise.all([
        db.ref(`/users/${user1Id}`).get(),
        db.ref(`/users/${user2Id}`).get()
    ])
    const [user1Data, user2Data] = [user1DataSnap.val(), user2DataSnap.val()]
    const user1 = {
        id: user1Data.uid,
        email: user1Data.email,
        username: user1Data.username,
        user_exists: true
    }
    const user2 = {
        id: user2Id,
        email: user2Data.email,
        username: user2Data.username,
        user_exists: true
    }
    const userArray = [user1, user2]

    const updateObj = {}
    for (let i in userRefArray) {
        updateObj[getfullKey(userRefArray[i])] = userArray[i]
    }
    return updateObj
}

// TODO
export const addNewRelationToList = async (user1Id: string, user2Id: string, relationId: string) => {
    const ref1 = db.ref(`/users/${user1Id}/relations/${relationId}`)
    const ref2 = db.ref(`/users/${user2Id}/relations/${relationId}`)
    const refArray = [ref1, ref2]
    const updateObj = {}
    refArray.forEach(ref => {
        updateObj[getfullKey(ref)] = true
    })
    return updateObj
}


/**
 * 
 * Check in user1's partner_list.
 * 
 * return `true` if user2 IS in user1's partner_list
 * 
 * return `false` if user2 IS NOT in user1's partner_list
 * 
 * ---
 * 
 * @param user1Id The user to be checked
 * @param user2Id The user to check if it's in user's list
 * @returns 
 */
export const checkIsAlreadyPartner = async (user1Id: string, user2Id: string) => {
    const userPartnerList = (await db.ref(`/users/${user1Id}/partner_list/`).get()).val()
    if (!userPartnerList) return false
    const userPartners = Object.keys(userPartnerList)
    return userPartners.includes(user2Id)
}









// export const deleteUserProfile = async (userId: string) => {
//     const userRef = db.ref(`/users/${userId}`)
//     const partnerList: object = (await userRef.child(`partner_list`).get()).val()
//     if (partnerList) {
//         const partners = Object.keys(partnerList)
//         for (let partner of partners) {
//             await db.ref(`/users/${partner}/partner_list/${userId}/user_exists`).set(false)
//         }
//     }
//     await userRef.remove()
// }

const getfullKey = (ref: firebase.database.Reference) => {
    return ref.toString().substring(ref.root.toString().length - 1)
}

