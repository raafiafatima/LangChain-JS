import dotenv from "dotenv";
dotenv.config();
import {ChatGoogleGenerativeAI} from '@langchain/google-genai'
import { PromptTemplate } from "@langchain/core/prompts";


// document.addEventListener('submit', (e) => {
//     e.preventDefault()
//     progressConversation()
// })

const googleAPIkey = process.env.GOOGLR_API_KEY
const llm = new ChatGoogleGenerativeAI({
     model: "gemini-2.0-flash",
    apiKey : googleAPIkey
})

// adding a retriver, that gets the closet match according to the semantic value of the question 

// create embeddings and 

const instruction = 'Given a question, turn it into a standalone question. question : {question} standalone question :' 
// minimal instruction for what the llm has to do 
const chatPrompt = PromptTemplate.fromTemplate(instruction)
// returns a string that contains the variables filled in, such as the question variable would have the value filled in 
const ChatChain = chatPrompt.pipe(llm)
// pipe is a function that connects two objects, taking the output of one and entering it as an input in the second - here it takes the string with input from the prompt and then passes it onto the llm for response 
const response = await ChatChain.invoke({
    question : 'I am a student at Karachi and want to take admission in a good engineering university, i am unable to find the whole admissions process, can you describe it to me step by step'
})
// this gives us the standalone question - a simple question that only contains the thing that the user needs 



console.log(response) 

function progressConversation() {
    const userInput = document.getElementById('user-input')
    const chatbotConversation = document.getElementById('chatbot-conversation-container')
    const question = userInput.value
    userInput.value = ''

    // add human message
    const newHumanSpeechBubble = document.createElement('div')
    newHumanSpeechBubble.classList.add('speech', 'speech-human')
    chatbotConversation.appendChild(newHumanSpeechBubble)
    newHumanSpeechBubble.textContent = question
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight

    // add AI message
    const newAiSpeechBubble = document.createElement('div')
    newAiSpeechBubble.classList.add('speech', 'speech-ai')
    chatbotConversation.appendChild(newAiSpeechBubble)
    newAiSpeechBubble.textContent = result
    chatbotConversation.scrollTop = chatbotConversation.scrollHeight
}