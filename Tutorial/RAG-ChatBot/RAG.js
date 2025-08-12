import { CharacterTextSplitter } from "langchain/text_splitter";
import fs from 'fs/promises'

try {
    // const result = await fetch('')
    const text = await fs.readFile('F:/VolumeD/raafia fatima/Javascript/LangChain-JS/Tutorial/RAG-ChatBot/input.txt', 'utf-8');
    const splitter = new CharacterTextSplitter(
        {
            chunkSize : 500, 
            separator : ['\n\n', '\n', ' ', ''], 
            chunkOverlap: 50
        }
    )

    const output = await splitter.createDocuments([text]) // can pass multiple texts taken from different docs 
    console.log(output)
    
} catch (error) {
    console.log('Error : ' , error)
}