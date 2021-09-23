import React, { useState, useEffect, createContext, useContext, ReactChildren, ReactNode } from 'react'
import firebase from 'firebase'
import { auth } from '../firebase'

interface AuthContextType {
    currentUser: firebase.User | null,
    userEmail: firebase.UserInfo | string | null,
    login: (email: string, password: string) => Promise<firebase.auth.UserCredential>
    logout: () => any
    signup: (email: string, password: string) => Promise<firebase.auth.UserCredential>
}

const defaultValue: AuthContextType = {
    currentUser: null as firebase.User,
    userEmail: '' as unknown as firebase.UserInfo,
    login: undefined,
    logout: undefined,
    signup: undefined,
}

const AuthContext = createContext<AuthContextType>(defaultValue)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
    const [userEmail, setUserEmail] = useState<firebase.UserInfo | string | null>('' as unknown as firebase.UserInfo);

    // TODO: 應該output function 就好
    const login = (email: string, pwd: string): Promise<firebase.auth.UserCredential> => (
        auth.signInWithEmailAndPassword(email, pwd)
    )

    const logout = () => auth.signOut()

    const signup = (email: string, pwd: string): Promise<firebase.auth.UserCredential> => auth.createUserWithEmailAndPassword(email, pwd)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            if (user) {
                user.displayName ? setUserEmail(user.displayName)
                    : setUserEmail(user.email)
            } else {
                setUserEmail('')
            }
        })
        return unsubscribe
    }, [])

    const value: AuthContextType = { login, logout, signup, currentUser, userEmail }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}