import React from 'react'
import { StyleSheet, Text, TextInput, View, TextStyle, ViewStyle, } from 'react-native'

interface IAAInputBox {
    style?: ViewStyle,
    label?: string,
    labelStyle?: TextStyle,
    textInputStyle?: TextStyle,
    value?: string,
    onChangeText?: (text?: string) => void
}

const AAInputBox = (props: IAAInputBox) => {
    const { label, labelStyle, textInputStyle, value, onChangeText, style } = props
    return (
        <View style={[styles.container, style]}>
            <Text style={[styles.label, labelStyle]}>{label}</Text>
            <TextInput
                style={[styles.tinput, textInputStyle]}
                value={value}
                onChangeText={onChangeText}
            />
        </View>
    )
}

export default AAInputBox

const styles = StyleSheet.create({
    container: {
        width: "100%",
    },
    label: {
        fontSize: 18,
        marginBottom: 8,
    },
    tinput: {
        width: "100%",
        height: 48,
        paddingHorizontal: 12,
        borderWidth: 1,
        textAlignVertical: 'center',
        fontSize: 18
    },
})
