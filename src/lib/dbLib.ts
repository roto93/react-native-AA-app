import { IUser, IDBUserData } from './dbLibType';
import firebase from 'firebase'
import { db } from "../../firebase";
import { useAuth } from '../hook/AuthContext';


export const userWrite = (user: IUser, data: IDBUserData) => {

    const userRef = db.ref(`/users/${user.uid}`)

    userRef.set({ ...data })

}