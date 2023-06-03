import { Text, StyleSheet, Pressable } from 'react-native';
import React from 'react';

const CustomButton = ({ btnLabel, onPress }) => {
    return (
        <Pressable style={styles.container} onPress={onPress}>
            <Text style={styles.text}>{btnLabel}</Text>
        </Pressable>
    );
};

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#3B71F3',
        width: '100%',
        padding: 15,
        marginVertical: 5,
        alignItems: 'center',
        borderRadius: 5
    },
    text: {
        fontWeight: 'bold',
        color: 'white'
    }
});

export default CustomButton;
