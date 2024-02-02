import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image } from 'react-native'
import React, { useEffect, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Voice from '@react-native-community/voice';
// import GifImage from '@lowkey/react-native-gif';

import Features from './features'

const dummyMessages = [
    {
        role: 'user',
        content: "how are you?"
    },
    {
        role: 'assistant',
        content: "I'm fine, How may I help you today."
    },
    {
        role: 'user',
        content: "create an image of a dog playing with cat"
    },
    {
        role: 'assistant',
        content: "https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg"
    },
    {
        role: 'user',
        content: "create an image of a dog playing with cat"
    },
    {
        role: 'assistant',
        content: "https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg"
    },
    {
        role: 'user',
        content: "create an image of a dog playing with cat"
    },
    {
        role: 'assistant',
        content: "https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg"
    },
    {
        role: 'user',
        content: "create an image of a dog playing with cat"
    },
    {
        role: 'assistant',
        content: "https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg"
    },
    {
        role: 'user',
        content: "create an image of a dog playing with cat"
    },
    {
        role: 'assistant',
        content: "https://storage.googleapis.com/pai-images/ae74b3002bfe4b538493ca7aedb6a300.jpeg"
    },
]


const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {

    const [message, setMessage] = useState([dummyMessages])
    const [recording, setRecording] = useState(false)
    const [speaking, setSpeaking] = useState(true)

    const clear = () => {
        setMessage([])
    }

    // const speechStartHandler = (e) => {
    //     console.log("speech start handler")
    // }
    // const speechEndHandler = (e) => {
    //     console.log("speech end handler")
    // }
    // const speechResultsHandler = (e) => {
    //     console.log("voice event: ", e)
    // }
    // const speechErrorHandler = (e) => {
    //     console.log("speech errror: ", e)
    // }

    const startRecording = async () => {
        setRecording(true);
        // try {
        //     await Voice.start('en-US')
        // } catch (error) {
        //     console.error(error)
        // }
    }

    const stopRecording = async () => {
        // try {
        //     await Voice.stop()
        // } catch (error) {
        //     console.error(error)
        // }
        setRecording(false);
    }

    // useEffect(() => {
    //     // console.log(Voice.getSpeechRecognitionServices())
    //     Voice.onSpeechStart = speechStartHandler;
    //     Voice.onSpeechEnd = speechEndHandler;
    //     Voice.onSpeechResults = speechResultsHandler;
    //     Voice.onSpeechError = speechErrorHandler;
    //     return () => {
    //         Voice.destroy().then(Voice.removeAllListeners)
    //     }
    // })

    return (
        <View style={styles.container}>
            <SafeAreaView style={{ flex: 1 }}>
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
                                >
                                    {
                                        dummyMessages.map((message, index) => (
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
                                                                    <Text style={{ color: '#000', fontSize: wp(4.5) }}>
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
                                    source={require('../assets/images/voiceLoading.gif')}
                                    style={{ width: hp(10), height: hp(10), borderRadius: 50 }}
                                />
                            </TouchableOpacity>
                        ) : (
                            <TouchableOpacity onPress={() => startRecording()}>
                                <Image
                                    source={require('../assets/images/recordingIcon.png')}
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
        // flex: 1,
        backgroundColor: '#fff'
    },
    assistant: {
        color: "#383737",
        fontSize: wp(5),
        fontWeight: 'bold',
        marginLeft: 10,
    },
    chatMain: {
        backgroundColor: '#c9c7c7',
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
        backgroundColor: '#acaceb',
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