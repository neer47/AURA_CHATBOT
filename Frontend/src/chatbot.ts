import "./chatbot.css";

interface ChatbotOptions {
  apiKey: string;
  endpoint: string;
  theme?: "light" | "dark";
}

// Extend the Window interface
declare global {
  interface Window {
    initChatbot: (options: ChatbotOptions) => void;
  }
}

(function () {
  // Main initialization function
  window.initChatbot = function (options: ChatbotOptions): void {
    const { apiKey, endpoint, theme = "light" } = options;

    if (!apiKey || !endpoint) {
      console.error("Chatbot: API Key and Endpoint are required.");
      return;
    }

    // Create Chatbot Container
    const container = document.createElement("div");
    container.id = "chatbot-container";
    container.innerHTML = `
      <div class="chatbot chatbot-${theme}">
        <div class="chatbot-header">Chat with us!</div>
        <div class="chatbot-body"></div>
        <input type="text" class="chatbot-input" placeholder="Type a message...">
      </div>
    `;
    document.body.appendChild(container);

    // Handle user input
    const input = container.querySelector<HTMLInputElement>(".chatbot-input")!;
    input.addEventListener("keydown", async (e) => {
      if (e.key === "Enter" && input.value.trim()) {
        const message = input.value.trim();
        displayMessage("user", message);
        input.value = "";

        const response = await fetchResponse(message);
        displayMessage("bot", response);
      }
    });

    // Fetch bot response from the API
    async function fetchResponse(message: string): Promise<string> {
      try {
        const response = await fetch(endpoint, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${apiKey}`,
          },
          body: JSON.stringify({ message }),
        });
        const data = await response.json();
        return data.response || "No response.";
      } catch (error) {
        console.error("Error fetching chatbot response:", error);
        return "Error connecting to the server.";
      }
    }

    // Display message in the chat body
    function displayMessage(sender: "user" | "bot", text: string): void {
      const body = container.querySelector(".chatbot-body")!;
      const messageElement = document.createElement("div");
      messageElement.className = `chatbot-message chatbot-${sender}`;
      messageElement.textContent = text;
      body.appendChild(messageElement);
      body.scrollTop = body.scrollHeight;
    }
  };
})();
