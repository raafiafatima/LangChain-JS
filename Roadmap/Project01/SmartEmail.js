// smart email generator -> takes topics and generates emails
import { StringOutputParser } from "@langchain/core/output_parsers";
import { PromptTemplate } from "@langchain/core/prompts";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import dotenv from "dotenv";
dotenv.config();

// making the modal
const googleAPIkey = process.env.GOOGLE_API_KEY;
const llm = new ChatGoogleGenerativeAI({
  apiKey: googleAPIkey,
  model: "gemini-2.5-flash",
  temperature: 0.7,
});

const systemTemplate = `You are an AI assistant that generates emails based on the subjectline.
Keep the tone of the email neutral and in-coordance with the email subject. 
Also use the provided context to write in an email where the user doesnot need to add anything
subject : {subject}
context : {context}`;
const systemPrompt = PromptTemplate.fromTemplate(systemTemplate);

const chain = systemPrompt.pipe(llm).pipe(new StringOutputParser());

const resp = await chain.invoke({
  subject: "Sick Leave",
  context : 'name is raafia, leaving on Monday, will be back by Thursday. In the mean time Ayesha will look after my work.'
});

console.log(resp);
