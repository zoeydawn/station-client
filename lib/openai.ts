import OpenAI from 'openai'

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
})

interface DemographicData {
  name: string
  age_range: string
  location: string
  interests: string[]
  income: string
  pain_points: string
  goals: string
}

interface MarketingConcept {
  headline: string
  value_proposition: string
  key_messages: string[]
  channels: string[]
  tone: string
  call_to_action: string
}

export async function generateMarketingConcept(
  demographics: DemographicData,
): Promise<MarketingConcept> {
  try {
    const { name, age_range, location, interests, income, pain_points, goals } =
      demographics

    const prompt = `Create a comprehensive marketing concept for the following target audience:

**Target Audience**: ${name}
**Demographics**: ${age_range} years old, living in ${location}, income range: ${income}
**Interests**: ${interests.join(', ')}
**Pain Points**: ${pain_points}
**Goals**: ${goals}

Please provide a structured marketing concept with:
1. **Title**: A compelling main message
2. **Description**: A detailed overview
3. **Value Proposition**: How your product/service addresses their pain points and helps achieve their goals
4. **Key Messages**: 3-4 core messages that resonate with this audience
5. **Recommended Channels**: Best marketing channels to reach this demographic
6. **Tone & Style**: Communication approach that fits their profile
7. **Call-to-Action**: Specific action you want them to take

Format the response as JSON with these exact keys: title, description, value_proposition, key_messages (array), channels (array), tone, call_to_action.`

    const completion = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        {
          role: 'system',
          content:
            'You are an expert marketing strategist. Always respond with valid JSON format only - no markdown formatting, no code blocks, no additional text.',
        },
        {
          role: 'user',
          content: prompt,
        },
      ],
      temperature: 0.7, // Balanced creativity for marketing
      max_tokens: 1000,
    })

    const content = completion.choices[0]?.message?.content
    if (!content) {
      throw new Error('No content received from OpenAI')
    }

    // Parse JSON response
    const marketingConcept: MarketingConcept = JSON.parse(content)

    // Log token usage for cost monitoring
    console.log('Token usage:', completion.usage)

    return marketingConcept
  } catch (error) {
    console.error('Error generating marketing concept:', error)

    // Handle JSON parsing errors specifically
    if (error instanceof SyntaxError) {
      throw new Error('Invalid JSON response from OpenAI - please try again')
    }

    // Handle OpenAI API errors
    if (error instanceof OpenAI.APIError) {
      throw new Error(`OpenAI API error: ${error.message}`)
    }

    throw new Error('Failed to generate marketing concept')
  }
}
