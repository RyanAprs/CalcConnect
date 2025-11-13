export interface Profile {
  id: string
  username: string
  created_at: string
}

export interface Discussion {
  id: string
  starting_number: number
  author_id: string
  created_at: string
  profiles: Profile
}

export interface Operation {
  id: string
  discussion_id: string
  parent_id: string | null
  author_id: string
  operation_type: "add" | "subtract" | "multiply" | "divide"
  right_operand: number
  result: number
  created_at: string
  profiles: Profile
  replies?: Operation[]
}

export interface DiscussionWithOperations extends Discussion {
  operations: Operation[]
}
