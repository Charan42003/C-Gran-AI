import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationProp } from '@react-navigation/native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import LottieView from "lottie-react-native"


const Welcome = ({ navigation }: { navigation: NavigationProp<any> }) => {

    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate("Home")
        }, 4000);
    }, [isFocused])

    useEffect(() => {
        const unsubscribe = navigation.addListener('focus', () => setIsFocused(true));
        const unsubscribeBlur = navigation.addListener('blur', () => setIsFocused(false));

        return () => {
            unsubscribe();
            unsubscribeBlur();
        };
    }, []);

    return (
        <View style={styles.container}>

            <LottieView
                source={require("../../assets/jsonImgs/robo.json")}
                style={styles.Img}
                autoPlay
                loop
            />
            <View style={styles.wrapper}>
                <Text style={styles.title}>C'Gran <Text style={{ color: '#50e73f' }}>Ai.</Text></Text>
                <Text style={styles.desc}>Made with ❤️ by Charan</Text>
            </View>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        backgroundColor: 'white',
        flex: 1,
        alignItems: 'center'
    },
    Img: {
        position: 'absolute',
        top: hp(-8),
        height: hp(100),
        width: wp(100)
    },
    title: {
        color: '#333232',
        fontSize: wp(20),
        textAlign: 'center',
        fontWeight: 'bold',

    },
    desc: {
        color: '#333232',
        textAlign: 'center',
        fontSize: wp(4.4)
    },
    wrapper: {
        // marginTop: hp(13)
        position: 'absolute',
        bottom: hp(10)
    }
})

export default Welcome