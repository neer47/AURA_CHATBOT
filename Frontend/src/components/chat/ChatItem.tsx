import { useAuth } from "../../context/AuthContext";
import { Prism as SyntaxHighlighter } from "react-syntax-highlighter";
import { coldarkDark } from "react-syntax-highlighter/dist/esm/styles/prism";

function extractCodeFromString(message: String) {
  if (message.includes("```")) {
    const blocks = message.split("```");
    return blocks;
  }
}

function isCodeBlock(str: String) {
  return (
    str.includes("=") ||
    str.includes(";") ||
    str.includes("[") ||
    str.includes("]") ||
    str.includes("{") ||
    str.includes("}") ||
    str.includes("#") ||
    str.includes("//")
  );
}

const ChatItem = ({
  content,
  role,
}: {
  content: String;
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
        {!messageBlocks && <p className="text-lg text-white">{content}</p>}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block, index) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter
                key={index}
                style={coldarkDark}
                language="javascript"
              >
                {block}
              </SyntaxHighlighter>
            ) : (
              <p key={index} className="text-lg text-white">
                {block}
              </p>
            )
          )}
      </div>
    </div>
  ) : (
    <div className="flex p-4 bg-[#004d56] gap-4 rounded-md my-2">
      <div className="ml-0 bg-black text-white flex items-center justify-center w-8 h-8 rounded-full">
      {auth?.user?.name[0].toUpperCase()}
      {auth?.user?.name.split(" ")[1][0].toUpperCase()}
      </div>
      <div>
        {!messageBlocks && <p className="text-lg text-white">{content}</p>}
        {messageBlocks &&
          messageBlocks.length &&
          messageBlocks.map((block, index) =>
            isCodeBlock(block) ? (
              <SyntaxHighlighter
                key={index}
                style={coldarkDark}
                language="javascript"
              >
                {block}
              </SyntaxHighlighter>
            ) : (
              <p key={index} className="text-lg text-white">
                {block}
              </p>
            )
          )}
      </div>
    </div>
  );
};

export default ChatItem;
