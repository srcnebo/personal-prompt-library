export interface Prompt {
  id: string
  text: string
  timestamp: number
  source?: string // Optional URL where the prompt was saved from
}