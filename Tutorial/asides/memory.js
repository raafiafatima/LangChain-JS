import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { BufferMemory, ChatMessageHistory } from "langchain/memory";
import { ConversationChain } from "langchain/chains";
dotenv.config();

// making a modal 
const googleAPIkey = process.env.GOOGLE_API_KEY
const llm = new ChatGoogleGenerativeAI({
    apiKey : googleAPIkey, 
    model : 'gemini-2.0-flash'
})

// creating history and adding messages 
const history = new ChatMessageHistory()
history.addAIMessage('hi')
history.addUserMessage('Get me the captical of france')
// console.log(history.getMessages())

// BufferMemory - a simple wrapper that calls ChatMessageHistory and stores the messages as human or ai 
// this ensures that the chain has full control over the conversation history 

const memory = new BufferMemory({
    chatHistory : history, 
    returnMessages : true 
})

// creating a conversation chain
const chain = new ConversationChain({llm, memory})

// invoking a response
const resp = await chain.call({input : 'Answer my last question'})
console.log(resp.response)