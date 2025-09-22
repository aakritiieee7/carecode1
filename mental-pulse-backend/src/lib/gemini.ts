import { GoogleGenerativeAI } from '@google/generative-ai'

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!)

export async function generateAIResponse(message: string, conversationHistory?: Array<{role: string, content: string}>): Promise<string> {
  try {
    const model = genAI.getGenerativeModel({ model: "gemini-pro" })

    // System prompt for the mental health assistant
    const systemPrompt = `You are a compassionate and supportive AI mental health assistant designed to help students manage their wellbeing. Your role is to:

1. Provide emotional support and encouragement
2. Suggest healthy coping strategies and stress management techniques
3. Offer mindfulness exercises and breathing techniques
4. Help users identify triggers and patterns in their mood
5. Provide information about mental health resources
6. Encourage seeking professional help when appropriate

Guidelines:
- Always be empathetic, non-judgmental, and supportive
- Keep responses conversational and accessible to students
- Don't diagnose medical conditions or replace professional therapy
- If someone mentions self-harm or suicidal thoughts, encourage them to seek immediate professional help
- Focus on practical, evidence-based wellness strategies
- Keep responses concise but helpful (aim for 2-3 paragraphs max)

Remember: You're here to support, not replace professional mental health services.`

    // Build conversation context
    let conversationText = systemPrompt + "\n\nConversation:\n"
    
    if (conversationHistory && conversationHistory.length > 0) {
      conversationHistory.slice(-10).forEach(msg => { // Last 10 messages for context
        const role = msg.role === 'user' ? 'Student' : 'Assistant'
        conversationText += `${role}: ${msg.content}\n`
      })
    }
    
    conversationText += `Student: ${message}\nAssistant:`

    const result = await model.generateContent(conversationText)
    const response = await result.response
    const text = response.text()

    return text.trim()
  } catch (error) {
    console.error('Gemini AI error:', error)
    return "I apologize, but I'm having trouble responding right now. Please try again in a moment, or consider reaching out to a counselor or trusted friend if you need immediate support."
  }
}