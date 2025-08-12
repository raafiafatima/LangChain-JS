import dotenv from "dotenv";
dotenv.config();
import { HumanMessage, SystemMessage } from "@langchain/core/messages";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { ChatPromptTemplate } from "@langchain/core/prompts";
// if it doesnot work, reinstall dotenv 

const translateText = async (text, language) => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
  });
  const messages = [
    new SystemMessage(`Translate the following from English into ${language}`),
    new HumanMessage(`${text}`),
  ];
  const resp = await model.invoke(messages);
  return resp.content
};

translateText('Hello, i am Ana', 'German')
.then((res) => console.log(res))
.catch((err) => console.log(err))

const translate  = async (textTo, languageTo) => {
  const model = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    temperature: 0,
  });
  const systemTemplate = 'Translate the following from English into {language}'

  const promptTemplate = ChatPromptTemplate.fromMessages([
    ['system' , systemTemplate], 
    ['user', '{text}']
  ])

  const promptValue = await promptTemplate.invoke(
    {
      language : languageTo, 
      text : textTo
    }
  )

  promptValue.toChatMessages()

  const resp = await model.invoke(promptValue)
  console.log(resp.content)
}

translate('Hi, i am Raafia', 'German')

