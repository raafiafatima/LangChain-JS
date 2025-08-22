import dotenv from "dotenv";
dotenv.config();
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import retriver from "./utils/retriver.js";
import { combineDocs } from "./utils/combineDocs.js";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";


const googleAPIkey = process.env.GOOGLE_API_KEY;
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: googleAPIkey,
});

// for getting standalone question:
const instruction =
  "Given a question, turn it into a standalone question. question : {question} standalone question :";
// minimal instruction for what the llm has to do
const chatPrompt = PromptTemplate.fromTemplate(instruction);
// returns a string that contains the variables filled in, such as the question variable would have the value filled in

// for getting chat response
const answerInst =
  'You are a helpful and enthusiastic support bot who can answer a given question about NED based on the context provided. Try to find the answer in the context. If you really dont know the answer, say "Im sorry, I dont know the answer to that." And direct the questioner to email registrar@neduet.edu.pk. Dont try to make up an answer. Always speak as if you were chatting to a friend context: {context} question: {question} answer:';
const answerPrompt = PromptTemplate.fromTemplate(answerInst); // this could be added at the end of the chain, however it causes an error since we can pass context and prompt using the pipe method - this shows the limitation of the pipe method

// const ChatChain = chatPrompt
//   .pipe(llm)
//   .pipe(new StringOutputParser())
//   .pipe(retriver)
//   .pipe(combineDocs)
//here we need to pass along the string of content from ll. and not the whole object. we can use dot notation, or use an output parser that automatically converts the data into the specified type.
// pipe is a function that connects two objects, taking the output of one and entering it as an input in the second - here it takes the string with input from the prompt and then passes it onto the llm for response

const standloneChain = RunnableSequence.from([
  chatPrompt,
  llm,
  new StringOutputParser(),
]);
const retriverChain = RunnableSequence.from([
  (prevRes) => prevRes.standlone_question,
  retriver,
  combineDocs,
]);
const answerChain = RunnableSequence.from([
  answerPrompt,
  llm,
  new StringOutputParser(),
]);

const chain = RunnableSequence.from([
  {
    standlone_question: standloneChain,
    original_question: new RunnablePassthrough(),
  },
  {
    context: retriverChain,
    question: ({ original_question }) => original_question.question,
  },
  answerChain,
]);

const response = await chain.invoke({
  question:
    "I am a student at Karachi and want to take admission in a good engineering university, i am unable to find the whole admissions process, can you describe it to me step by step",
});
// this gives us the standalone question - a simple question that only contains the thing that the user needs

console.log(response); // returns the final 4 chunks of relevant data needed from the vector store
