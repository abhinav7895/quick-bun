import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';
import { OpenAIStream, StreamingTextResponse } from 'ai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

export async function POST(request: NextRequest) {
  try {
    const { prompt } = await request.json();
    const session = await auth();

    if (!session?.user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!prompt || typeof prompt !== 'string') {
      return NextResponse.json({ error: 'Invalid package name' }, { status: 400 });
    }

    const response = await openai.chat.completions.create({
      model: "gpt-3.5-turbo",
      messages: [
        { 
          role: "system", 
          content: "You are a helpful assistant that generates documentation for npm packages. Use markdown formatting for headings, code blocks, and other elements like notion."
        },
        { 
          role: "user", 
          content: `Generate documentation for the npm package "${prompt}". Include the following sections:

          1. Introduction
          2. Installation
          3. Basic Usage
          4. API Reference
          5. Examples
          6. Common Issues and Troubleshooting
          7. Additional Resources

          Use appropriate markdown formatting for headings, code blocks, and other elements, like notion.`
        }
      ],
      stream: true,
    });

    const stream = OpenAIStream(response);

    return new StreamingTextResponse(stream);
  } catch (error) {
    console.error('Error generating documentation:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to generate documentation' },
      { status: 500 }
    );
  }
}