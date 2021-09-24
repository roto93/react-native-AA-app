import React from 'react'
import { DataSnapShot, HomePageProp, RootStackParamList } from '../../types/types'
import { useNavigation } from '@react-navigation/core'

type IOneWayNavigate = (name: keyof RootStackParamList) => void


const useNavigate = () => {

    const navigation = useNavigation<HomePageProp>()

    // 無法返回的換頁
    const oneWayNavigate: IOneWayNavigate = (name) => {
        navigation.reset({
            index: 0,
            routes: [{ name: name }]
        })
    }

    // 可返回的換頁
    const navigate = (name: keyof RootStackParamList) => navigation.navigate(name)


    return { oneWayNavigate, navigate }
}

export default useNavigate
