import { View, Text, TouchableOpacity, StyleSheet, ScrollView, Image, Alert, TextInput, KeyboardAvoidingView, Platform } from 'react-native'
import React, { useEffect, useRef, useState } from 'react'
import { SafeAreaView } from 'react-native-safe-area-context'
import { NavigationProp, useNavigation } from '@react-navigation/native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from 'react-native-responsive-screen'
import Voice from "@react-native-voice/voice"
import Features from './features'
import { openaiFetch } from '../api/apenAi'
import LottieView from 'lottie-react-native'
import Icon from 'react-native-vector-icons/FontAwesome'
import { colors } from '../constants/colors'



const Home = ({ navigation }: { navigation: NavigationProp<any> }) => {

    const [message, setMessage] = useState<{}[]>([])
    const [response, setResponse] = useState<string>('')
    const [recording, setRecording] = useState<boolean>(false)
    const [speaking, setSpeaking] = useState<boolean>(true)
    const scrollViewRef = useRef<ScrollView>(null);

    // Function to scroll to the bottom of the ScrollView
    const scrollToBottom = () => {
        scrollViewRef.current && scrollViewRef.current.scrollToEnd({ animated: true });
    };

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
        const newResponse = response;
        setResponse('')

        let newMessages: {}[] = [...message];
        newMessages.push({ role: 'user', content: newResponse })
        setMessage(newMessages)
        openaiFetch(newResponse, newMessages).then((res: { success: boolean; data?: any; msg?: any }) => {
            if (res.success) {
                setMessage([...res.data]);
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
        // <View style={styles.container}>
        <KeyboardAvoidingView style={styles.container} behavior={Platform.OS === "ios" ? "padding" : "height"}>
            <LottieView
                source={require('../../assets/jsonImgs/robo.json')}
                autoPlay
                loop
                style={styles.chatBackgroundImage}
            />
            <SafeAreaView style={styles.chatWrapper}>
                {
                    message.length > 0 ? (
                        <View style={styles.assistantWrap}>
                            <View style={styles.ProfileBtnWrap}>
                                <LottieView
                                    source={require('../../assets/jsonImgs/robo.json')}
                                    autoPlay
                                    loop
                                    style={styles.profileBtn}
                                />
                            </View>
                            <Text style={styles.name}>C'Gran <Text style={{ color: colors.primary, backgroundColor: colors.white, }}>Ai. </Text></Text>
                            <View style={styles.chatMain}>
                                <ScrollView
                                    bounces={false}
                                    showsVerticalScrollIndicator={false}
                                    style={{
                                        backgroundColor: colors.white,
                                    }}
                                    ref={scrollViewRef}
                                    onContentSizeChange={scrollToBottom}
                                >
                                    {
                                        message.map((message: { role?: string; content?: string | any }, index) => (
                                            <View>
                                                {
                                                    message.role == 'assistant' ? (
                                                        message.content.includes('https') ? (
                                                            //its an ai image
                                                            <View key={index} style={styles.assistantAlign}>
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
                                                            <View key={index} style={styles.assistantAlign}>
                                                                <View
                                                                    style={styles.assistantMessage}
                                                                >
                                                                    <Text style={styles.assistantText}>
                                                                        {message.content}
                                                                    </Text>
                                                                </View>
                                                            </View>
                                                        )
                                                    ) : (
                                                        //user input
                                                        <View key={index} style={styles.userAlign}>
                                                            <View
                                                                style={styles.userMessage}
                                                            >
                                                                <Text style={styles.userText}>
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
                    <View style={styles.record}>
                        <TouchableOpacity onPressIn={() => startRecording()} onPressOut={() => stopRecording()}>
                            <Icon name={recording ? "microphone-slash" : "microphone"} size={30} color={recording ? colors.red : colors.grey} />
                        </TouchableOpacity>
                    </View>
                    {
                        // Decide if it's needed
                        // message.length > 0 && (
                        //     <TouchableOpacity
                        //         style={{ position: 'absolute', right: wp(10) }}
                        //         onPress={() => clear()}
                        //     >
                        //         <Text style={{ padding: 5, backgroundColor: '#8787ec', fontSize: wp(4.5), borderRadius: 10 }}>Clear</Text>
                        //     </TouchableOpacity>
                        // )
                    }
                    {/* Bring it the topbar {
                        speaking && (
                            <TouchableOpacity
                                style={{ position: 'absolute', left: wp(10) }}
                                onPress={() => setSpeaking(false)}
                            >
                                <Text style={{ padding: 5, backgroundColor: 'red', fontSize: wp(4.5), borderRadius: 10 }}>Stop</Text>
                            </TouchableOpacity>
                        )
                    } */}
                    <TextInput
                        value={response}
                        placeholder='Search anything'
                        onChangeText={(e) => { return setResponse(e) }}
                        style={styles.inputBox}
                        placeholderTextColor={colors.grey}
                        multiline
                    />
                    <TouchableOpacity style={styles.sendBtn} onPress={() => respond()}>
                        <Icon name="paper-plane" size={wp(6)} color="#fff" />
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </KeyboardAvoidingView>
    )
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#fff',
    },
    chatWrapper: {
        flex: 1,
        position: 'relative',
        zIndex: 3,
        backgroundColor: colors.red,
    },
    chatBackgroundImage: {
        width: '100%',
        height: '100%',
        position: 'absolute',
        top: 0,
        left: 0,
        zIndex: 1,
        opacity: 0.6
    },
    ProfileBtnWrap: {
        borderWidth: 2,
        borderColor: colors.primary,
        borderRadius: 50,
        margin: 7,
        padding: wp(6),
        width: wp(14),
        height: wp(14),
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        position: 'absolute',
        zIndex: 111,
    },
    profileBtn: {
        width: wp(12),
        height: wp(12),
        marginBottom: 10
    },
    name: {
        position: 'absolute',
        top: hp(3),
        right: 50,
        fontSize: 25,
        color: colors.white,
        zIndex: 111,
        backgroundColor: colors.primary,
        paddingLeft: 10,
        paddingRight: 0
    },
    assistantWrap: {
        backgroundColor: colors.primary,
        paddingTop: hp(4)
    },
    chatMain: {
        borderRadius: 40,
        borderBottomLeftRadius: 0,
        borderBottomRightRadius: 0,
        padding: 20,
        paddingTop: 35,
        paddingBottom: 10,
        maxHeight: hp(88),
        width: wp(100),
        backgroundColor: colors.white,
    },
    assistantAlign: {
        display: 'flex',
        justifyContent: 'flex-start',
        flexDirection: 'row'
    },
    userAlign: {
        display: 'flex',
        justifyContent: 'flex-end',
        flexDirection: 'row'
    },
    assistantText: {
        color: '#000',
        fontSize: wp(4.5)
    },
    userText: {
        color: '#fff',
        fontSize: wp(4.5)
    },
    userMessage: {
        backgroundColor: colors.primary,
        borderRadius: 15,
        borderTopRightRadius: 0,
        marginVertical: 8,
        padding: 10,
        maxWidth: wp(80),
    },
    assistantMessage: {
        // backgroundColor: '#acaceb',
        backgroundColor: colors.greyWithOpacity,
        borderRadius: 15,
        borderTopLeftRadius: 0,
        marginVertical: 8,
        padding: 10,
        maxWidth: wp(80),
    },
    image: {
        borderRadius: 15,
        height: wp(60),
        width: wp(60),
    },
    bottomNav: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: "space-around",
        alignItems: 'center',
        position: 'absolute',
        bottom: 0,
        zIndex: 333,
        width: wp(100),
        paddingHorizontal: 10,
        paddingVertical: 10,
        backgroundColor: colors.white,
    },
    record: {

    },
    inputBox: {
        width: wp(100 - 30),
        borderColor: colors.greyWithOpacity,
        borderWidth: 2,
        color: colors.grey,
        paddingLeft: 10,
        fontSize: 20,
        borderRadius: 20,
        maxHeight: hp(15)
    },
    sendBtn: {
        padding: 10,
        paddingRight: 15,
        backgroundColor: colors.primary,
        borderRadius: 50,
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    }
})

export default Home