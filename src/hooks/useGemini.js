import { GoogleGenerativeAI } from '@google/generative-ai'

const GEMINI_API_KEY = 'YOUR_GEMINI_API_KEY_HERE'

const genAI = new GoogleGenerativeAI(GEMINI_API_KEY)

export function useGemini() {
  async function askGemini(systemPrompt, userMessage) {
    const model = genAI.getGenerativeModel({ model: 'gemini-1.5-flash' })
    const chat = model.startChat({
      history: [],
      generationConfig: { maxOutputTokens: 2048 },
    })
    const result = await chat.sendMessage(
      `${systemPrompt}\n\nUser: ${userMessage}`
    )
    return result.response.text()
  }

  async function askJarjis(currentText, instruction) {
    const systemPrompt = `You are Jarjis, an AI writing assistant. Your job is to help the writer edit their book.
The current text in the editor is:
---
${currentText}
---
Based on the writer's instruction, return ONLY the modified text. Do not add explanations. Just return the full updated text.`
    return askGemini(systemPrompt, instruction)
  }

  async function askAce(currentText, question) {
    const systemPrompt = `You are Ace, a creative brainstorming AI assistant for writers.
The writer is working on this text:
---
${currentText}
---
Help the writer brainstorm, answer questions, suggest ideas, and spark creativity. Be friendly and inspiring.`
    return askGemini(systemPrompt, question)
  }

  return { askJarjis, askAce }
}
