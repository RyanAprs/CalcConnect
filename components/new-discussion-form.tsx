"use client"

import type React from "react"

import { createDiscussion } from "@/app/actions/discussions"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus } from "lucide-react"
import { useState } from "react"

export function NewDiscussionForm() {
  const [startingNumber, setStartingNumber] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setIsLoading(true)

    const number = Number.parseFloat(startingNumber)
    if (isNaN(number)) {
      setError("Please enter a valid number")
      setIsLoading(false)
      return
    }

    const result = await createDiscussion(number)

    if (result.error) {
      setError(result.error)
    } else {
      setStartingNumber("")
    }
    setIsLoading(false)
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Start a New Discussion</CardTitle>
        <CardDescription>Choose a starting number to begin a calculation tree</CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="starting-number">Starting Number</Label>
            <Input
              id="starting-number"
              type="number"
              step="any"
              value={startingNumber}
              onChange={(e) => setStartingNumber(e.target.value)}
              placeholder="Enter any number..."
              required
            />
          </div>
          {error && <p className="text-sm text-destructive">{error}</p>}
          <Button type="submit" className="w-full" disabled={isLoading}>
            <Plus className="h-4 w-4 mr-2" />
            {isLoading ? "Creating..." : "Start Discussion"}
          </Button>
        </form>
      </CardContent>
    </Card>
  )
}
