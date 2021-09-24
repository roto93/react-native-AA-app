import React, { useState, useEffect, createContext, useContext, ReactChildren, ReactNode } from 'react'
import firebase from 'firebase'
import { auth, db } from '../../firebase'
import * as Google from 'expo-google-app-auth';


interface AuthContextType {
    currentUser: firebase.User | null,
    login: (email: string, password: string) => Promise<firebase.auth.UserCredential>
    logout: () => any
    signup: (email: string, password: string) => Promise<firebase.auth.UserCredential>
    signInWithGoogleAsync: () => Promise<string | { cancelled: boolean; error?: undefined; } | { error: boolean; cancelled?: undefined; }>
    getUserCredential: () => Promise<firebase.auth.OAuthCredential> | null
    deleteUser: () => Promise<void>
}

const defaultValue = {} as AuthContextType

const AuthContext = createContext<AuthContextType>(defaultValue)

export const useAuth = () => useContext(AuthContext)

export const AuthProvider = ({ children }: { children: ReactNode }) => {

    const [currentUser, setCurrentUser] = useState<firebase.User | null>(null);
    const userRef = db.ref(`/users/${currentUser.uid}`)

    const login = (email: string, pwd: string): Promise<firebase.auth.UserCredential> => (
        auth.signInWithEmailAndPassword(email, pwd)
    )


    const logout = () => auth.signOut()


    const signup = (email: string, pwd: string): Promise<firebase.auth.UserCredential> => (
        auth.createUserWithEmailAndPassword(email, pwd)
    )



    async function signInWithGoogleAsync() {
        try {
            const result = await Google.logInAsync({
                androidClientId: "351896815743-ccjllu109b2i8e2en3nh35lrjv02b9cs.apps.googleusercontent.com", //在這裡貼上你的用戶端編號, 記得加引號
                // iosClientId: YOUR_CLIENT_ID_HERE,
                scopes: ['profile', 'email'],
            });

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
        var unsubscribe = firebase.auth().onAuthStateChanged((firebaseUser) => {
            unsubscribe();
            // 似乎是listener的常用語法，藉由呼叫函式本身，讓後面的程式只運行一次就好
            if (!isUserEqual(googleUser, firebaseUser)) {
                var credential = firebase.auth.GoogleAuthProvider.credential(
                    googleUser.idToken,
                    googleUser.accessToken
                );

                firebase.auth().signInWithCredential(credential)
                    .catch((error) => { alert('onSignInCredential' + error) });
            } else {
                console.log('User already signed-in Firebase.');
            }
        });
    }
    function isUserEqual(googleUser, firebaseUser) {
        if (firebaseUser) {
            var providerData = firebaseUser.providerData;
            for (var i = 0; i < providerData.length; i++) {
                if (providerData[i].providerId === firebase.auth.GoogleAuthProvider.PROVIDER_ID &&
                    providerData[i].uid === googleUser.user.id) {
                    // We don't need to reauth the Firebase connection.
                    return true;
                }
            }
        }
        return false;
    }

    const getUserCredential = async () => {
        const result = await Google.logInAsync({
            androidClientId: "351896815743-ccjllu109b2i8e2en3nh35lrjv02b9cs.apps.googleusercontent.com", //在這裡貼上你的用戶端編號, 記得加引號
            // iosClientId: YOUR_CLIENT_ID_HERE,
            scopes: ['profile', 'email'],
        });
        if (result.type == 'success') {
            const credential = firebase.auth.GoogleAuthProvider.credential(
                result.idToken,
                result.accessToken
            )
            return credential
        }
        return null
    }


    const deleteUser = async () => {
        const credential = await getUserCredential()
        await currentUser.reauthenticateWithCredential(credential)
        await currentUser.delete()
        const res = await userRef.remove()
    }


    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged((user) => {
            setCurrentUser(user)
            if (user) {

            } else {

            }
        })
        return unsubscribe
    }, [])


    const value: AuthContextType = {
        login,
        logout,
        signup,
        currentUser,
        signInWithGoogleAsync,
        getUserCredential,
        deleteUser
    }


    return (
        <AuthContext.Provider value={value}>
            {children}
        </AuthContext.Provider>
    )
}