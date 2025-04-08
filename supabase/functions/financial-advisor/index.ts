
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import "https://deno.land/x/xhr@0.1.0/mod.ts";

const openAIApiKey = Deno.env.get('OPENAI_API_KEY');

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

// Site usage guide knowledge base
const siteUsageGuide = {
  dashboard: {
    main: "The Dashboard shows an overview of your current debt situation, including visualizations of your debt breakdown and a timeline to becoming debt-free.",
    debtFreeTimeline: "The Debt-Free Timeline shows when you'll be free from all debt and credit cards based on your current payment strategy.",
    paymentPlanSummary: "The Payment Plan section shows how your monthly budget is allocated between minimum payments and extra payments.",
    strategySelection: "You can save and select different repayment strategies using the 'Save Strategy' button and the strategy dropdown menu.",
    debtBreakdown: "The Debt Breakdown tabs show details about your loans and credit cards, helping you understand your current debt situation."
  },
  debtSummary: {
    main: "The Debt Summary page provides detailed information about all your debts, including loans and credit cards.",
    repaymentPlan: "The Repayment Plan tab shows a detailed month-by-month breakdown of your debt repayment journey.",
    addingDebts: "You can add new loans and credit cards using the respective forms. Fill in details like balance, interest rate, and minimum payment."
  },
  calculators: {
    debtPayoff: "The Debt Payoff Calculator lets you compare different repayment strategies (Avalanche, Snowball, Equal) and see how they affect your payoff timeline.",
    extraPayment: "The Extra Payment Calculator shows how adding extra payments can reduce your debt payoff time and save interest.",
    consolidation: "The Debt Consolidation Calculator helps you understand if consolidating your debts into a single loan would be beneficial."
  },
  visualization: {
    charts: "The charts visualize your debt situation from different angles. Hover over elements to see detailed information.",
    breakdown: "The Debt Breakdown chart shows the proportion of each debt relative to your total debt.",
    timeline: "The Timeline visualization shows how your debt decreases over time with your chosen repayment strategy."
  }
};

const systemPrompt = `
You are a helpful assistant named VelkaAI that guides users on how to use the debt management website. Your job is to help users navigate the site and understand how to use its various features effectively.

Below is detailed information about the site's features that you should use to help users:

DASHBOARD:
${Object.entries(siteUsageGuide.dashboard).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

DEBT SUMMARY:
${Object.entries(siteUsageGuide.debtSummary).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

CALCULATORS:
${Object.entries(siteUsageGuide.calculators).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

VISUALIZATIONS:
${Object.entries(siteUsageGuide.visualization).map(([key, value]) => `- ${key}: ${value}`).join('\n')}

When responding to questions:
- Provide specific guidance on how to use features
- Explain what calculations are happening behind the scenes if asked
- Help users understand how to interpret visualizations
- If a user seems confused about a specific feature, explain it step by step
- Keep responses friendly and helpful
- Be concise but thorough in your explanations
- Focus on practical usage rather than theoretical knowledge

For Finnish users, you should respond in Finnish when they ask in Finnish, otherwise respond in English.
Remember, your goal is to help users navigate and use the site effectively.
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
        max_tokens: 300
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

