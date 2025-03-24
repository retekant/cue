import OpenAI from 'openai';

let openai;
try {
  openai = new OpenAI({
    baseURL: 'https://api.studio.nebius.com/v1/',
    apiKey: process.env.NEBIUS_API_KEY || process.env.OPENAI_API_KEY || 'dummy_key',
  });
} catch (error) {
  console.error('Error initializing OpenAI client:', error);
}

export async function POST(request) {
  try {
    const body = await request.json();
    const { prompt, type, todos } = body;

    // Check if OpenAI client was successfully initialized
    if (!openai) {
      return new Response(JSON.stringify({ 
        error: "AI services not available", 
        message: "API key not configured" 
      }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

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
            return new Response(JSON.stringify(responseData), {
              headers: { 'Content-Type': 'application/json' },
            });
          } catch (e) {
            console.error("JSON parse error:", e);
            return new Response(JSON.stringify({ days: 7, explanation: "Default schedule due to parsing error." }), {
              headers: { 'Content-Type': 'application/json' },
            });
          }
        }
        
        const daysMatch = jsonContent.match(/days["\s:]+(\d+)/i);
        const days = daysMatch ? parseInt(daysMatch[1]) : 7;
        
        return new Response(JSON.stringify({ 
          days: days, 
          explanation: "Based on your assessment, this seems appropriate." 
        }), {
          headers: { 'Content-Type': 'application/json' },
        });
      } catch (error) {
        console.error('Error parsing AI response:', error);
        return new Response(JSON.stringify({ days: 7, explanation: "Default schedule due to parsing error." }), {
          headers: { 'Content-Type': 'application/json' },
        });
      }
    } else if (type === 'advice') {
      // Format the todos information for the AI
      let todoInfo = "";
      if (todos && todos.length > 0) {
        todoInfo = "Here are the user's current tasks:\n";
        todos.forEach((todo, index) => {
          const status = todo.completed ? "Completed" : "Pending";
          const time = todo.scheduledTime 
            ? `Scheduled for: ${new Date(todo.scheduledTime).toLocaleString()}`
            : "No scheduled time";
          todoInfo += `${index + 1}. ${todo.task} - ${status} - ${time}\n`;
        });
      } else {
        todoInfo = "The user currently has no tasks.";
      }
      
      const completion = await openai.chat.completions.create({
        model: "meta-llama/Meta-Llama-3.1-70B-Instruct",
        messages: [
          {
            role: "system",
            content: `You are an AI assistant for a productivity and learning app. Your role is to provide thoughtful advice, 
                     help with prioritization, and answer questions about productivity, task management, 
                     learning strategies, and personal development. Be conversational, supportive and insightful.`
          },
          {
            role: "user",
            content: `${todoInfo}\n\nUser question: ${prompt}\n\nProvide a helpful, conversational response. 
                     If the user is asking about task prioritization, offer specific advice based on their current tasks.
                     If they're asking something else, provide helpful general advice while maintaining a friendly tone.`
          }
        ],
        temperature: 0.7,
      });
      
      return new Response(JSON.stringify({ 
        content: completion.choices[0].message.content 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
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

      return new Response(JSON.stringify({ 
        response: completion.choices[0].message.content 
      }), {
        headers: { 'Content-Type': 'application/json' },
      });
    }
  } catch (error) {
    console.error('Error in AI API route:', error);
    return new Response(JSON.stringify(
      { error: "Failed to get response", message: error.message }
    ), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
