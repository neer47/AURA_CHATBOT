import { GoogleGenerativeAI } from "@google/generative-ai";
export const configureGemini = () => {
    const apiKey = process.env.API_KEY;
    const genAI = new GoogleGenerativeAI(apiKey);
    return genAI;
};
//# sourceMappingURL=gemini-config.js.map