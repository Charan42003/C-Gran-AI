import axios from "axios";
import { API_KEY_OPENAI } from "../constants/keys";

const chatGPTEndpoint = 'https://api.openai.com/v1/chat/completions'
const dalleEndpoint = 'https://api.openai.com/v1/images/generations'


export const openaiFetch = async (prompt: any, messages: []) => {
    const requestData = {
        model: "gpt-3.5-turbo",
        messages: [{
            role: 'user',
            content: `Given the following message, determine if it is related to generating or showing a picture, image, art, or anything similar. Please respond with 'yes' or 'no.'${prompt}`
        }]
    };

    try {
        const response = await fetch(chatGPTEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY_OPENAI}`,
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        const isArt = res.choices[0]?.message?.content;
        if (isArt.toLowerCase().includes('yes')) {
            console.log("dalle api call")
            return dalleApiCall(prompt, messages || [])
        } else {
            console.log("chat gpt api call")
            return chatGptApiCall(prompt, messages || [])
        }

    } catch (error: any) {
        console.error('Error:', error);
        return Promise.resolve({
            success: false,
            msg: error.message
        })
    }
}

const chatGptApiCall = async (prompt: any, messages: any) => {
    const requestData = {
        model: "gpt-3.5-turbo",
        messages
    };

    try {
        const response = await fetch(chatGPTEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY_OPENAI}`,
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        let answer = res.choices[0]?.message?.content;
        messages.push({ role: 'assistant', content: answer.trim() })
        return Promise.resolve({ success: true, data: messages })
    } catch (error: any) {
        console.error('Error:', error);
        return Promise.resolve({
            success: false,
            msg: error.message
        })
    }
}

const dalleApiCall = async (prompt: any, messages: any) => {
    const requestData = {
        prompt,
        n: 1,
        size: "512x512"
    };

    try {
        const response = await fetch(dalleEndpoint, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${API_KEY_OPENAI}`,
            },
            body: JSON.stringify(requestData),
        });

        if (!response.ok) {
            throw new Error(`HTTP error! Status: ${response.status}`);
        }

        const res = await response.json();
        let url = res.data[0]?.url
        messages.push({ role: 'assistant', content: url })

        return Promise.resolve({
            success: true,
            data: messages
        })

    } catch (error: any) {
        console.error('Error:', error);
        return Promise.resolve({
            success: false,
            msg: error.message
        })
    }
}