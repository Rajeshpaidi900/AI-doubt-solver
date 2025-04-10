import OpenAI from "openai";

// the newest OpenAI model is "gpt-4o" which was released May 13, 2024. do not change this unless explicitly requested by the user
const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY || "" });

export type AnswerResponse = {
  answer: string;
  error?: string;
};

export async function generateAnswer(question: string): Promise<AnswerResponse> {
  try {
    if (!process.env.OPENAI_API_KEY) {
      throw new Error("OpenAI API key is missing");
    }

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "system",
          content: 
            "You are a helpful AI assistant that provides clear, accurate, and thorough answers to questions. Your responses should be well-structured and formatted using Markdown. Include code examples when relevant to programming questions. Be concise but comprehensive, and use proper headings, lists, and code blocks where appropriate."
        },
        {
          role: "user",
          content: question
        }
      ],
    });

    const answer = response.choices[0].message.content;
    
    return {
      answer: answer || "Sorry, I couldn't generate an answer."
    };
  } catch (error: any) {
    console.error("OpenAI API error:", error);
    return {
      answer: "",
      error: error.message || "Failed to generate answer"
    };
  }
}
