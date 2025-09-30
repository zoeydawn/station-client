import { Audience } from './audience'

export interface Concept {
  id: number
  title: string
  description: string
  value_proposition: string
  key_messages: string[]
  channels: string[]
  tone: string
  call_to_action: string
  audience_id: string
  created_at: string
}

export interface AudienceWithConcepts extends Audience {
  concepts: Concept[]
}
