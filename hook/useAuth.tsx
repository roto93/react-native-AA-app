import { useState, useEffect, createContext, useContext } from 'react'
import firebase from 'firebase'
import { auth } from '../firebase'

const AuthContext = createContext({})

export const useAuth = () => {
    const [currentUser, setCurrentUser] = useState<firebase.User | null | Object>({});
    const [username, setUsername] = useState<string | null>('');

    const login = async (email: string, pwd: string) => {
        try {
            await auth.signInWithEmailAndPassword(email, pwd)
            setCurrentUser(auth.currentUser)
        } catch (e) { console.warn(e) }
    }

    const logout = async () => {
        try {
            auth.signOut()
        } catch (e) { console.warn(e) }
    }

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            if (user) {
                setUsername(user.displayName || user.email)
            } else {
                setUsername('')
            }
        })
        return unsubscribe
    }, [])

    return { login, logout, currentUser, username }
}