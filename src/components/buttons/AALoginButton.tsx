import React from 'react'
import { StyleSheet, Text, TextStyle, TouchableOpacity, TouchableOpacityProps, View, ViewStyle } from 'react-native'

interface LoginButtonProps {
    style?: ViewStyle;
    textStyle?: TextStyle;
    text?: string;
    onPress?(): void;
    children?: React.ReactNode
}

const AALoginButton = ({ style, textStyle, text, onPress, children }: LoginButtonProps) => {

    return (
        <TouchableOpacity style={[styles.loginButton, style]} onPress={onPress} >
            {text && <Text style={[styles.text, textStyle]}>{text}</Text>}
            {children}
        </TouchableOpacity>
    )
}

export default AALoginButton

const styles = StyleSheet.create({
    loginButton: {
        width: 194,
        height: 48,
        borderWidth: 1,
        borderRadius: 4,
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 20
    },
    text: {
        fontSize: 16
    }
})
