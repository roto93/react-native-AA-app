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
    logInBy?: string,
    profile_picture?: string,
    username?: string,
    lastLogInAt?: string,
    createAt?: string,
}