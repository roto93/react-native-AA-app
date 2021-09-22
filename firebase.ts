import firebase from 'firebase'
import { apiKey, authDomain, projectId, storageBucket, messagingSenderId, appId, measurementId } from '@env'

const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId,
}

if (firebase.apps.length === 0) firebase.initializeApp(firebaseConfig)
else firebase.app()

export const auth = firebase.auth()