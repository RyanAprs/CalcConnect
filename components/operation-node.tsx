"use client"

import type { Operation } from "@/lib/types"
import { Card, CardContent } from "@/components/ui/card"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Button } from "@/components/ui/button"
import { Reply } from "lucide-react"
import { useState } from "react"
import { OperationForm } from "./operation-form"
import { formatDistanceToNow } from "date-fns"

interface OperationNodeProps {
  operation: Operation
  discussionId: string
  level: number
}

const operationSymbols = {
  add: "+",
  subtract: "-",
  multiply: "×",
  divide: "÷",
}

export function OperationNode({ operation, discussionId, level }: OperationNodeProps) {
  const [showReplyForm, setShowReplyForm] = useState(false)

  return (
    <div className="space-y-3">
      <Card className={level > 0 ? "ml-8 border-l-2 border-l-primary/20" : ""}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <Avatar className="h-10 w-10">
              <AvatarFallback className="bg-primary/10 text-primary">
                {operation.profiles.username.charAt(0).toUpperCase()}
              </AvatarFallback>
            </Avatar>
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2 mb-2">
                <span className="font-semibold text-sm">{operation.profiles.username}</span>
                <span className="text-xs text-muted-foreground">
                  {formatDistanceToNow(new Date(operation.created_at), { addSuffix: true })}
                </span>
              </div>
              <div className="font-mono text-lg mb-2">
                <span className="text-muted-foreground">Result:</span>{" "}
                <span className="font-bold text-primary">{operation.result}</span>
              </div>
              <div className="text-sm text-muted-foreground font-mono mb-3">
                Operation: {operationSymbols[operation.operation_type]} {operation.right_operand}
              </div>
              <Button variant="ghost" size="sm" onClick={() => setShowReplyForm(!showReplyForm)} className="text-xs">
                <Reply className="h-3 w-3 mr-1" />
                Reply
              </Button>
            </div>
          </div>
          {showReplyForm && (
            <div className="mt-4 pl-13">
              <OperationForm
                discussionId={discussionId}
                parentId={operation.id}
                leftOperand={operation.result}
                onSuccess={() => setShowReplyForm(false)}
              />
            </div>
          )}
        </CardContent>
      </Card>
      {operation.replies && operation.replies.length > 0 && (
        <div className="space-y-3">
          {operation.replies.map((reply) => (
            <OperationNode key={reply.id} operation={reply} discussionId={discussionId} level={level + 1} />
          ))}
        </div>
      )}
    </div>
  )
}
