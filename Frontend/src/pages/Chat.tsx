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
  const auth = useAuth(); // Get the user authentication status from AuthContext
  const inputRef = useRef<HTMLInputElement | null>(null);
  const [chatMessages, setChatMessages] = useState<Message[]>([]); // Manage chat messages state

// Fetch user chats when the component is mounted and user is logged in
useEffect(() => {
  const fetchChats = async () => {
    if (auth?.isLoggedIn && auth.user) {
      try {
        toast.loading("Loading Chats", { id: "loadchats" });

        // Make an API call to get user chats
        const data = await getUserChats();

        // Update chat messages state
        setChatMessages([...data.chats]);

        toast.success("Successfully loaded chats", { id: "loadchats" });
      } catch (error) {
        console.error("Failed to load chats:", error);

        // Display error toast message
        toast.error("Loading Failed", { id: "loadchats" });
      }
    }
  };

  fetchChats(); // Call the async function

}, [auth]);


  // Redirect to login page if user is not logged in
  useEffect(() => {
    if (!auth?.user) {
      navigate("/login");
    }
  }, [auth, navigate]);

  // Function to handle chat submission when user presses "Enter" or clicks the submit button
  const handleSubmit = async () => {
    const content = inputRef.current?.value.trim(); // Get the trimmed input value

    // Check if input is valid
    if (!content) {
      toast.error("Message cannot be empty!");
      return;
    }

    // Clear the input field
    if (inputRef && inputRef.current) {
      inputRef.current.value = "";
    }

    // Add the new message to the chat
    const newMessage: Message = { role: "user", content };
    setChatMessages((prev) => [...prev, newMessage]);

    try {
      // Send the user's message to the server
      const chatData = await sendChatRequest(content);

      // Update the chat with the response from the server
      setChatMessages([...chatData.chats]);
    } catch (error) {
      console.log(error);
      toast.error("Failed to send message");
    }
  };

  // Function to handle chat deletion
  const handleDeleteChats = async () => {
    try {
      toast.loading("Deleting Chats", { id: "deletechats" });
      await deleteUserChats(); // Call the delete chat API
      setChatMessages([]); // Clear chat messages
      toast.success("Deleted Chats Successfully", { id: "deletechats" });
    } catch (error) {
      console.log(error);
      toast.error("Deleting chats failed", { id: "deletechats" });
    }
  };

  return (
    <div className="flex flex-1 w-full h-full mt-3 gap-3">
      {/* Sidebar */}
      <div className="hidden md:flex flex-[0.2] flex-col w-full h-[60vh] bg-gray-800 rounded-lg mx-3">
        {/* User's initial */}
        <div className="bg-white text-black font-bold mx-auto my-2 rounded-full h-14 w-14 flex items-center justify-center">
          {/* Display the user's initials */}
          {auth?.user?.name.split(" ")[0][0].toUpperCase()}
          {auth?.user?.name.split(" ")[1][0].toUpperCase()}
        </div>
        <p className="mx-auto font-sans text-white">
          You are talking to a ChatBOT
        </p>
        <p className="mx-auto font-sans text-white my-4 p-3 text-center">
          You can ask some questions related to Knowledge, Business, Advice,
          Education, etc. But avoid sharing personal information.
        </p>
        <button
          onClick={handleDeleteChats}
          className="bg-red-300 hover:bg-red-500 text-white font-bold rounded-lg py-2 px-4 mx-auto mt-auto mb-5"
        >
          Clear Conversation
        </button>
      </div>

      {/* Chat Section */}
      <div className="flex flex-col w-full md:flex-[.8] px-3">
        <h2 className="text-4xl text-white mb-2 mx-auto font-semibold">
          Model - GPT-4o
        </h2>

        {/* Chat messages display */}
        <div className="w-full h-[60vh] rounded-lg mx-auto flex flex-col overflow-y-auto">
          {chatMessages.map((chat, index) => (
            <ChatItem content={chat.content} role={chat.role} key={index} />
          ))}
        </div>

        {/* Chat input section */}
        <div className="w-full rounded-lg bg-gray-800 flex items-center">
          <input
            ref={inputRef}
            type="text"
            className="w-full bg-transparent py-4 px-6 border-none outline-none text-white text-lg"
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                handleSubmit(); // Trigger handleSubmit when Enter is pressed
              }
            }}
          />
          <button onClick={handleSubmit} className="text-white mx-2">
            <IoMdSend />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;
