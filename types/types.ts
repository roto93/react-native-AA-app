import firebase from 'firebase'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export type RootStackParamList = {
    Home: undefined,
    SignUp: undefined,
    LogIn: undefined,
    Request: undefined,
}

export type HomePageProp = NativeStackNavigationProp<RootStackParamList, 'Home'>
export type LogInPageProp = NativeStackNavigationProp<RootStackParamList, 'LogIn'>
export type SignUpPageProp = NativeStackNavigationProp<RootStackParamList, 'SignUp'>

