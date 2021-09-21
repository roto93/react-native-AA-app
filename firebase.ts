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

const app = firebase.initializeApp(firebaseConfig)

export default app
export const auth = firebase.auth()