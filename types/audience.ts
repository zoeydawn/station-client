export interface Audience {
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

export interface AudienceFormData {
  name: string
  ageRange: string
  location: string
  income: string
  interests: string[]
  painPoints: string
  goals: string
}
