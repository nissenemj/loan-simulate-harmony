
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Financial books knowledge base - this would ideally come from a database
const financialBooksKnowledge = [
  {
    title: "Rich Dad Poor Dad",
    author: "Robert Kiyosaki",
    key_concepts: "Assets vs liabilities, cash flow, financial education, building wealth through investments"
  },
  {
    title: "The Intelligent Investor",
    author: "Benjamin Graham",
    key_concepts: "Value investing, margin of safety, market fluctuations, investment vs speculation"
  },
  {
    title: "Think and Grow Rich",
    author: "Napoleon Hill",
    key_concepts: "Mindset for wealth, desire, persistence, planning, specialized knowledge"
  },
  {
    title: "The Total Money Makeover",
    author: "Dave Ramsey",
    key_concepts: "Debt snowball, emergency fund, budgeting, seven baby steps to financial freedom"
  },
  {
    title: "The Psychology of Money",
    author: "Morgan Housel",
    key_concepts: "Behavior with money, financial decision making, wealth building as behavior not knowledge"
  },
  {
    title: "Your Money or Your Life",
    author: "Vicki Robin & Joe Dominguez",
    key_concepts: "Financial independence, relationship with money, conscious spending, fulfillment curve"
  },
  {
    title: "The Millionaire Next Door",
    author: "Thomas J. Stanley & William D. Danko",
    key_concepts: "Wealth accumulation, frugality, living below means, financial independence"
  },
  {
    title: "A Random Walk Down Wall Street",
    author: "Burton Malkiel",
    key_concepts: "Efficient market hypothesis, index investing, random movements of stocks, portfolio theory"
  },
  {
    title: "The Little Book of Common Sense Investing",
    author: "John C. Bogle",
    key_concepts: "Index investing, long-term investment, minimizing costs, diversification"
  },
  {
    title: "I Will Teach You to Be Rich",
    author: "Ramit Sethi",
    key_concepts: "Automation, conscious spending, personal finance system, focus on big wins"
  }
];

const systemPrompt = `
You are a helpful financial advisor named VelkaAI. You have deep knowledge about personal finance, debt management, and investments based on these 10 influential financial books:

${financialBooksKnowledge.map(book => 
  `- "${book.title}" by ${book.author}: ${book.key_concepts}`
).join('\n')}

When responding to questions:
- Give practical, actionable advice
- Reference specific concepts from these books when relevant
- Be concise but thorough
- Be friendly and encouraging
- Focus on helping people manage debt or grow wealth
- Use simple language, not complex financial jargon
- If a question is outside your financial knowledge, politely redirect to financial topics

For Finnish users, you should respond in Finnish when they ask in Finnish, otherwise respond in English.
Remember, your goal is to provide helpful financial guidance based on these well-established financial books.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { message, chatHistory } = await req.json();
    
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Prepare messages for the OpenAI API
    const messages = [
      { role: "system", content: systemPrompt },
      ...chatHistory,
      { role: "user", content: message }
    ];
    
    // Make request to OpenAI
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Authorization": `Bearer ${openAIApiKey}`,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: messages,
        temperature: 0.7,
        max_tokens: 800
      })
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      console.error("OpenAI API error:", data);
      return new Response(
        JSON.stringify({ error: "Error calling OpenAI API", details: data }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    const aiResponse = data.choices[0].message.content;
    
    return new Response(
      JSON.stringify({ 
        response: aiResponse,
        message: { role: "assistant", content: aiResponse }
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
    
  } catch (error) {
    console.error("Error in financial-advisor function:", error);
    return new Response(
      JSON.stringify({ error: "Internal server error", message: error.message }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
