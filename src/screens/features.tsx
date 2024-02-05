import { View, Text, StyleSheet } from 'react-native'
import React from 'react'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import LottieView from 'lottie-react-native'

const Features = () => {
    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../assets/jsonImgs/robo.json')}
                autoPlay
                loop
                style={{ width: '100%', height: '100%' }}
            />
            <Text style={styles.title}>Hello!! How can I help you?</Text>
            <Text style={styles.name}>C'Gran <Text style={{ color: '#50e73f' }}>Ai.</Text></Text>
        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: '#fff',
        flex: 1,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },
    title: {
        position: 'absolute',
        color: '#7c7c7c',
        fontWeight: 'bold',
        fontSize: wp(5.4),
        top: hp(75)
    },
    name: {
        color: '#000000',
        position: 'absolute',
        top: hp(5),
        fontWeight: 'bold',
        fontSize: wp(12),
    }
})

export default Features