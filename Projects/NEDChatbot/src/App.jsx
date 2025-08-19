import { ChatHeader } from "./components/ChatHeader";
import retriver from "./utils/Retriever/retriever";
import { combineDocs } from "./utils/CombineDocs/combineDocs";

function App() {
  
  return (
    <>
    <div className="flex flex-col h-screen bg-[#f5f0e8]">

          <ChatHeader />
    </div>
    <div className="flex-1 overflow-y-auto p-4 space-y-4">
      {/* chat message */}
    </div>
{/* chat input */}
    </>
  );
}

export default App;
