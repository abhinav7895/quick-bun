import { auth } from '@/auth';
import { NextRequest, NextResponse } from 'next/server';
import OpenAI from 'openai';

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

interface Package {
  name: string;
  description: string;
  url: string;
}

async function generatePackageSuggestions(query: string): Promise<Package[]> {
  const prompt = `Suggest up to 5 npm packages for "${query}", and make sure that package exist. For each package, provide:
  1. Package name
  2. Brief description (max 100 characters)
  3. npm package URL
  
  Format the response as a JSON array of objects with keys: name, description, url.`;

  const completion = await openai.chat.completions.create({
    model: "gpt-3.5-turbo",
    messages: [{ role: "user", content: prompt }],
    temperature: 0.7,
    max_tokens: 1000,
  });

  const response = completion.choices[0].message.content;
  if (!response) {
    throw new Error('No response from OpenAI');
  }

  try {
    const packages: Package[] = JSON.parse(response);
    return packages.slice(0, 5); 
  } catch (error) {
    console.error('Error parsing OpenAI response:', error);
    throw new Error('Invalid response from OpenAI');
  }
}

export async function POST(request: NextRequest) {
  try {
    const { query } = await request.json();
    const session = await auth();

    if (!session?.user) {
      return Response.json({ error: "Not authenticated" }, { status: 401 });
    }

    if (!query || typeof query !== 'string') {
      return NextResponse.json({ error: 'Invalid query' }, { status: 400 });
    }

    const searchResults = await generatePackageSuggestions(query);

    return NextResponse.json({ success: true, packages: searchResults }, {status : 200});
  } catch (error) {
    console.error('Error searching packages:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to search packages' },
      { status: 500 }
    );
  }
}