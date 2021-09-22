import React, { useState, useEffect, createContext, useContext, ReactChildren, ReactNode } from 'react'
import firebase from 'firebase'
import { auth } from '../firebase'

interface AuthContextType {
    currentUser: firebase.User | null,
    username: firebase.UserInfo | string | null,
    login: (email: string, password: string) => any
    logout: () => any
}

const defaultValue: AuthContextType = {
    currentUser: {} as firebase.User,
    username: '' as unknown as firebase.UserInfo,
    login: () => { },
    logout: () => { }
}

const AuthContext = createContext<AuthContextType>(defaultValue)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {
    const [currentUser, setCurrentUser] = useState<firebase.User | null>({} as firebase.User);
    const [username, setUsername] = useState<firebase.UserInfo | string | null>('' as unknown as firebase.UserInfo);

    // TODO: 應該output function 就好
    const login = async (email: string, pwd: string) => auth.signInWithEmailAndPassword(email, pwd)


    const logout = () => auth.signOut()


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            if (user) {
                user.displayName ? setUsername(user.displayName)
                    : setUsername(user.email)
            } else {
                setUsername('')
            }
        })
        return unsubscribe
    }, [])

    const value: AuthContextType = { login, logout, currentUser, username }

    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}