export interface ConversationNode {

  id:string

  title:string

  parentId:string | null

  rootId:string | null

  creator?:string

  createdAt?:string

  children:ConversationNode[]

}


type ConversationNodeInput = Omit<
  ConversationNode,
  "children"
>


export function buildConversationTree(

  rankings:ConversationNodeInput[]

):ConversationNode[] {


  const nodeMap =
    new Map<
      string,
      ConversationNode
    >()


  rankings.forEach(

    ranking => {

      nodeMap.set(

        ranking.id,

        {

          ...ranking,

          children:[]

        }

      )

    }

  )


  const roots:
    ConversationNode[] = []


  nodeMap.forEach(

    node => {

      if (
        node.parentId === null
      ) {

        roots.push(
          node
        )

        return

      }


      const parent =
        nodeMap.get(
          node.parentId
        )


      if (
        parent
      ) {

        parent.children.push(
          node
        )

      }

    }

  )


  function sortTree(

    nodes:ConversationNode[]

  ) {


    nodes.sort(

      (
        a,
        b
      ) => {

        const aTime =
          a.createdAt
            ? new Date(
                a.createdAt
              ).getTime()
            : 0


        const bTime =
          b.createdAt
            ? new Date(
                b.createdAt
              ).getTime()
            : 0


        return (
          aTime -
          bTime
        )

      }

    )


    nodes.forEach(

      node => {

        sortTree(
          node.children
        )

      }

    )

  }


  sortTree(
    roots
  )


  return roots

}