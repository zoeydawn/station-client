'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import type { AudienceFormData } from '@/types/audience'

const AGE_RANGES = ['18-24', '25-34', '35-44', '45-54', '55-64', '65+']

const INCOME_RANGES = [
  'Under $25k',
  '$25k-$50k',
  '$50k-$75k',
  '$75k-$100k',
  '$100k-$150k',
  '$150k+',
]

const INTEREST_OPTIONS = [
  'Technology',
  'Health & Fitness',
  'Travel',
  'Food & Dining',
  'Fashion',
  'Sports',
  'Entertainment',
  'Education',
  'Finance',
  'Home & Garden',
  'Arts & Culture',
  'Gaming',
  'Sustainability',
  'Business',
]

export default function AudienceForm() {
  const router = useRouter()
  const [formData, setFormData] = useState<AudienceFormData>({
    name: '',
    ageRange: '',
    location: '',
    income: '',
    interests: [],
    painPoints: '',
    goals: '',
  })
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleInterestToggle = (interest: string) => {
    setFormData((prev) => ({
      ...prev,
      interests: prev.interests.includes(interest)
        ? prev.interests.filter((i) => i !== interest)
        : [...prev.interests, interest],
    }))
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsSubmitting(true)

    try {
      const response = await fetch('/api/audience', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) throw new Error('Failed to create audience')

      console.log('Audience created successfully')

      // Redirect to concepts page
      router.push('/concepts')
    } catch (error) {
      console.error('Error submitting form:', error)
      // TODO: Handle error and display error message to client
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid =
    formData.name &&
    formData.ageRange &&
    formData.location &&
    formData.income &&
    formData.interests.length > 0

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Audience Name */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Audience Name</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Tech-Savvy Millennials"
          className="input input-bordered"
          value={formData.name}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, name: e.target.value }))
          }
          required
        />
      </div>

      {/* Demographics Section */}
      <div className="divider">Demographics</div>

      {/* Age Range */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Age Range</span>
        </label>
        <select
          className="select select-bordered"
          value={formData.ageRange}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, ageRange: e.target.value }))
          }
          required
        >
          <option value="">Select age range</option>
          {AGE_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>

      {/* Location */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Location</span>
        </label>
        <input
          type="text"
          placeholder="e.g., Urban US, Rural Canada, Global"
          className="input input-bordered"
          value={formData.location}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, location: e.target.value }))
          }
          required
        />
      </div>

      {/* Income */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Income Range</span>
        </label>
        <select
          className="select select-bordered"
          value={formData.income}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, income: e.target.value }))
          }
          required
        >
          <option value="">Select income range</option>
          {INCOME_RANGES.map((range) => (
            <option key={range} value={range}>
              {range}
            </option>
          ))}
        </select>
      </div>

      {/* Interests */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Interests</span>
          <span className="label-text-alt">Select all that apply</span>
        </label>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-2">
          {INTEREST_OPTIONS.map((interest) => (
            <label key={interest} className="label cursor-pointer">
              <span className="label-text">{interest}</span>
              <input
                type="checkbox"
                className="checkbox checkbox-primary"
                checked={formData.interests.includes(interest)}
                onChange={() => handleInterestToggle(interest)}
              />
            </label>
          ))}
        </div>
      </div>

      {/* Psychographics Section */}
      <div className="divider">Psychographics</div>

      {/* Pain Points */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Pain Points</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="What challenges or problems does this audience face?"
          value={formData.painPoints}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, painPoints: e.target.value }))
          }
        />
      </div>

      {/* Goals */}
      <div className="form-control">
        <label className="label">
          <span className="label-text font-semibold">Goals & Aspirations</span>
        </label>
        <textarea
          className="textarea textarea-bordered h-24"
          placeholder="What does this audience want to achieve or aspire to?"
          value={formData.goals}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, goals: e.target.value }))
          }
        />
      </div>

      {/* Submit Button */}
      <div className="form-control pt-6">
        <button
          type="submit"
          className={`btn btn-primary btn-lg ${isSubmitting ? 'loading' : ''}`}
          disabled={!isFormValid || isSubmitting}
        >
          {isSubmitting
            ? 'Creating Audience...'
            : 'Create Audience & Generate Concepts'}
        </button>
      </div>
    </form>
  )
}
