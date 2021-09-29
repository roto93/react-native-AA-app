import firebase from 'firebase'
import { NativeStackNavigationProp } from '@react-navigation/native-stack';


export type RootStackParamList = {
    首頁: undefined,
    登入: undefined,
    你的邀請: undefined,
    更改個人資料: undefined
}

export type HomePageProp = NativeStackNavigationProp<RootStackParamList, '首頁'>
export type LogInPageProp = NativeStackNavigationProp<RootStackParamList, '登入'>

