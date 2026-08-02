"use client"

import { useState } from "react"
import { useRouter } from "next/navigation"

import type { ConversationNode } from "@/utils/conversationTree"



interface ConversationTreeProps {

  nodes: ConversationNode[]

  currentId: string

}







export default function ConversationTree({

  nodes,

  currentId

}:ConversationTreeProps){


  const router = useRouter()






  function TreeNode({

    node,

    depth = 0

  }:{

    node:ConversationNode

    depth?:number

  }){


    const [expanded,setExpanded] =
      useState(true)





    const isCurrent =
      node.id === currentId





    const hasChildren =
      node.children.length > 0








    return (

      <div

        className="
          mt-3
        "

      >


        <div

          className={`

            rounded-2xl

            p-4

            transition

            ${
              isCurrent

              ? "bg-white text-black"

              : "bg-zinc-800 text-white"

            }

          `}

          style={{

            marginLeft:
              depth * 18

          }}

        >


          <div className="

            flex

            justify-between

            items-center

            gap-3

          ">


            <button

              onClick={()=>router.push(
                `/rank/${node.id}`
              )}

              className="
                text-left
                font-black
                flex-1
              "

            >

              {depth > 0 && "↳ "}

              {node.title}


            </button>







            {hasChildren && (

              <button

                onClick={()=>setExpanded(!expanded)}

                className="

                  text-sm

                  opacity-70

                  hover:opacity-100

                "

              >

                {expanded

                  ? "▼"

                  : "▶"

                }

                {" "}

                {node.children.length}

                {" "}

                perspective

                {node.children.length !== 1 && "s"}

              </button>

            )}


          </div>





          {isCurrent && (

            <p className="

              text-xs

              mt-2

              font-bold

              opacity-60

            ">

              You are here

            </p>

          )}



        </div>







        {expanded && hasChildren && (

          <div>


            {node.children.map(child=>(

              <TreeNode

                key={child.id}

                node={child}

                depth={depth + 1}

              />

            ))}


          </div>

        )}



      </div>

    )

  }








  return (

    <div className="

      bg-zinc-900

      rounded-3xl

      p-6

    ">


      <h2 className="

        text-2xl

        font-black

        mb-5

      ">

        🌎 Conversation

      </h2>





      {nodes.map(node=>(

        <TreeNode

          key={node.id}

          node={node}

        />

      ))}



    </div>

  )


}