'use client'

import { useState, useEffect } from 'react'
import { supabase } from '@/lib/supabaseClient'

interface Audience {
  id: number
  name: string
  age_range: string
  location: string
  income: string
  interests: string[]
  pain_points: string
  goals: string
  created_at: string
}

interface Concept {
  id: number
  headline: string
  value_proposition: string
  key_messages: string[]
  channels: string[]
  tone: string
  call_to_action: string
  audience_id: number
  created_at: string
}

interface AudienceWithConcepts extends Audience {
  concepts: Concept[]
}

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
        <div className="text-center">Loading audiences and concepts...</div>
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

  console.log('audiencesWithConcepts', audiencesWithConcepts)

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
            <div key={audience.id} className="card bg-base-100 shadow-xl">
              <div className="card-body">
                {/* Audience Header */}
                <div className="border-b border-base-300 pb-4 mb-6">
                  <h2 className="card-title text-2xl mb-4">{audience.name}</h2>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                    <div className="badge badge-outline badge-lg p-3">
                      <strong>Age:</strong> {audience.age_range}
                    </div>
                    <div className="badge badge-outline badge-lg p-3">
                      <strong>Location:</strong> {audience.location}
                    </div>
                    <div className="badge badge-outline badge-lg p-3">
                      <strong>Income:</strong> {audience.income}
                    </div>
                    <div className="badge badge-outline badge-lg p-3">
                      <strong>Created:</strong>{' '}
                      {new Date(audience.created_at).toLocaleDateString()}
                    </div>
                  </div>

                  <div className="mt-4 space-y-2">
                    <div>
                      <span className="font-semibold">Interests:</span>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {audience.interests.map((interest, idx) => (
                          <span
                            key={idx}
                            className="badge badge-primary badge-sm"
                          >
                            {interest}
                          </span>
                        ))}
                      </div>
                    </div>

                    <div className="alert alert-warning py-2">
                      <strong>Pain Points:</strong> {audience.pain_points}
                    </div>

                    <div className="alert alert-success py-2">
                      <strong>Goals:</strong> {audience.goals}
                    </div>
                  </div>
                </div>

                {/* Concepts Section */}
                <div>
                  <h3 className="text-xl font-semibold mb-4 flex items-center gap-2">
                    Marketing Concepts
                    <div className="badge badge-secondary">
                      {audience.concepts?.length || 0}
                    </div>
                  </h3>

                  {audience.concepts && audience.concepts.length > 0 ? (
                    <div className="space-y-4">
                      {audience.concepts.map((concept) => (
                        <div
                          key={concept.id}
                          className="card bg-base-200 shadow-md"
                        >
                          <div className="card-body p-4">
                            <h4 className="card-title text-lg text-primary mb-3">
                              {concept.headline}
                            </h4>

                            <div className="space-y-3">
                              <div>
                                <span className="font-semibold">
                                  Value Proposition:
                                </span>
                                <p className="text-sm mt-1">
                                  {concept.value_proposition}
                                </p>
                              </div>

                              <div>
                                <span className="font-semibold">
                                  Key Messages:
                                </span>
                                <ul className="list-disc list-inside text-sm mt-1 space-y-1">
                                  {concept.key_messages.map((message, idx) => (
                                    <li key={idx}>{message}</li>
                                  ))}
                                </ul>
                              </div>

                              <div>
                                <span className="font-semibold">
                                  Recommended Channels:
                                </span>
                                <div className="flex flex-wrap gap-1 mt-1">
                                  {concept.channels.map((channel, idx) => (
                                    <span
                                      key={idx}
                                      className="badge badge-accent badge-sm"
                                    >
                                      {channel}
                                    </span>
                                  ))}
                                </div>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                <div>
                                  <span className="font-semibold">Tone:</span>
                                  <p className="text-sm mt-1">{concept.tone}</p>
                                </div>
                                <div>
                                  <span className="font-semibold">
                                    Call to Action:
                                  </span>
                                  <p className="text-sm mt-1">
                                    {concept.call_to_action}
                                  </p>
                                </div>
                              </div>

                              <div className="text-xs text-base-content/60 mt-2">
                                Created:{' '}
                                {new Date(
                                  concept.created_at,
                                ).toLocaleDateString()}
                              </div>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
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
                      <span>
                        No marketing concepts generated for this audience yet.
                      </span>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
