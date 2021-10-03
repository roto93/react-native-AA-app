import { IDBUserDataProps, IDBRelationProps, IRelationRequest, IUserLookup } from './dbLibType';
import { db } from "../../firebase";
import firebase from 'firebase'

/**
 * ### Update an user's data.
 * 
 * @param userID The user id which is going to be used to write data.
 * @param data The data object to be written.
 */
export const userUpdate = async (userID: string, data: IDBUserDataProps) => {
    const userRef = db.ref(`/users/${userID}`)
    const oldUserData = (await userRef.once('value')).val()
    const newUserData = {
        ...oldUserData,
        ...data
    }

    let updateObj = {}
    updateObj[`/users/${userID}`] = newUserData


    // lookup
    const userLookup = (await db.ref(`/user_lookup/${userID}`).once('value')).val()
    let userRelationsUpdateObj = {}
    if (userLookup) {
        userRelationsUpdateObj = getUserUpdateObject(userID, userRelationsUpdateObj, userLookup, newUserData)
    }

    updateObj = {
        ...updateObj,
        ...userRelationsUpdateObj
    }

    db.ref().update(updateObj)
}


export const getUserUpdateObject = (userID: string, obj: object, lookup: IUserLookup, newUserData: object) => {

    // partner list
    const partnerListEntries = Object.entries(lookup.partner_list)
    partnerListEntries.forEach(([partnerID, _]) => {
        obj[`/partner_list/${partnerID}/${userID}`] = newUserData
    })

    // relations
    const relationEntries = Object.entries(lookup.relations)
    relationEntries.forEach(([relationID, role]) => {
        obj[`/relations/${relationID}/${role}`] = newUserData
    })

    return obj
}

export const getUserProfile = async (userID: string, type?: string): Promise<IDBUserDataProps | string> => {
    const userRef = db.ref(`/users/${userID}`)
    if (!type) return (await userRef.once('value')).val()
    return (await userRef.child(type).once('value')).val()
}


/**
 * ### Send a request to make a relation. waiting for partner to confirm.
 * 
 * @param userID The user id of the partner who you want to make a relation.
 * @param myID The user id of the curren user
 */
export const sendRequestToUser = async (userID: string, myID: string): Promise<any> => {
    if (userID === myID) throw Error('You can\'t send a request to your self')
    const userRequestsRef = db.ref(`/relation_requests/${userID}/`)
    const updateObj = {}
    const myUserObj = (await db.ref(`/users/${myID}`).once('value')).val()
    updateObj[getfullKey(userRequestsRef) + `/${myID}` + `/from`] = myUserObj
    updateObj[getfullKey(userRequestsRef) + `/${myID}` + `/at`] = (new Date()).toUTCString()
    await db.ref().update(updateObj)
}

type entry = [string, IRelationRequest]
export const getUserRequestArray = async (userID: string): Promise<[string, string][]> => {

    const requestList = (await db.ref(`/relation_requests/${userID}`).get()).val()
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


export const acceptRelation = async (createrID: string, partnerID: string) => {
    const relationsRef = db.ref(`/relations/`)
    const newRelationKey = relationsRef.push().key

    const obj1 = await createRelation(createrID, partnerID, newRelationKey)
    const obj2 = await createNewPartners(createrID, partnerID)
    // const obj3 = await addNewRelationToList(createrID, partnerID, newRelationKey)

    const updateObj = {
        ...obj1,
        ...obj2,
        //  ...obj3 
    }
    db.ref().update(updateObj)
}


export const createRelation = async (createrID: string, partnerID: string, newRelationKey: string) => {
    const createrData = (await db.ref(`/users/${createrID}`).once('value')).val()
    const partnerData = (await db.ref(`/users/${partnerID}`).once('value')).val()
    const relationPath = `/relations/${newRelationKey}`


    const newRelation: IDBRelationProps = {
        creater: createrData,
        partner: partnerData,
        relation_id: newRelationKey
    }

    const newRelationUpdateObj = {}
    newRelationUpdateObj[`${relationPath}`] = newRelation

    // relationsRef.child(newRelationKey).set(newRelation)

    let updateObj = getUserLookupUpdateObject(createrID, partnerID, newRelationKey)



    let deleteRelationRequestObject = deleteRelationRequest(createrID, partnerID)

    updateObj = { ...updateObj, ...newRelationUpdateObj, ...deleteRelationRequestObject }
    return updateObj
}


export const getUserLookupUpdateObject = (createrID: string, partnerID: string, relationID: string, toDelete?: boolean) => {
    const updateObj = {}
    updateObj[`/user_lookup/${createrID}/relations/${relationID}`] = toDelete ? null : 'creater'
    updateObj[`/user_lookup/${partnerID}/relations/${relationID}`] = toDelete ? null : 'partner'
    return updateObj
}


export const deleteRelationRequest = (createrID: string, partnerID: string) => {
    const ref = db.ref(`/relation_requests/${partnerID}/${createrID}`)
    const updateObj = {}
    updateObj[getfullKey(ref)] = null
    return updateObj
}


// 建立好友名單
export const createNewPartners = async (user1ID: string, user2ID: string) => {
    const [user1, user2] = await Promise.all([getUserProfile(user1ID), getUserProfile(user2ID)])

    const updateObj = {}

    updateObj[`/partner_list/${user1ID}/${user2ID}`] = user2
    updateObj[`/partner_list/${user2ID}/${user1ID}`] = user1

    // update user_lookup
    updateObj[`user_lookup/${user1ID}/partner_list/${user2ID}`] = true
    updateObj[`user_lookup/${user2ID}/partner_list/${user1ID}`] = true

    return updateObj
}


// export const addNewPartnerToList = async (user1ID: string, user2ID: string) => {
//     const user1Ref = db.ref(`/users/${user1ID}/partner_list/${user2ID}`)
//     const user2Ref = db.ref(`/users/${user2ID}/partner_list/${user1ID}`)
//     const userRefArray = [user1Ref, user2Ref]

//     const [user1DataSnap, user2DataSnap] = await Promise.all([
//         db.ref(`/users/${user1ID}`).get(),
//         db.ref(`/users/${user2ID}`).get()
//     ])
//     const [user1Data, user2Data] = [user1DataSnap.val(), user2DataSnap.val()]
//     const user1 = {
//         id: user1Data.uid,
//         email: user1Data.email,
//         username: user1Data.username,
//         user_exists: true
//     }
//     const user2 = {
//         id: user2ID,
//         email: user2Data.email,
//         username: user2Data.username,
//         user_exists: true
//     }
//     const userArray = [user1, user2]

//     const updateObj = {}
//     for (let i in userRefArray) {
//         updateObj[getfullKey(userRefArray[i])] = userArray[i]
//     }
//     return updateObj
// }

// TODO
// export const addNewRelationToList = async (user1ID: string, user2ID: string, relationID: string) => {
//     const ref1 = db.ref(`/users/${user1ID}/relations/${relationID}`)
//     const ref2 = db.ref(`/users/${user2ID}/relations/${relationID}`)
//     const refArray = [ref1, ref2]
//     const updateObj = {}
//     refArray.forEach(ref => {
//         updateObj[getfullKey(ref)] = true
//     })
//     return updateObj
// }


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
 * @param user1ID The user to be checked
 * @param user2ID The user to check if it's in user's list
 * @returns 
 */
export const checkIsAlreadyPartner = async (user1ID: string, user2ID: string) => {
    const userPartnerList = (await db.ref(`/users/${user1ID}/partner_list/`).get()).val()
    if (!userPartnerList) return false
    const userPartners = Object.keys(userPartnerList)
    return userPartners.includes(user2ID)
}









// export const deleteUserProfile = async (userID: string) => {
//     const userRef = db.ref(`/users/${userID}`)
//     const partnerList: object = (await userRef.child(`partner_list`).get()).val()
//     if (partnerList) {
//         const partners = Object.keys(partnerList)
//         for (let partner of partners) {
//             await db.ref(`/users/${partner}/partner_list/${userID}/user_exists`).set(false)
//         }
//     }
//     await userRef.remove()
// }

const getfullKey = (ref: firebase.database.Reference) => {
    return ref.toString().substring(ref.root.toString().length - 1)
}

