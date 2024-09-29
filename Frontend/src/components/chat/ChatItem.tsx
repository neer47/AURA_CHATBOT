import toast from "react-hot-toast";
import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

// Clean up unwanted characters like `----` and `**`
function cleanUpMessage(message: string) {
  return message.replace(/\*\*/g, "").trim();
}

// Extract code blocks and text from the message
function extractCodeFromString(message: string) {
  const cleanedMessage = cleanUpMessage(message); // Clean the message first
  const blocks = [];
  const regex = /```(.*?)```/gs; // Regex to find code blocks between ```
  let lastIndex = 0;
  let match;

  while ((match = regex.exec(cleanedMessage)) !== null) {
    const codeStartIndex = match.index;
    const codeEndIndex = regex.lastIndex;

    // Push text before the code block
    if (codeStartIndex > lastIndex) {
      blocks.push({ type: "text", content: cleanedMessage.slice(lastIndex, codeStartIndex).trim() });
    }

    // Push the code block content
    blocks.push({ type: "code", content: match[1].trim() });

    lastIndex = codeEndIndex;
  }

  // Push remaining text after the last code block
  if (lastIndex < cleanedMessage.length) {
    blocks.push({ type: "text", content: cleanedMessage.slice(lastIndex).trim() });
  }

  return blocks;
}

// Function to copy code to clipboard
const copyToClipboard = (text: string) => {
  navigator.clipboard.writeText(text).then(() => {
    toast.success("Code copied to clipboard!");
  }).catch(err => {
    toast.error("Failed to copy: ", err);
  });
};

const speakText = (text: string) => {
  if ("speechSynthesis" in window) {
    const speech = new SpeechSynthesisUtterance(text);
    speech.pitch = 1;
    speech.rate = 1;
    speech.volume = 1;
    speech.lang = "en-US";
    window.speechSynthesis.speak(speech);
  } else {
    console.warn("Your browser does not support text-to-speech.");
  }
};

const ChatItem = ({
  content,
  role,
}: {
  content: string;
  role: "user" | "assistant";
}) => {
  const messageBlocks = extractCodeFromString(content);
  const auth = useAuth();

  return role === "assistant" ? (
    <div className="flex p-4 bg-[#004d5612] gap-4 rounded-md my-2">
      <div className="ml-0">
        <img src="openai.png" alt="openai" className="w-8 h-8" />
      </div>
      <div>
        {messageBlocks.length > 0
          ? messageBlocks.map((block, index) =>
              block.type === "code" ? (
                <div key={index} className="relative">
                  <button
                    onClick={() => copyToClipboard(block.content)}
                    className="absolute top-0 right-0 m-2 p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                  <SyntaxHighlighter
                    style={coldarkDark}
                    language="javascript" // You can dynamically set the language here
                  >
                    {block.content}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <p key={index} className="text-lg text-white whitespace-pre-wrap">
                  {block.content}
                </p>
              )
            )
          : null}
      </div>
      <button onClick={() => speakText(content)}>
        🔊
      </button>
    </div>
  ) : (
    <div className="flex p-4 bg-[#004d56] gap-4 rounded-md my-2">
      <div className="ml-0 bg-black text-white flex items-center justify-center w-8 h-8 rounded-full">
        {auth?.user?.name[0].toUpperCase()}
        {auth?.user?.name.split(" ")[1][0].toUpperCase()}
      </div>
      <div>
        {messageBlocks.length > 0
          ? messageBlocks.map((block, index) =>
              block.type === "code" ? (
                <div key={index} className="relative">
                  <button
                    onClick={() => copyToClipboard(block.content)}
                    className="absolute top-0 right-0 m-2 p-1 bg-gray-700 text-white rounded hover:bg-gray-600"
                  >
                    Copy
                  </button>
                  <SyntaxHighlighter
                    style={coldarkDark}
                    language="javascript" // You can dynamically set the language here
                  >
                    {block.content}
                  </SyntaxHighlighter>
                </div>
              ) : (
                <p key={index} className="text-lg text-white whitespace-pre-wrap">
                  {block.content}
                </p>
              )
            )
          : null}
      </div>
    </div>
  );
};

export default ChatItem;
