// Wildcard import is not supported here. I don't know why.
// import * as env from '@env'
import { apiKey, authDomain, projectId, databaseURL, storageBucket, messagingSenderId, appId, measurementId } from '@env'

export const firebaseConfig = {
    apiKey: apiKey,
    authDomain: authDomain,
    projectId: projectId,
    databaseURL: databaseURL,
    storageBucket: storageBucket,
    messagingSenderId: messagingSenderId,
    appId: appId,
    measurementId: measurementId,
}