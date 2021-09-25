import firebase from 'firebase'
import { auth, db } from '../../firebase'

/**
 * The interface of current user object returned in firebase.auth().onAuthStateChanged()
 */
export type IUser = firebase.User

/**
 * ### Interface of Database User Data
 * 
 * The data stored at "user" reference in Firebase Real Time Database.
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
    email?: string,
    log_in_by?: string,
    profile_picture?: string,
    username?: string,
    last_log_in_at?: string,
    create_at?: string,
    relations?: string[]
}

export interface IDBRelation {
    relation_id: string
    creater_id: string,
    partner_id: string,
    total_amount: number,

}

