"use client"

import type React from "react"

import { createOperation } from "@/app/actions/discussions"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { useState } from "react"

interface OperationFormProps {
  discussionId: string
  parentId: string | null
  leftOperand: number
  onSuccess?: () => void
}

export function OperationForm({ discussionId, parentId, leftOperand, onSuccess }: OperationFormProps) {
  const [operationType, setOperationType] = useState<"add" | "subtract" | "multiply" | "divide">("add")
  const [rightOperand, setRightOperand] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const rightValue = Number.parseFloat(rightOperand)
    if (isNaN(rightValue)) {
      setError("Please enter a valid number")
      setIsLoading(false)
      return
    }

    const result = await createOperation(discussionId, parentId, operationType, rightValue, leftOperand)

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
    } else {
      setRightOperand("")
      setIsLoading(false)
      onSuccess?.()
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="flex gap-2">
        <div className="flex-1">
          <Label htmlFor="operation" className="text-xs">
            Operation
          </Label>
          <Select value={operationType} onValueChange={(value: any) => setOperationType(value)}>
            <SelectTrigger id="operation" className="h-9">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="add">Add (+)</SelectItem>
              <SelectItem value="subtract">Subtract (-)</SelectItem>
              <SelectItem value="multiply">Multiply (×)</SelectItem>
              <SelectItem value="divide">Divide (÷)</SelectItem>
            </SelectContent>
          </Select>
        </div>
        <div className="flex-1">
          <Label htmlFor="number" className="text-xs">
            Number
          </Label>
          <Input
            id="number"
            type="number"
            step="any"
            value={rightOperand}
            onChange={(e) => setRightOperand(e.target.value)}
            placeholder="Enter number"
            required
            className="h-9"
          />
        </div>
      </div>
      {error && <p className="text-xs text-destructive">{error}</p>}
      <Button type="submit" size="sm" disabled={isLoading} className="w-full">
        {isLoading ? "Adding..." : "Add Operation"}
      </Button>
    </form>
  )
}
