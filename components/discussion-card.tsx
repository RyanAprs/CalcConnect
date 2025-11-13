"use client"

import type { DiscussionWithOperations } from "@/lib/types"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { MessageSquare, Reply } from "lucide-react"
import { DiscussionTree } from "./discussion-tree"
import { useState } from "react"
import { OperationForm } from "./operation-form"
import { formatDistanceToNow } from "date-fns"

interface DiscussionCardProps {
  discussion: DiscussionWithOperations
}

export function DiscussionCard({ discussion }: DiscussionCardProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)
  const [isExpanded, setIsExpanded] = useState(false)

  return (
    <Card>
      <CardHeader>
        <div className="flex items-start gap-3">
          <Avatar className="h-12 w-12">
            <AvatarFallback className="bg-primary/10 text-primary">
              {discussion.profiles.username.charAt(0).toUpperCase()}
            </AvatarFallback>
          </Avatar>
          <div className="flex-1">
            <div className="flex items-center gap-2 mb-1">
              <span className="font-semibold">{discussion.profiles.username}</span>
              <span className="text-xs text-muted-foreground">
                started {formatDistanceToNow(new Date(discussion.created_at), { addSuffix: true })}
              </span>
            </div>
            <CardTitle className="text-2xl font-mono text-primary">{discussion.starting_number}</CardTitle>
            <p className="text-sm text-muted-foreground mt-1">Starting number</p>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="flex gap-2 mb-4">
          <Button variant="outline" size="sm" onClick={() => setShowReplyForm(!showReplyForm)}>
            <Reply className="h-4 w-4 mr-1" />
            Reply
          </Button>
          {discussion.operations.length > 0 && (
            <Button variant="ghost" size="sm" onClick={() => setIsExpanded(!isExpanded)}>
              <MessageSquare className="h-4 w-4 mr-1" />
              {discussion.operations.length} {discussion.operations.length === 1 ? "operation" : "operations"}
            </Button>
          )}
        </div>

        {showReplyForm && (
          <div className="mb-4 p-4 bg-muted/50 rounded-lg">
            <OperationForm
              discussionId={discussion.id}
              parentId={null}
              leftOperand={discussion.starting_number}
              onSuccess={() => setShowReplyForm(false)}
            />
          </div>
        )}

        {isExpanded && discussion.operations.length > 0 && (
          <div className="mt-4 pt-4 border-t">
            <DiscussionTree
              operations={discussion.operations}
              discussionId={discussion.id}
              startingNumber={discussion.starting_number}
            />
          </div>
        )}
      </CardContent>
    </Card>
  )
}
