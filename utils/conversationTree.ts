export interface ConversationNode {

  id:string

  title:string

  parentId:string | null

  rootId:string | null

  creator?:string

  createdAt?:string

  children:ConversationNode[]

}






export function buildConversationTree(

  rankings:Omit<
    ConversationNode,
    "children"
  >[]

):ConversationNode[] {


  const nodeMap = new Map<
    string,
    ConversationNode
  >()



  rankings.forEach(ranking=>{


    nodeMap.set(

      ranking.id,

      {

        ...ranking,

        children:[]

      }

    )


  })




  const roots:ConversationNode[] = []




  nodeMap.forEach(node=>{


    if(

      node.parentId &&

      nodeMap.has(node.parentId)

    ){


      nodeMap

        .get(node.parentId)!

        .children

        .push(node)


    }

    else{


      roots.push(node)


    }


  })





  function sortTree(

    nodes:ConversationNode[]

  ){


    nodes.sort(

      (a,b)=>

        b.children.length -

        a.children.length

    )



    nodes.forEach(node=>

      sortTree(

        node.children

      )

    )


  }




  sortTree(roots)



  return roots


}