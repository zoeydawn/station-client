import { AudienceFormData } from '@/types/audience'

export const mapToDatabase = (formData: AudienceFormData) => ({
  name: formData.name,
  age_range: formData.ageRange,
  location: formData.location,
  income: formData.income,
  interests: formData.interests,
  pain_points: formData.painPoints,
  goals: formData.goals,
})

export const mapFromDatabase = (dbData: any): AudienceFormData => ({
  name: dbData.name,
  ageRange: dbData.age_range,
  location: dbData.location,
  income: dbData.income,
  interests: dbData.interests,
  painPoints: dbData.pain_points,
  goals: dbData.goals,
})
