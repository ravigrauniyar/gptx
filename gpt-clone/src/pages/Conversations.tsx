import { Chatbox } from "../components/ChatBox";
import { Sidebar } from "../components/Sidebar";

export const Conversations = () => {
  return (
    <div className="flex">
      <Sidebar />
      <Chatbox />
    </div>
  );
};
