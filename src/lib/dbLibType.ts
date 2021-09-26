import firebase from 'firebase'
import { auth, db } from '../../firebase'

/**
 * The interface of current user object returned in firebase.auth().onAuthStateChanged()
 */
export type IUser = firebase.User

/**
 * ### Interface of Database User Data
 * 
 * The data stored at "user" reference in Firebase RealTime Database.
 * 
 * @param `email`
 * @param `logInBy`
 * @param `profile_picture`
 * @param `username`
 * @param `firstName`
 * @param `lastName`
 * @param `lastLogIn`
 * @param `createAt`
 */
export interface IDBUserData {
    uid?: string,
    email?: string,
    log_in_by?: string,
    profile_picture?: string,
    username?: string,
    last_log_in_at?: string,
    create_at?: string,
    relations?: string[]
    relations_to_be_confirmed?: IDBRelationRequest[]
}

export interface IDBRelation {
    relation_id?: string
    creater_uid?: string,
    partner_uid?: string,
    total_amount?: number,
    spendings_to_be_confirmed?: IDBSpending[]
}

export interface IDBRelationRequest {
    request_sender_uid: string
}

export interface IDBSpending {
    creater_uid: string,
    spender_uid: string,
    amount: number,
    confirmed: boolean,
    weighting: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'None',

}

