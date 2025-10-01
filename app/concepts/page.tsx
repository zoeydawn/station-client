'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'
import { AudienceView } from '@/components/AudienceView'
import { AudienceWithConcepts } from '@/types/concept'

export default function ConceptsPage() {
  const [audiencesWithConcepts, setAudiencesWithConcepts] = useState<
    AudienceWithConcepts[]
  >([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchAudiencesWithConcepts()
  }, [])

  const fetchAudiencesWithConcepts = async () => {
    try {
      setLoading(true)

      // Fetch audiences with their related concepts using Supabase's join syntax
      const { data, error } = await supabase
        .from('audiences')
        .select(
          `
          *,
          concepts (*)
        `,
        )
        .order('created_at', { ascending: false })

      if (error) throw error

      setAudiencesWithConcepts(data || [])
    } catch (err) {
      console.error('Error fetching audiences:', err)
      setError('Failed to load audiences and concepts')
    } finally {
      setLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-center">Loading concepts...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <div className="text-red-600 text-center">{error}</div>
        <button
          onClick={fetchAudiencesWithConcepts}
          className="mt-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 mx-auto block"
        >
          Retry
        </button>
      </div>
    )
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      <h1 className="text-4xl font-bold mb-8">
        Audiences & Marketing Concepts
      </h1>

      {audiencesWithConcepts.length === 0 ? (
        <div className="alert alert-info">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 24 24"
            className="stroke-current shrink-0 w-6 h-6"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            ></path>
          </svg>
          <span>No audiences found. Create some audiences first!</span>
        </div>
      ) : (
        <div className="space-y-6">
          {audiencesWithConcepts.map((audience) => (
            <AudienceView
              audience={audience}
              key={audience.id}
              fetchAudiencesAction={fetchAudiencesWithConcepts}
            />
          ))}
        </div>
      )}
    </div>
  )
}
