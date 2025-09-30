import { NextRequest, NextResponse } from 'next/server'
import { supabase } from '@/lib/supabaseClient'

export async function POST(request: NextRequest) {
  const { name, ageRange, location, income, interests, painPoints, goals } =
    await request.json()

  try {
    // Save to Supabase
    const { data, error } = await supabase.from('audiences').insert([
      {
        name,
        age_range: ageRange,
        location,
        income,
        interests,
        pain_points: painPoints,
        goals,
      },
    ])

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
