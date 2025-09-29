export interface Audience {
  id?: string
  name: string
  ageRange: string
  location: string
  income: string
  interests: string[]
  painPoints: string
  goals: string
  createdAt?: string
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
