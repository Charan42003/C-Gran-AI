import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, TextInput } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Voice from "@react-native-voice/voice"

import Features from './features'
import { openaiFetch } from '../api/apenAi'
import LottieView from 'lottie-react-native'



const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {

    const [message, setMessage] = useState([])
    const [response, setResponse] = useState('')
    const [recording, setRecording] = useState(false)
    const [speaking, setSpeaking] = useState(true)

    const clear = () => {
        setMessage([])
    }

    const onSpeechStart = (e: any) => {
        // console.log("hello")
        console.log("onSpeechStart: " + e)
    }
    const onSpeechEnd = (e: any) => {
        // console.log("hello")
        console.log("onSpeechEnd : " + e)
    }
    const onSpeechResults = (e: any) => {
        // const recognizedText = e.value[0]; // Access the recognized text
        console.log('Recognized text:', e)
    }
    useEffect(() => {

        Voice.onSpeechStart = onSpeechStart;
        Voice.onSpeechEnd = onSpeechEnd;
        Voice.onSpeechResults = onSpeechResults;

        return () => {
            Voice.removeAllListeners()
        }
    }, [])



    const respond = () => {
        let newMessages = [...message];
        newMessages.push({ role: 'user', content: response })
        setMessage(newMessages)
        openaiFetch(response, newMessages).then(res => {
            if (res.success) {
                setMessage([...res.data]);
                setResponse('')
            } else {
                setResponse('')
                Alert.alert("Error", res.msg)
            }
        })
    }

    const startRecording = async () => {
        try {
            const a = await Voice.isAvailable()
            console.log("a : " + a)
            await Voice.start('en-US')

        } catch (error) {
            console.log("Errorrr: " + error)
        }
        setRecording(true);
    }

    const stopRecording = async () => {
        try {
            await Voice.stop()
            await Voice.destroy()
            console.log('destroyed')
        } catch (error) {
            console.log(error)
        }
        setRecording(false);
    }

    return (
        <View style={styles.container}>
            <LottieView
                source={require('../../assets/jsonImgs/robo.json')}
                autoPlay
                loop
                style={{ width: '100%', height: '100%', position: 'absolute', top: 0, left: 0, zIndex: 1 }}
            />
            <SafeAreaView style={{ flex: 1, position: 'relative', zIndex: 3 }}>
                {
                    message.length > 0 ? (
                        <View style={styles.assistantWrap}>
                            <Text style={styles.assistant}>
                                Assistant
                            </Text>

                            <View style={styles.chatMain}>
                                <ScrollView
                                    bounces={false}
                                    showsVerticalScrollIndicator={false}
                                    style={{
                                        backgroundColor: 'transparent'
                                    }}
                                >
                                    {
                                        message.map((message, index) => (
                                            <View>
                                                {
                                                    message.role == 'assistant' ? (
                                                        message.content.includes('https') ? (
                                                            //its an ai image
                                                            <View key={index} style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row' }}>
                                                                <View
                                                                    style={styles.assistantMessage}
                                                                >
                                                                    <Image
                                                                        source={{ uri: message.content }}
                                                                        style={styles.image}
                                                                        resizeMode='contain'
                                                                    />
                                                                </View>
                                                            </View>
                                                        ) : (
                                                            // text response
                                                            <View key={index} style={{ display: 'flex', justifyContent: 'flex-start', flexDirection: 'row' }}>
                                                                <View
                                                                    style={styles.assistantMessage}
                                                                >
                                                                    <Text style={{ color: '#fff', fontSize: wp(4.5) }}>
                                                                        {message.content}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        )
                                                    ) : (
                                                        //user input
                                                        <View key={index} style={{ display: 'flex', justifyContent: 'flex-end', flexDirection: 'row' }}>
                                                            <View
                                                                style={styles.userMessage}
                                                            >
                                                                <Text style={{ color: '#000', fontSize: wp(4.5) }}>
                                                                    {message.content}
                                                                </Text>
                                                            </View>
                                                        </View>
                                                    )
                                                }
                                            </View>
                                        ))
                                    }
                                </ScrollView>
                            </View>

                        </View>
                    ) : (
                        <Features />
                    )
                }

                <View style={styles.bottomNav}>
                    {
                        recording ? (
                            <TouchableOpacity onPress={() => stopRecording()}>
                                <Image
                                    source={require('../../assets/images/voiceLoading.gif')}
                                    style={{ width: hp(10), height: hp(10), borderRadius: 50 }}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => startRecording()}>
                                <Image
                                    source={require('../../assets/images/recordingIcon.png')}
                                    style={{ width: hp(10), height: hp(10), borderRadius: 50 }}
                                />
                            </TouchableOpacity>
                        )
                    }
                    {
                        message.length > 0 && (
                            <TouchableOpacity
                                style={{ position: 'absolute', right: wp(10) }}
                                onPress={() => clear()}
                            >
                                <Text style={{ padding: 5, backgroundColor: '#8787ec', fontSize: wp(4.5), borderRadius: 10 }}>Clear</Text>
                            </TouchableOpacity>
                        )
                    }
                    {
                        speaking && (
                            <TouchableOpacity
                                style={{ position: 'absolute', left: wp(10) }}
                                onPress={() => setSpeaking(false)}
                            >
                                <Text style={{ padding: 5, backgroundColor: 'red', fontSize: wp(4.5), borderRadius: 10 }}>Stop</Text>
                            </TouchableOpacity>
                        )
                    }
                </View>

                {/* temp start */}
                <TextInput value={response} placeholder='Search anything' onChangeText={(e) => setResponse(e)} style={{ position: 'absolute', bottom: 40 }} />
                <TouchableOpacity onPress={() => respond()}>
                    <View style={{ backgroundColor: 'red', padding: 10, borderRadius: 50, position: 'absolute', bottom: 40, right: 20, zIndex: 30 }} />
                </TouchableOpacity>
                {/* temp end */}
            </SafeAreaView>

        </View>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff'
    },
    assistantWrap: {
    },
    assistant: {
        color: "#383737",
        fontSize: wp(5),
        fontWeight: 'bold',
        marginLeft: 10,
    },
    chatMain: {
        borderRadius: 25,
        padding: 20,
        margin: 10,
        height: hp(85)
    },
    userMessage: {
        backgroundColor: '#fff',
        borderRadius: 15,
        borderTopRightRadius: 0,
        marginVertical: 8,
        padding: 10,

    },
    assistantMessage: {
        // backgroundColor: '#acaceb',
        backgroundColor: '#c9c7c7',
        borderRadius: 15,
        borderTopLeftRadius: 0,
        marginVertical: 8,
        padding: 10,
    },
    image: {
        borderRadius: 15,
        height: wp(60),
        width: wp(60),
    },
    bottomNav: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "center",
        alignItems: 'center',
        position: 'relative',
        width: wp(100),
    }
})

export default Home