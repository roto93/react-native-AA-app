import { StyleSheet, View, ViewStyle } from "react-native";
import React from "react";

interface IRowView {
    style?: ViewStyle
    children?: any
}

export const RowView = ({ children, style }: IRowView) => (
    <View style={[styles.rowView, style]}>
        {children}
    </View>
)

const styles = StyleSheet.create({
    rowView: {
        flexDirection: 'row',
        justifyContent: 'flex-start',
        alignItems: 'center',
    }
})

