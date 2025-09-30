import { Audience } from './audience'

export interface Concept {
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

export interface AudienceWithConcepts extends Audience {
  concepts: Concept[]
}
