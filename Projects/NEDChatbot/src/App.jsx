import { ChatHeader } from "./components/ChatHeader";
import retriver from "./utils/Retriever/retriever";
import { combineDocs } from "./utils/CombineDocs/combineDocs";
import { useState } from "react";
import { ChatGoogleGenerativeAI } from "@langchain/google-genai";
import { PromptTemplate } from "@langchain/core/prompts";
import { StringOutputParser } from "@langchain/core/output_parsers";
import {
  RunnablePassthrough,
  RunnableSequence,
} from "@langchain/core/runnables";
import { ChatInput } from "./components/ChatInput";
import { ChatMessage } from "./components/ChatMessage";


function App() {
  const [loading, setLoading] = useState(false)
  const [messages, setMessages] = useState([
    {
      question: "How can I help you?",
      isUser: false,
    },
  ]);
  const [value, setValue] = useState("");

  // calling LLM
  const googleApiKey = import.meta.env.VITE_GOOGLE_API_KEY;
  const llm = new ChatGoogleGenerativeAI({
    model: "gemini-2.0-flash",
    apiKey: googleApiKey,
  });

  // making standalone question
  const standaloneQuesTemplate = `Given a question, turn it into a standalone question. question : {question} standalone_question :`;
  const standalonePrompt = PromptTemplate.fromTemplate(standaloneQuesTemplate);

  //formatting response
  const answerTemplate = `You are a helpful support bot who can answer a given question about NED based on the context provided. Try to find the answer in the context. If you really dont know the answer, say "Im sorry, I dont know the answer to that." And direct the questioner to email registrar@neduet.edu.pk. Dont try to make up an answer. Always speak in a friendly tone but keep it professional as well. context: {context} question: {question} answer:`;
  const answerPrompt = PromptTemplate.fromTemplate(answerTemplate);

  // making indiviual chains for each step
  const standaloneChain = standalonePrompt
    .pipe(llm)
    .pipe(new StringOutputParser()); // made via pipe method
  const retrieverChain = RunnableSequence.from([
    (prevRes) => prevRes.standalone_question,
    retriver,
    combineDocs,
  ]);
  const answerChain = RunnableSequence.from([
    answerPrompt,
    llm,
    new StringOutputParser(),
  ]);

  // chaining the responses together via Runnable Sequence
  const chain = RunnableSequence.from([
    {
      standalone_question: standaloneChain,
      original_question: new RunnablePassthrough(),
    },
    {
      context: retrieverChain,
      question: ({ original_question }) => original_question,
    },
    answerChain,
  ]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!value.trim()) return;
    const newMsg = {
      question: value,
      isUser: true,
    };
    setMessages([...messages, newMsg]);
    setValue("");
    setLoading(true)

    const response = await chain.invoke({
      question: value
    });
    setMessages((prev) => [...prev, {question : response, isUser : false}]);
    if(response) setLoading(false)
  };

  return (
    <>
      <div className="flex flex-col h-screen bg-[#f5f0e8]">
        <ChatHeader />
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          
          {messages.map((msg) => (
            <ChatMessage message={msg} />
          ))}
          {loading && (
  <div className="flex items-center space-x-2 px-4 py-2 bg-[#f5f0e8] rounded-2xl">
    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce"></span>
    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.2s]"></span>
    <span className="w-2 h-2 bg-gray-500 rounded-full animate-bounce [animation-delay:-0.4s]"></span>
  </div>
)}
        </div>
        <ChatInput
          value={value}
          onChange={(e) => setValue(e.target.value)}
          onSubmit={handleSubmit}
        />
        
      </div>
    </>
  );
}

export default App;
