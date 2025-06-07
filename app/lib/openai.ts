import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

export interface MoodAnalysis {
  primaryMood: 'happy' | 'sad' | 'energetic' | 'calm' | 'angry' | 'nostalgic' | 'confident' | 'anxious'
  energy: number // 1-10
  genres: string[]
  searchTerms: string[]
  artistStyles: string[]
}

export async function analyzeMood(prompt: string, userGenres: string[]): Promise<MoodAnalysis> {
  const systemPrompt = `You are an expert music curator who understands the emotional nuances of different life moments. 
  Analyze the user's situation and return a JSON object with:
  - primaryMood: one of [happy, sad, energetic, calm, angry, nostalgic, confident, anxious]
  - energy: number from 1-10 (1=very calm, 10=very energetic)
  - genres: array of 3-5 music genres that would fit this moment (can include user's preferred genres: ${userGenres.join(', ')})
  - searchTerms: array of 5-10 Spotify search terms that would find appropriate songs (e.g., "uplifting indie", "workout motivation", "calm instrumental")
  - artistStyles: array of 3-5 artist names whose style matches the mood (mix of popular and lesser-known)`

  try {
    const response = await openai.chat.completions.create({
      model: 'gpt-3.5-turbo-1106',
      messages: [
        { role: 'system', content: systemPrompt },
        { role: 'user', content: prompt }
      ],
      response_format: { type: 'json_object' },
      temperature: 0.7,
      max_tokens: 500,
    })

    const content = response.choices[0].message.content
    if (!content) throw new Error('No response from OpenAI')
    
    return JSON.parse(content) as MoodAnalysis
  } catch (error) {
    console.error('Error analyzing mood:', error)
    // Return default analysis if OpenAI fails
    return {
      primaryMood: 'calm',
      energy: 5,
      genres: userGenres.slice(0, 3),
      searchTerms: ['chill vibes', 'relaxing music', 'ambient'],
      artistStyles: ['Bon Iver', 'James Blake', 'The xx'],
    }
  }
}