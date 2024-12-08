import { createOpenAI } from '@ai-sdk/openai';
import { generateText } from 'ai';
import { NextRequest, NextResponse } from 'next/server';

const aiModel = createOpenAI({
  name: 'perplexity',
  apiKey: process.env.PERPLEXITY_API_KEY ?? '',
  baseURL: 'https://api.perplexity.ai/',
});

export async function POST(req: NextRequest) {
  try {
    const { messages } = await req.json();

    // Check if the messages are valid
    if (!Array.isArray(messages) || messages.length === 0) {
      return NextResponse.json({ error: 'Invalid input: Messages must be a non-empty array.' }, { status: 400 });
    }

    // Extract the last message content as the prompt
    const prompt = messages[messages.length - 1].content;

    // Generate text using the configured AI model
    const textResponse = await generateText({
      model: aiModel('llama-3.1-sonar-large-128k-online'),
      prompt: prompt,
    });

    // Send the generated text as a response
    return NextResponse.json({ generatedText: textResponse.text });
  } catch (error) {
    console.error('Error generating text:', error);
    if (error instanceof Error) {
      return NextResponse.json({ error: error.message }, { status: 500 });
    }
    return NextResponse.json({ error: 'An unexpected error occurred' }, { status: 500 });
  }
}
