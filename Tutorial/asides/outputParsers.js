import z from "zod";
import dotenv from "dotenv";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { JsonOutputParser, StructuredOutputParser } from "@langchain/core/output_parsers";
import { ChatPromptTemplate } from "@langchain/core/prompts";
import { RunnableSequence } from "@langchain/core/runnables";
dotenv.config();

// -------------METHOD 1-----------

// make model
const googleAPIkey = process.env.GOOGLE_API_KEY;
const llm = new ChatGoogleGenerativeAI({
  model: "gemini-2.0-flash",
  apiKey: googleAPIkey,
});

// write the scheme
const scheme = z.object({
  bad_string: z.string().describe("This is the poorly formatted string"),
  good_string: z.string().describe("This is the correctly formatted string"),
});

// attach scehem to llm to tell him the structure of output 
const structureLLM = llm.withStructuredOutput(scheme)
// invoke a response 
const resp = await structureLLM.invoke('welcome to californiya!')
// console.log(resp)

//---------MTHOD 2---------- using structured output parser 

// keeping the modal same and defining new schema 
const schema2 = z.object({
    answer : z.string().describe('The answer to the question'), 
    source : z.string().describe("The source of the answer, a website")
})

// making the parser to structure the template , getFormatInfo makes the instruction into a string and not object 
const parser = StructuredOutputParser.fromZodSchema(schema2)

const template = `Answer the user question as best as possible 
    {format_instructions} 
    question : {question}`
// prompt that takes in the template as string 
const prompt = ChatPromptTemplate.fromTemplate(template)

const chain = RunnableSequence.from([prompt, llm, parser])

const resp2 = await chain.invoke({
    question: 'What is the culture of Pakistan called?', 
    format_instructions: parser.getFormatInstructions()
})
// console.log(resp2) // formatted output 

//--------METHOD 3---------- using JSON output parser
//json parsr helps s reduce the code, by not having to wrie the scehema

// keeping the modal same, no need to define the schema seperatly 

const jsonParser = new JsonOutputParser()

const jsonTemplate = `return a json object with 2 keys, "answer" that answers the following question {question}, and "german" that tells the german translation of the answer.`
const jsonPrompt = ChatPromptTemplate.fromTemplate(jsonTemplate)

const chain2 = jsonPrompt.pipe(llm).pipe(jsonParser)

const resp3 = await chain2.invoke({
    question: 'What is the capital of France', 
})

console.log(resp3)


