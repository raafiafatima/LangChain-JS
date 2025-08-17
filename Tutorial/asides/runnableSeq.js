// Runnable Equence: a way to call upon methods and make a chain whislt also giving custom inputs etc
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

const googleApiKey = process.env.GOOGLE_API_KEY;

const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: googleApiKey,
});

const punctuationTemp =
  "Given a sentence, add puntuations where needed. sentence : {sentence}, sentence with puntuation :";
const punctPrompt = PromptTemplate.fromTemplate(punctuationTemp);

const grammerTemp =
  "Given a sentence correct the grammar. sentence: {punctuated_sentence} sentence with correct grammar:";
const grammerPrompt = PromptTemplate.fromTemplate(grammerTemp);

const translationTemp = `Given a sentence, translate that sentence into {language} sentence: {grammatically_correct_sentence} translated sentence:`;
const translationPrompt = PromptTemplate.fromTemplate(translationTemp);

// this is a runnable sequence that takes the different runnables and then merges them together.
//  it can have objects passed in it that can take values and also access previous values, one way is done below
// const chain = RunnableSequence.from([
//     punctPrompt,
//     llm,
//     new StringOutputParser(),
//     {punctuated_sentence : prev => prev},
//     grammerPrompt,
//     llm,
//     new StringOutputParser
// ])

// a better approach is to seperate the grammer, puntuation and translation into different chains
// and then invoke a chain that passes the variables smoothly 

const punctuationChain = RunnableSequence.from([
  punctPrompt,
  llm,
  new StringOutputParser(),
]);
const grammerChain = RunnableSequence.from([
  grammerPrompt,
  llm,
  new StringOutputParser(),
]);
const translationChain = RunnableSequence.from([
  translationPrompt,
  llm,
  new StringOutputParser(),
]);

const chain = RunnableSequence.from([
  {
    punctuated_sentence: punctuationChain,
    original_input: new RunnablePassthrough(),
  },
  {
    grammatically_correct_sentence: grammerChain, 
    language : ({original_input}) => original_input.language
  }, 
  translationChain
]);

const response = await chain.invoke({
  sentence: "i dont likes mondays",
  language : 'german'
});

console.log(response);
