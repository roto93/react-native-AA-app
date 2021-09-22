import { NativeStackNavigationProp } from '@react-navigation/native-stack'



export type RootStackParamList = {
    Home: undefined, // undefined because you aren't passing any params to the home screen
    LogIn: undefined,
};



export type IHomePage = {
    navigation: NativeStackNavigationProp<RootStackParamList, 'Home'>;
};