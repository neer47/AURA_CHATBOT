import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { IoMdSend } from "react-icons/io";
import ChatItem from "../components/chat/ChatItem";
import {
  deleteUserChats,
  getUserChats,
  sendChatRequest,
} from "../helpers/api-communicator";
import toast from "react-hot-toast";
import { useNavigate } from "react-router-dom";

type Message = {
  role: "user" | "assistant";
  content: string;
};

const Chat = () => {
  const navigate = useNavigate();
  const auth = useAuth();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const messagesEndRef = useRef<HTMLDivElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]);

  // Fetch chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      if (auth?.isLoggedIn && auth.user) {
        try {
          toast.loading("Loading Chats", { id: "loadchats" });
          const data = await getUserChats();
          setChatMessages([...data.chats]);
          toast.success("Chats loaded successfully", { id: "loadchats" });
        } catch (error) {
          console.error("Failed to load chats:", error);
          toast.error("Failed to load chats", { id: "loadchats" });
        }
      }
    };
    fetchChats();
  }, [auth]);

  // Scroll to bottom when chatMessages update
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages]);

  // Redirect to login if not authenticated
  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  // Handle sending chat messages
  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim();
    if (!content) {
      toast.error("Message cannot be empty!");
      return;
    }

    if (inputRef.current) inputRef.current.value = "";
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      const chatData = await sendChatRequest(content);
      setChatMessages([...chatData.chats]);
    } catch (error) {
      console.error(error);
      toast.error("Failed to send message");
    }
  };

  // Handle chat deletion
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting chats...", { id: "deletechats" });
      await deleteUserChats();
      setChatMessages([]);
      toast.success("Chats deleted successfully", { id: "deletechats" });
    } catch (error) {
      console.error(error);
      toast.error("Failed to delete chats", { id: "deletechats" });
    }
  };

  return (
    <div className="flex h-[90vh] bg-gray-900 text-white">
      {/* Sidebar */}
      <aside className="hidden md:flex flex-col w-64 bg-gray-800 p-6 shadow-lg">
        <div className="flex items-center justify-center h-16 rounded-full bg-cyan-500 text-2xl font-semibold mb-4">
          {auth?.user?.name[0].toUpperCase()}
          {auth?.user?.name[1].toUpperCase()}
        </div>
        <p className="text-center text-gray-300 mb-4">
          You are talking to AuraGPT
        </p>
        <p className="text-sm text-gray-400 mb-6 text-center">
          Feel free to ask questions related to knowledge, advice, and education.
        </p>
        <button
          onClick={handleDeleteChats}
          className="mt-auto py-2 px-4 bg-red-500 hover:bg-red-600 rounded-lg text-white"
        >
          Clear Conversation
        </button>
      </aside>

      {/* Chat Section */}
      <main className="flex-1 flex flex-col px-4">
        <h2 className="text-2xl font-bold text-center py-4 border-b border-gray-700">
          Model - GPT-4o
        </h2>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto px-2 py-4">
          {chatMessages.map((chat, index) => (
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
          <div ref={messagesEndRef}></div>
        </div>

        {/* Input Section */}
        <div className="flex items-center bg-gray-800 rounded-lg p-2 shadow-md mb-4">
          <input
            ref={inputRef}
            type="text"
            placeholder="Type your message..."
            className="flex-1 bg-transparent text-white placeholder-gray-400 px-4 py-2 outline-none"
            onKeyDown={(e) => e.key === "Enter" && handleSubmit()}
          />
          <button
            onClick={handleSubmit}
            className="p-2 bg-cyan-600 hover:bg-cyan-700 rounded-lg"
          >
            <IoMdSend size={24} />
          </button>
        </div>
      </main>
    </div>
  );
};

export default Chat;
