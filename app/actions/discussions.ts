"use server"

import { createClient } from "@/lib/supabase/server"
import { revalidatePath } from "next/cache"

export async function createDiscussion(startingNumber: number) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  const { data, error } = await supabase
    .from("discussions")
    .insert({
      starting_number: startingNumber,
      author_id: user.id,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  return { data }
}

export async function createOperation(
  discussionId: string,
  parentId: string | null,
  operationType: "add" | "subtract" | "multiply" | "divide",
  rightOperand: number,
  leftOperand: number,
) {
  const supabase = await createClient()

  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) {
    return { error: "Not authenticated" }
  }

  // Calculate result
  let result: number
  switch (operationType) {
    case "add":
      result = leftOperand + rightOperand
      break
    case "subtract":
      result = leftOperand - rightOperand
      break
    case "multiply":
      result = leftOperand * rightOperand
      break
    case "divide":
      if (rightOperand === 0) {
        return { error: "Cannot divide by zero" }
      }
      result = leftOperand / rightOperand
      break
  }

  const { data, error } = await supabase
    .from("operations")
    .insert({
      discussion_id: discussionId,
      parent_id: parentId,
      author_id: user.id,
      operation_type: operationType,
      right_operand: rightOperand,
      result,
    })
    .select()
    .single()

  if (error) {
    return { error: error.message }
  }

  revalidatePath("/")
  return { data }
}
