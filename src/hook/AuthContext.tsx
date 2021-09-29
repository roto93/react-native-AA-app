import React, { useState, useEffect, createContext, useContext } from 'react'
import firebase from 'firebase'
import { auth, db } from '../../firebase'
import * as Google from 'expo-google-app-auth';
import * as Facebook from 'expo-facebook'
import { userUpdate } from '../lib/dbLib';
import { googleLoginAndroidClientId, facebookLoginAppId } from '@env'

interface AuthContextType {
    currentUser: firebase.User | null,
    logout: () => any
    signInWithGoogleAsync: () => Promise<any>
    getGoogleCredential: () => Promise<firebase.auth.OAuthCredential> | null
    signInWithFacebookAsync: () => Promise<any>
    getFacebookCredential: () => Promise<firebase.auth.OAuthCredential> | null
}


const AuthContext = createContext<AuthContextType>({} as AuthContextType)

/**
 * Return functions about Authentication
 * 
 * 
 * @returns `currentUser`: An user Object.
 * @returns `logInWithEmail`: Async function to log in using email and password.
 * @returns `logout`: Async function to log out.
 * @returns `emailSignup`: Async function to Create a new user using email and password.
 * @returns `signInWithGoogleAsync`: Async function to sign in by google.
 * @returns `getGoogleCredential`: Async function to first open google sign in page then return user credential. This credential can be used to re-Authenticate.
 * @returns `signInWithFacebookAsync`: Async function to sign in by facebook.
 * @returns `getFacebookCredential` Async function to first open facebook sign in page then return user credential> This credential can be used to re-Authenticate.
 * @returns `deleteUserAfterReAuth`: Async function to first re-authenticate the user then delete it. This will delete the user data in the RTDB too.
 * 
 */
export const useAuth = () => useContext(AuthContext)


export const AuthProvider = ({ children }) => {

    // 用戶 object
    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);


    // 登出
    const logout = () => auth.signOut()


    // Google 登入 
    async function signInWithGoogleAsync() {
        const result = await getGoogleLogInResult()
        if (result.type !== 'success') {
            throw Error("signInWithGoogleAsync failed")
        }
        await signInFirebaseByGoogle(result)

    }


    // 用 Google 用戶資料登入firebase
    const signInFirebaseByGoogle = async (googleUser) => {
        let credential = firebase.auth.GoogleAuthProvider.credential(
            googleUser.idToken,
            googleUser.accessToken
        );
        return await firebase.auth().signInWithCredential(credential)
    }



    // 取得 google 憑證 
    const getGoogleCredential = async () => {
        const result = await getGoogleLogInResult()
        if (result.type == 'success') {
            const credential = firebase.auth.GoogleAuthProvider.credential(
                result.idToken,
                result.accessToken
            )
            return credential
        }
        throw Error("getGoogleCredential failed")
    }


    // 取得google用戶資料
    const getGoogleLogInResult = async () => await Google.logInAsync({
        //在這裡貼上你的用戶端編號
        androidClientId: googleLoginAndroidClientId,
        // iosClientId: "YOUR_CLIENT_ID_HERE",
        scopes: ['profile', 'email'],
    })


    // 啟用 facebook 功能
    const initialezeFacebook = () => Facebook.initializeAsync({
        appId: facebookLoginAppId,      // 換成你的AppId
    });


    // facebook登入
    async function signInWithFacebookAsync() {
        await initialezeFacebook()

        // {type,token,expirationDate,permissions,declinedPermissions,}
        const result = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile', 'email'],   // 還有其他 permission
        });
        if (result.type === 'success') {
            // 利用 FB 提供的圖形API fetch 用戶名
            // const response = await fetch(`https://graph.facebook.com/me?access_token=${result.token}`);
            await signInFirebaseByFacebook(result.token)
        } throw new Error("signInFirebaseByFacebook failed");
    }


    // 用 facebook 用戶資料登入 firebase
    const signInFirebaseByFacebook = async (token: string) => {
        const credential = firebase.auth.FacebookAuthProvider.credential(token)
        const res = await auth.signInWithCredential(credential)
        return res
    }


    // 取得 Facebook 憑證 
    const getFacebookCredential = async () => {

        await initialezeFacebook()

        const result = await getFacebookLogInResult()

        if (result.type === 'cancel') return null

        const credential = firebase.auth.FacebookAuthProvider.credential(
            result.token
        )
        return credential
    }

    // 取得Facebook用戶資料
    const getFacebookLogInResult = async () => {
        const facebookResult = await Facebook.logInWithReadPermissionsAsync({
            permissions: ['public_profile', 'email'],   // 還有其他 permission
        })
        return facebookResult
    }



    // 監聽登入狀態
    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user)
            if (!user) return console.log("Not log in")

            console.log('log in with', user.email)
            await userUpdate(user.uid, {
                uid: user.uid,
                email: user.providerData[0].email,
                log_in_by: user.providerData[0].providerId,
                profile_picture: user.photoURL,
                username: user.displayName.toString(),
                create_at: user.metadata.creationTime,
                last_log_in_at: user.metadata.lastSignInTime,
            })
        })
        return unsubscribe
    }, [])


    const value: AuthContextType = {
        logout,
        currentUser,
        signInWithGoogleAsync,
        getGoogleCredential,
        signInWithFacebookAsync,
        getFacebookCredential
    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}














// 刪除用戶 (內含re-auth) 
// const deleteUserAfterReAuth = async () => {
//     // 先取得憑證
//     let credential

//     switch (currentUser.providerData[0].providerId) {
//         case 'google.com':
//             credential = await getGoogleCredential()
//             break
//         case 'facebook.com':
//             credential = await getFacebookCredential()
//             break
//         default:
//             return null
//     }

//     // 用憑證 re-auth
//     await currentUser.reauthenticateWithCredential(credential)

//     // 刪除該帳號的資料
//     await deleteUserProfile(currentUser.uid)

//     // 刪除帳號
//     await currentUser.delete()

// }