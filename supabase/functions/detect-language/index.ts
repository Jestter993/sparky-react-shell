import "https://deno.land/x/xhr@0.1.0/mod.ts";
import { serve } from "https://deno.land/std@0.168.0/http/server.ts";

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight requests
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { audio } = await req.json();
    
    if (!audio) {
      throw new Error('No audio data provided');
    }

    console.log('Starting language detection...');

    // Convert base64 to binary
    const binaryString = atob(audio);
    const bytes = new Uint8Array(binaryString.length);
    for (let i = 0; i < binaryString.length; i++) {
      bytes[i] = binaryString.charCodeAt(i);
    }

    // Prepare form data for OpenAI Whisper
    const formData = new FormData();
    const blob = new Blob([bytes], { type: 'audio/webm' });
    formData.append('file', blob, 'audio.webm');
    formData.append('model', 'whisper-1');

    console.log('Sending to OpenAI Whisper...');

    const response = await fetch('https://api.openai.com/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${Deno.env.get('OPENAI_API_KEY')}`,
      },
      body: formData,
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('OpenAI API error:', errorText);
      throw new Error(`OpenAI API error: ${errorText}`);
    }

    const result = await response.json();
    console.log('Language detection result:', result);

    // Extract language from the response
    // Whisper doesn't directly return language, but we can detect it from the text
    // For now, we'll use a simple approach - in production you might want to use language detection libraries
    const text = result.text || '';
    let detectedLanguage = 'unknown';

    // Simple language detection based on character patterns
    if (/[àáâãäåæçèéêëìíîïðñòóôõöøùúûüýþÿ]/i.test(text)) {
      if (/[ñáéíóúü]/i.test(text)) {
        detectedLanguage = 'es'; // Spanish
      } else if (/[àâêôçù]/i.test(text)) {
        detectedLanguage = 'fr'; // French
      } else if (/[äöüß]/i.test(text)) {
        detectedLanguage = 'de'; // German
      } else if (/[ãõç]/i.test(text)) {
        detectedLanguage = 'pt'; // Portuguese
      }
    } else if (/[\u4e00-\u9fff]/i.test(text)) {
      detectedLanguage = 'zh'; // Chinese
    } else if (/[a-zA-Z]/.test(text)) {
      detectedLanguage = 'en'; // English (default for Latin alphabet)
    }

    console.log('Detected language:', detectedLanguage);

    return new Response(
      JSON.stringify({ 
        detectedLanguage,
        text: text.substring(0, 100) // First 100 chars for reference
      }),
      { 
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        } 
      }
    );

  } catch (error) {
    console.error('Error in detect-language function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message,
        detectedLanguage: 'unknown' 
      }),
      {
        status: 500,
        headers: { 
          ...corsHeaders, 
          'Content-Type': 'application/json' 
        },
      }
    );
  }
});