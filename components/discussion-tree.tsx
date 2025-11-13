import type { Operation } from "@/lib/types"
import { OperationNode } from "./operation-node"

interface DiscussionTreeProps {
  operations: Operation[]
  discussionId: string
  startingNumber: number
}

export function DiscussionTree({ operations, discussionId, startingNumber }: DiscussionTreeProps) {
  // Build tree structure
  const buildTree = (parentId: string | null, leftValue: number): Operation[] => {
    return operations
      .filter((op) => op.parent_id === parentId)
      .map((op) => ({
        ...op,
        replies: buildTree(op.id, op.result),
      }))
  }

  const tree = buildTree(null, startingNumber)

  return (
    <div className="space-y-4">
      {tree.map((operation) => (
        <OperationNode key={operation.id} operation={operation} discussionId={discussionId} level={0} />
      ))}
    </div>
  )
}
