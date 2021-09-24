import React, { useState, useEffect, createContext, useContext } from 'react'
import firebase from 'firebase'
import { auth, db } from '../../firebase'
import * as Google from 'expo-google-app-auth';
import { userWrite } from '../lib/dbLib';


interface AuthContextType {
    currentUser: firebase.User | null,
    logInWithEmail: (email: string, password: string) => Promise<firebase.auth.UserCredential>
    logout: () => any
    signup: (email: string, password: string) => Promise<firebase.auth.UserCredential>
    signInWithGoogleAsync: () => Promise<string | { cancelled: boolean; error?: undefined; } | { error: boolean; cancelled?: undefined; }>
    getGoogleCredential: () => Promise<firebase.auth.OAuthCredential> | null
    deleteUserAfterReAuth: () => Promise<{ complete: boolean }>
}


const AuthContext = createContext<AuthContextType>({} as AuthContextType)

/**
 * Return functions about Authentication
 * 
 * 
 * @returns `currentUser`: An user Object.
 * @returns `logInWithEmail`: Async function to log in using email and password.
 * @returns `logout`: Async function to log out.
 * @returns `signup`: Async function to Create a new user using email and password.
 * @returns `signInWithGoogleAsync`: Async function to sign in with google.
 * @returns `getGoogleCredential`: Async function to first open google sign in page then return user credential. This credential can be used to re-Authenticate.
 * @returns `deleteUserAfterReAuth`: Async function to first re-authenticate the user then delete it. This will delete the user data in the RTDB too.
 * 
 */
export const useAuth = () => useContext(AuthContext)


export const AuthProvider = ({ children }) => {

    // 用戶 object
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);

    // email 登入
    const logInWithEmail = (email: string, pwd: string): Promise<firebase.auth.UserCredential> => (
        auth.signInWithEmailAndPassword(email, pwd)
    )

    // 登出
    const logout = () => auth.signOut()

    // email 註冊
    const signup = (email: string, pwd: string): Promise<firebase.auth.UserCredential> => (
        auth.createUserWithEmailAndPassword(email, pwd)
    )

    // Google 登入 
    async function signInWithGoogleAsync() {
        try {
            const result = await getGoogleLogInResult()

            if (result.type === 'success') {
                onSignIn(result)
                return result.accessToken;
            } else {
                return { cancelled: true };
            }
        } catch (e) {
            return { error: true };
        }
    }

    function onSignIn(googleUser) {

        let credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
        );

        firebase.auth().signInWithCredential(credential)
            .catch((error) => { alert('onSignInCredential' + error) });
    }


    /** 
     * 取得 google 憑證
     */
    const getGoogleCredential = async () => {
        const result = await getGoogleLogInResult()
        if (result.type == 'success') {
            const credential = firebase.auth.GoogleAuthProvider.credential(
                result.idToken,
                result.accessToken
            )
            return credential
        }
        return null
    }

    // 取得google用戶資料
    const getGoogleLogInResult = async () => await Google.logInAsync({
        //在這裡貼上你的用戶端編號
        androidClientId: "351896815743-ccjllu109b2i8e2en3nh35lrjv02b9cs.apps.googleusercontent.com",
        // iosClientId: "YOUR_CLIENT_ID_HERE",
        scopes: ['profile', 'email'],
    })

    // 刪除用戶 (內含re-auth) 
    const deleteUserAfterReAuth = async () => {
        try {
            // 先取得憑證
            let credential
            if (currentUser.providerData[0].providerId === 'google.com') {
                credential = await getGoogleCredential()
            }

            // 用憑證 re-auth
            await currentUser.reauthenticateWithCredential(credential)

            // 刪除帳號
            await currentUser.delete()

            // 刪除該帳號的資料
            const userRef = db.ref(`/users/${currentUser.uid}`)
            await userRef.remove()
            return { complete: true }
        } catch (e) {
            console.log(e.message)
            return { complete: false }
        }
    }

    // 監聽登入狀態
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            if (user) {
                console.log('log in with', user.email)
                userWrite(user, {
                    email: user.email,
                    logInBy: user.providerData[0].providerId,
                    profile_picture: user.photoURL,
                    username: user.displayName,
                    createAt: user.metadata.creationTime,
                    lastLogInAt: user.metadata.lastSignInTime,
                })
                console.log(user)
            } else {
                console.log('Not log in')
            }
        })
        return unsubscribe
    }, [])


    const value: AuthContextType = {
        logInWithEmail,
        logout,
        signup,
        currentUser,
        signInWithGoogleAsync,
        getGoogleCredential,
        deleteUserAfterReAuth
    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}