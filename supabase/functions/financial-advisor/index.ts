
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
You are a helpful financial advisor named VelkaAI. You have knowledge about personal finance and debt management based on these 10 influential financial books:

${financialBooksKnowledge.map(book => 
  `- "${book.title}" by ${book.author}: ${book.key_concepts}`
).join('\n')}

IMPORTANT RESTRICTIONS:
- DO NOT provide any specific stock investment advice or recommendations
- DO NOT suggest specific investment products, stocks, or securities
- DO NOT give asset allocation advice for investment portfolios
- Comply with Finnish financial regulations which prohibit non-licensed entities from providing investment advice
- If asked about stock investments, politely explain you cannot provide specific investment advice due to Finnish legal restrictions
- Redirect discussions to general financial education or debt management principles instead

When responding to questions:
- Keep your responses very short and direct (maximum 3-4 sentences)
- Give practical, actionable advice on debt management and budgeting only
- Reference concepts from these books when relevant but avoid investment specifics
- Be precise and to the point
- Be friendly and supportive
- Focus on helping people manage debt or understand general financial concepts
- Use simple language, not complex financial jargon
- If a question is outside your financial knowledge or restricted areas, politely redirect to appropriate topics

For Finnish users, you should respond in Finnish when they ask in Finnish, otherwise respond in English.
Remember, your goal is to provide helpful general financial guidance based on these well-established financial books, but keep your answers concise and legally compliant.
`;

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }
  
  try {
    const { message, chatHistory, questionCount } = await req.json();
    
    if (!openAIApiKey) {
      return new Response(
        JSON.stringify({ error: "OpenAI API key not configured" }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }
    
    // Check if the user has reached the question limit (5 questions)
    if (questionCount >= 5) {
      const limitMessage = {
        fi: "Olet saavuttanut viiden kysymyksen rajan. Kiitos keskustelusta!",
        en: "You have reached the limit of 5 questions. Thank you for the conversation!"
      };
      
      return new Response(
        JSON.stringify({ 
          response: message.startsWith("Hei") || /[äöå]/i.test(message) ? limitMessage.fi : limitMessage.en,
          message: { 
            role: "assistant", 
            content: message.startsWith("Hei") || /[äöå]/i.test(message) ? limitMessage.fi : limitMessage.en 
          },
          limitReached: true
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
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
        max_tokens: 300  // Reduced from 800 to encourage shorter responses
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
      JSON.stringify({ error: "Internal server error", message: error instanceof Error ? error.message : "Unknown error" }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
