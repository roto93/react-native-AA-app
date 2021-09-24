import { IUser } from './dbLibType';
import firebase from 'firebase'
import { db } from "../../firebase";
import { useAuth } from '../hook/AuthContext';


export const userWrite = (user: IUser, data: object) => {

    const userRef = db.ref(`/users/${user.uid}`)

    userRef.set({ ...data })

}