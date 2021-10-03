import firebase from 'firebase'
import { auth, db } from '../../firebase'

/**
 * The interface of current user object returned in firebase.auth().onAuthStateChanged()
 */
export type IUser = firebase.User

/**
 * ### Interface of Database User Data Props
 * 
 * These props are used to stored data at "user" reference in Firebase RealTime Database.
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
export interface IDBUserDataProps {
    uid?: string,
    email?: string,
    log_in_by?: string,
    profile_picture?: string,
    username?: string,
    last_log_in_at?: string,
    create_at?: string,
    relations?: string,
    partner_list?: string
}


/**
 * These props are used to create a new relation.
 * 
 * @param `relation_id`
 * @param `creater_uid`
 * @param `partner_uid`
 * @param `spendings_to_be_confirmed`
 */
export interface IDBRelationProps {
    relation_id?: string
    creater?: IUser,
    partner?: IUser,
    unconfirmed_spendings?: IDBSpending
    spendings?: IDBSpending
}


/**
 * This is the interface of spending. Every Spending should has these props.
 */
export interface IDBSpending {
    creater_uid: string,
    spender_uid: string,
    amount: number,
    confirmed: boolean,
    weighting: 0 | 1 | 2 | 3 | 4 | 5 | 6 | 7 | 8 | 9 | 10 | 'None',

}


export interface IpartnerProps {
    id: string,
    email: string,
    username: string,
}

export type IRequestEntries = [string, IRelationRequest]

export interface IRelationRequest {
    at: string,
    from: IDBUserDataProps
}
export interface IRequestsProps {
    at: string,
    username: string,
    id: string
}

export interface IUserLookup {
    partner_list: object,
    relations: object,
}