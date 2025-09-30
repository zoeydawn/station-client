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
    const concept = await generateMarketingConcept(audience)

    console.log('concept:', concept)

    // save concept to Supabase
    const { data: conceptData, error: conceptError } = await supabase
      .from('concepts')
      .insert([concept])

    if (conceptError) throw conceptError

    console.log('conceptData:', conceptData)

    // Save audience to Supabase
    const { data, error } = await supabase.from('audiences').insert([audience])

    if (error) throw error

    // Successfully saved
    return NextResponse.json({ message: 'Audience saved successfully', data })
  } catch (error) {
    console.error('Error saving audience:', error)
    return NextResponse.json(
      { message: 'Internal server error', error },
      { status: 500 },
    )
  }
}
