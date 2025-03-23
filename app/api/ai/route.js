import { NextResponse } from 'next/server';
import OpenAI from 'openai';


const openai = new OpenAI({
  baseURL: 'https://api.studio.nebius.com/v1/',
  apiKey: process.env.NEBIUS_API_KEY,
});

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, type } = body;

    if (type === 'schedule') {
      const completion = await openai.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "system",
            content: "You are an AI assistant for a spaced repetition learning app. Based on the user's self-assessment of their understanding of a topic, recommend the number of days until the next review."
          },
          {
            role: "user",
            content: `Based on this self-assessment: "${prompt}", determine: 
              1. How many days until the next review (as an integer between 1 and 120)
              2. A brief explanation of why you chose this interval
              
              Format your response as a JSON object with 'days' (number) and 'explanation' (string) fields.`
          }
        ],
        temperature: 0.7,
      });

      try {
        const jsonContent = completion.choices[0].message.content;
        console.log("AI response:", jsonContent);
        
        const jsonMatch = jsonContent.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          try {
            const responseData = JSON.parse(jsonMatch[0]);
            return NextResponse.json(responseData, { status: 200 });
          } catch (e) {
            console.error("JSON parse error:", e);
          }
        }
        
        const daysMatch = jsonContent.match(/days["\s:]+(\d+)/i);
        const days = daysMatch ? parseInt(daysMatch[1]) : 7;
        
        return NextResponse.json({ 
          days: days, 
          explanation: "Based on your assessment, this seems appropriate." 
        }, { status: 200 });
        
      } catch (error) {
        console.error('Error parsing AI response:', error);
        return NextResponse.json({ days: 7, explanation: "Default schedule due to parsing error." }, { status: 200 });
      }
    } else {
      const completion = await openai.chat.completions.create({
        temperature: 0.7,
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "system",
            content: "You are a helpful tutor explaining concepts in clear, simple terms with relevant examples."
          },
          {
            role: "user",
            content: prompt
          }
        ]
      });

      return NextResponse.json({ response: completion.choices[0].message.content }, { status: 200 });
    }
  } catch (error) {
    console.error('Error in AI API route:', error);
    return NextResponse.json(
      { error: "Failed to get response", message: error.message },
      { status: 500 }
    );
  }
}
