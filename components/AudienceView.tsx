'use client'

import { AudienceWithConcepts } from '@/types/concept'
import { useState } from 'react'

type AudienceViewProps = {
  audience: AudienceWithConcepts
}

export const AudienceView = ({ audience }: AudienceViewProps) => {
  const [isGenerating, setIsGenerating] = useState<boolean>(false)
  const [additionalData, setAdditionalData] = useState<string>('')
  const [modelOpen, setModelOpen] = useState<boolean>(false)

  const handleModalClose = () => {
    setModelOpen(false)
    setAdditionalData('')
  }

  const generateNewConcept = async () => {
    try {
      setIsGenerating(true)

      // const response = await fetch('/api/generate-concept', {
      //   method: 'POST',
      //   headers: {
      //     'Content-Type': 'application/json',
      //   },
      //   body: JSON.stringify({
      //     audienceId,
      //     additionalData: additionalData[audienceId] || '',
      //   }),
      // })

      // if (!response.ok) throw new Error('Failed to generate concept')

      // const result = await response.json()

      // Refresh the data to show the new concept
      // await fetchAudiencesWithConcepts()

      // Clear the additional data input
      setAdditionalData('')
    } catch (error) {
      console.error('Error generating concept:', error)
      // You could add a toast notification here
    } finally {
      setIsGenerating(false)
      handleModalClose()
    }
  }

  return (
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
                  <span key={idx} className="badge badge-primary badge-sm">
                    {interest}
                  </span>
                ))}
              </div>
            </div>

            {!!audience.pain_points && (
              <div className="alert alert-warning py-2">
                <strong>Pain Points:</strong> {audience.pain_points}
              </div>
            )}

            {!!audience.goals && (
              <div className="alert alert-success py-2">
                <strong>Goals:</strong> {audience.goals}
              </div>
            )}
          </div>
        </div>

        {/* Concepts Section */}
        <div>
          <div className="flex flex-row justify-between items-center mb-4 ">
            <h3 className="text-xl font-semibold flex items-center gap-2">
              Marketing Concepts
              <div className="badge badge-secondary">
                {audience.concepts?.length || 0}
              </div>
            </h3>

            {/* new concept button */}
            <button
              className="btn btn-primary btn-sm"
              onClick={() => setModelOpen(true)}
            >
              Remix
            </button>
          </div>

          {audience.concepts && audience.concepts.length > 0 ? (
            <div className="space-y-4">
              {audience.concepts.map((concept) => (
                <div key={concept.id} className="card bg-base-200 shadow-md">
                  <div className="card-body p-4">
                    <h4 className="card-title text-lg text-primary mb-3">
                      {concept.title}
                    </h4>

                    <div className="space-y-3">
                      <div>
                        <span className="font-semibold">Description:</span>
                        <p className="text-sm mt-1">{concept.description}</p>
                      </div>

                      <div>
                        <span className="font-semibold">
                          Value Proposition:
                        </span>
                        <p className="text-sm mt-1">
                          {concept.value_proposition}
                        </p>
                      </div>

                      <div>
                        <span className="font-semibold">Key Messages:</span>
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
                          <span className="font-semibold">Call to Action:</span>
                          <p className="text-sm mt-1">
                            {concept.call_to_action}
                          </p>
                        </div>
                      </div>

                      <div className="text-xs text-base-content/60 mt-2">
                        Created:{' '}
                        {new Date(concept.created_at).toLocaleDateString()}
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

          {/* new concept modal */}
          <dialog
            className={`modal ${modelOpen ? 'modal-open' : ''}`}
            onClick={(e) => {
              // Close when clicking backdrop
              if (e.target === e.currentTarget) {
                handleModalClose()
              }
            }}
          >
            <div className="modal-box">
              <div className="mt-6 pt-4 border-t border-base-300">
                <div className="space-y-3">
                  <label className="form-control w-full">
                    <div className="label">
                      <span className="label-text font-semibold">
                        Add additional context to remix a new concept:
                      </span>
                    </div>
                    <textarea
                      className="textarea textarea-bordered h-20 resize-none"
                      placeholder="e.g., Focus on sustainability, target holiday season, emphasize premium quality..."
                      value={additionalData}
                      onChange={(e) => setAdditionalData(e.target.value)}
                    />
                  </label>
                </div>
              </div>
              <div className="modal-action">
                <button
                  onClick={generateNewConcept}
                  disabled={isGenerating || !additionalData}
                  className={`btn btn-primary ${isGenerating ? 'loading' : ''}`}
                >
                  {isGenerating ? (
                    <>
                      <span className="loading loading-spinner loading-xs"></span>
                      Generating...
                    </>
                  ) : (
                    <>
                      <svg
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        strokeWidth={1.5}
                        stroke="currentColor"
                        className="w-4 h-4"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          d="M12 4.5v15m7.5-7.5h-15"
                        />
                      </svg>
                      Generate New Concept
                    </>
                  )}
                </button>

                <button className="btn" onClick={handleModalClose}>
                  Close
                </button>
              </div>
            </div>
          </dialog>
        </div>
      </div>
    </div>
  )
}
