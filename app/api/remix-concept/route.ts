import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { generateMarketingConcept } from '@/lib/openai'

export async function POST(request: NextRequest) {
  try {
    const { audienceId, additionalData } = await request.json()

    // Fetch the audience data
    const { data: audience, error: audienceError } = await supabase
      .from('audiences')
      .select('*')
      .eq('id', audienceId)
      .single()

    if (audienceError || !audience) {
      return NextResponse.json(
        { message: 'Audience not found' },
        { status: 404 },
      )
    }

    // Enhance the audience data with additional context
    const enhancedAudience = {
      ...audience,
      additional_context: additionalData,
    }

    // Generate marketing concept with the additional data
    const concept = await generateMarketingConcept(enhancedAudience)

    // Save concept to Supabase with audience_id
    const { data: conceptData, error: conceptError } = await supabase
      .from('concepts')
      .insert([{ ...concept, audience_id: audienceId }])
      .select()

    if (conceptError) throw conceptError

    return NextResponse.json({
      message: 'Concept generated and saved successfully',
      concept: conceptData[0],
    })
  } catch (error) {
    console.error('Error generating concept:', error)
    return NextResponse.json(
      { message: 'Internal server error', error },
      { status: 500 },
    )
  }
}
