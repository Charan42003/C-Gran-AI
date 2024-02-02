import { View, Text, TouchableOpacity, Image, StyleSheet, Alert } from 'react-native'
import React, { useEffect, useState } from 'react'
import { NavigationProp } from '@react-navigation/native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'


const Welcome = ({ navigation }: { navigation: NavigationProp<any> }) => {

    const [isFocused, setIsFocused] = useState(false);

    useEffect(() => {
        setTimeout(() => {
            navigation.navigate("Home")
        }, 2000);
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

            <View style={styles.wrapper}>
                <Text style={styles.title}>C'Gran Ai</Text>
                <Text style={styles.desc}>The Future is here, powered by AI</Text>
            </View>

            <Image
                source={require("../assets/images/bot.png")}
                style={styles.Img}
            />
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
        bottom: hp(5),
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
        marginTop: hp(13)
    }
})

export default Welcome