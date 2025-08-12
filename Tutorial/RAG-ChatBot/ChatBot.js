import { RecursiveCharacterTextSplitter } from "langchain/text_splitter";
import fs from 'fs/promises'

async function splitText(params) {
    try {
        // read file and get text 
        const text = await fs.readFile('F:/VolumeD/raafia fatima/Javascript/LangChain-JS/Tutorial/RAG-ChatBot/input.txt', 'utf-8')
        const splitter = new RecursiveCharacterTextSplitter({
             chunkSize : 500 , 
            separators : ['\n\n', '\n', ' ', ''], 
            chunkOverlap : 50
        })

        const output = await splitter.createDocuments([text])
        console.log(output)

    } catch (error) {
        console.log('Spitting Text :: Error :: ', error)
    }
}

splitText()