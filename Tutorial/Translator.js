import dotenv from "dotenv";
import {ChatOpenAI} from '@langchain/openai'
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
dotenv.config();

const api_key = process.env.API_KEY;
// write a modal first 

// const model = new ChatOpenAI({model : 'gpt-4o-mini', temperature : 0.6})


// const messages = [
//   new SystemMessage("Translate the following from English into Italian"),
//   new HumanMessage("hi!"),
// ];

// await model.invoke(messages);

const model = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  temperature: 0
});


const messages = [
  new SystemMessage("Translate the following from English into Italian"),
  new HumanMessage("hi!"),
];

const resp = await model.invoke(messages);
console.log(resp.content)

