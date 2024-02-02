import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'

const Features = () => {
    return (
        <View style={styles.container}>
            <Text style={{ fontSize: wp(20) }}>Features</Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'black',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Features