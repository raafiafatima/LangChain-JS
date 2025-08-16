## What is happening in RAG Applications 

1. We read the text from a file, could be stored in your local storage, or might get data from pdfs, notion notes and many other places, haven't explored those options quite yet 
2. After reading it from the file, we split the text into digestable hunks for the LLM you will be using. Use can use RecursiveTextSplitter or a SimpleTextSplitter, however RTS is preferred due to its fastness. 
3. After that you make a vector store that will store your vector embeddings, here we have used a Supabase Vector store, with the extension pgvector 
4. After making the store, we create embeddings, mostly use OpenAI, but cause i am broke, i will be using Google Generative Al. 
5. After creating the embeddings, we create a supabase client and then add the embeddings into the supabase vector database. 
6. some common errors that were faced - making sure the dimensions for the vector resonate with the modal

7. we now start the process of making a standalone question using the users input and then finding appropriate chunks for it in the vector store. the only purpose for the standalone question is to get relevant chunks, the original input is passed onto the LLM 
8. the standalone question si made using a PromptTemplate that gives instructions to the llms on what output they need to produce 
9. 