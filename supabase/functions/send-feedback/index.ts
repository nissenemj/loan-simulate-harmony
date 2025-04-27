
import { Resend } from 'npm:resend@4.0.0';

const resend = new Resend(Deno.env.get('RESEND_API_KEY') as string);

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

Deno.serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { name, email, message } = await req.json();

    const { error } = await resend.emails.send({
      from: 'Velkavapaus.fi <feedback@velkavapaus.fi>',
      to: ['nissenemj@gmail.com'],
      subject: 'Uusi palaute Velkavapaus.fi-sivustolta',
      html: `
        <h2>Uusi palaute</h2>
        <p><strong>Nimi:</strong> ${name || 'Ei annettu'}</p>
        <p><strong>Sähköposti:</strong> ${email}</p>
        <p><strong>Viesti:</strong></p>
        <p>${message}</p>
      `
    });

    if (error) {
      console.error('Email sending error:', error);
      return new Response(
        JSON.stringify({ error: 'Sähköpostin lähettäminen epäonnistui' }),
        { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    return new Response(
      JSON.stringify({ success: true }),
      { status: 200, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  } catch (error) {
    console.error('Unexpected error:', error);
    return new Response(
      JSON.stringify({ error: 'Virhe palautteen käsittelyssä' }),
      { status: 500, headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );
  }
});
