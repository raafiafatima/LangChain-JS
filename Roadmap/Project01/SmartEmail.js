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

const systemTemplate = `You are an AI assistant that generates professional emails.

Subject: {subject}
Recipient: {recipient}
Sender: {sender}
Tone: {tone}
Context : {context}

Write a polite, natural-sounding email in accordance with these details.
Return only the subject and body, no explanations.`;
const systemPrompt = PromptTemplate.fromTemplate(systemTemplate);

const chain = systemPrompt.pipe(llm).pipe(new StringOutputParser());

const resp = await chain.invoke({
  subject: "Unable to meet company expetations",
  context : 'pushed .env file over gihub, did not use any secure coding practices and also blasted our repo', 
  tone : 'angry', 
  recipient : 'Mr Ahmed Ali', 
  sender: 'Raafia'
});

console.log(resp);
