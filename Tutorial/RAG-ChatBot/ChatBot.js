import dotenv from "dotenv";
dotenv.config();
import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import { createClient } from "@supabase/supabase-js";
import { SupabaseVectorStore } from "@langchain/community/vectorstores/supabase";
import { GoogleGenerativeAIEmbeddings } from "@langchain/google-genai";
import fs from "fs/promises";

async function splitText() {
  try {
    // read file and get text
    const text = await fs.readFile(
      "F:/VolumeD/raafia fatima/Javascript/LangChain-JS/Tutorial/RAG-ChatBot/input.txt",
      "utf-8"
    );
    // split text into chunks
    const splitter = new RecursiveCharacterTextSplitter({
      chunkSize: 500,
      separators: ["\n\n", "\n", " ", ""],
      chunkOverlap: 50,
    });

    const output = await splitter.createDocuments([text]);
    // console.log(output)

    // add a supabase client for exporting data
    const url = process.env.SUPABASE_URL;
    const key = process.env.SUPABASE_API_KEY;

    const client = createClient(url, key);
    // embeddings modal
    const googleAPIKey = process.env.GOOGLE_API_KEY;
    // made the embeddings
    const embeddings = new GoogleGenerativeAIEmbeddings({
      apiKey: googleAPIKey,
      model: "gemini-embedding-001",
    });
    // calling vector store and passing the data
    await SupabaseVectorStore.fromDocuments(output, embeddings, {
      client,
      tableName: "documents",
    });
    console.log("Data embedded and stored successfully!");
  } catch (error) {
    console.log("Spitting Text :: Error :: ", error);
  }
}



splitText();
