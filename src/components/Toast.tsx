import React, { useEffect } from 'react'
import { StyleSheet, Text, View } from 'react-native'
import Modal from 'react-native-modal'

interface IToastProps {
    isVisible: boolean,
    setIsVisible: (bool: boolean) => void
    options: {
        text: string
        duration?: number,
        backgroundOpacity?: number
        coverScreen: boolean
    }
}

const Toast = (props: IToastProps) => {
    const { isVisible, setIsVisible, options } = props
    const { text, duration, backgroundOpacity, coverScreen } = options

    useEffect(() => {
        if (isVisible) {
            setTimeout(() => {
                setIsVisible(false)
            }, duration || 1500);
        }
    }, [isVisible])

    return (
        <Modal
            isVisible={isVisible}
            useNativeDriver
            animationIn="fadeIn"
            animationOut="fadeOut"
            style={{ alignItems: 'center' }}
            hasBackdrop={false}
        >
            <View style={styles.container}>
                <Text style={styles.text}>{text}</Text>
            </View>

        </Modal>
    )
}

export default Toast

const styles = StyleSheet.create({
    container: {
        width: 220,
        minHeight: 64,
        backgroundColor: '#00000080',
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
    },
    text: {
        color: '#fff',
        fontSize: 16,
        fontWeight: 'bold'
    }
})
