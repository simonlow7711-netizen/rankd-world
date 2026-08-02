export interface ConversationNode {
  id: string
  title: string
  parentId: string | null
  rootId: string | null
  creator?: string
  children: ConversationNode[]
}

export function buildConversationTree(
  rankings: Omit<ConversationNode, "children">[]
): ConversationNode[] {

  const nodeMap = new Map<string, ConversationNode>()

  // Create every node
  rankings.forEach((ranking) => {
    nodeMap.set(ranking.id, {
      ...ranking,
      children: [],
    })
  })

  const roots: ConversationNode[] = []

  // Link parents and children
  nodeMap.forEach((node) => {

    if (
      node.parentId &&
      nodeMap.has(node.parentId)
    ) {

      nodeMap
        .get(node.parentId)!
        .children
        .push(node)

    } else {

      roots.push(node)

    }

  })

  // Sort children recursively
  function sortTree(nodes: ConversationNode[]) {

    nodes.sort((a, b) =>
      a.title.localeCompare(b.title)
    )

    nodes.forEach(node =>
      sortTree(node.children)
    )

  }

  sortTree(roots)

  return roots

}