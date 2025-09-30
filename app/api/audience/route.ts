import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'
import { generateMarketingConcept } from '@/lib/openai'

export async function POST(request: NextRequest) {
  const { name, ageRange, location, income, interests, painPoints, goals } =
    await request.json()

  const audience = {
    name,
    age_range: ageRange,
    location,
    income,
    interests,
    pain_points: painPoints,
    goals,
  }

  try {
    // generate marketing concept
    // we do this first because there's no point in saving the audience if the concept generation fails
    const concept = await generateMarketingConcept(audience)

    // save audience to Supabase
    // we do it before saving the concept because we need the audience ID
    const { data: audienceData, error: audienceError } = await supabase
      .from('audiences')
      .insert([audience])
      .select()

    if (audienceError) throw audienceError

    const audienceId = audienceData[0].id

    // save concept to Supabase
    const { data: conceptData, error: conceptError } = await supabase
      .from('concepts')
      .insert([{ ...concept, audience_id: audienceId }])
      .select() // so we can return the new concept

    if (conceptError) throw conceptError

    // Successfully saved
    return NextResponse.json({
      message: 'Audience and concept saved successfully',
      audience: audienceData[0],
      concept: conceptData[0],
    })
  } catch (error) {
    console.error('Error saving audience and concept:', error)
    return NextResponse.json(
      { message: 'Internal server error', error },
      { status: 500 },
    )
  }
}
