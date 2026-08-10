"use client"

import {
  useState
} from "react"

import {
  useRouter
} from "next/navigation"

import type {
  ConversationNode
} from "@/utils/conversationTree"


interface ConversationTreeProps {

  nodes: ConversationNode[]

  currentId: string

}


export default function ConversationTree({

  nodes,

  currentId

}: ConversationTreeProps) {


  const router =
    useRouter()


  function TreeNode({

    node,

    depth = 0

  }: {

    node: ConversationNode

    depth?: number

  }) {


    const [
      expanded,
      setExpanded
    ] =
      useState(true)


    const isCurrent =
      node.id === currentId


    const hasChildren =
      node.children.length > 0


    const isRoot =
      node.parentId === null


    return (

      <div
        className="
          relative
        "
      >

        {depth > 0 && (

          <div
            className="
              absolute
              left-[-18px]
              top-[-12px]
              bottom-0
              w-px
              bg-white/20
            "
          />

        )}


        {depth > 0 && (

          <div
            className="
              absolute
              left-[-18px]
              top-7
              w-4
              h-px
              bg-white/20
            "
          />

        )}


        <div

          className={`

            relative

            rounded-2xl

            p-4

            transition

            ${
              isCurrent

                ? `
                  bg-white
                  text-black
                  shadow-sm
                `

                : `
                  bg-zinc-800
                  text-white
                  border
                  border-white/10
                  hover:bg-zinc-700
                `
            }

          `}

          style={{

            marginLeft:
              depth * 24

          }}

        >

          <div
            className="
              flex
              items-center
              justify-between
              gap-4
            "
          >

            <button

              type="button"

              onClick={() =>
                router.push(
                  `/rank/${node.id}`
                )
              }

              className="
                min-w-0
                flex-1
                text-left
                font-black
                hover:opacity-80
                transition
              "

            >

              <span
                className="
                  block
                  text-xs
                  uppercase
                  tracking-widest
                  opacity-60
                  mb-1
                "
              >

                {
                  isRoot

                    ? "Original RANKD"

                    : "Different perspective"
                }

              </span>


              <span
                className="
                  block
                "
              >

                {node.title}

              </span>

            </button>


            {hasChildren && (

              <button

                type="button"

                onClick={() =>
                  setExpanded(
                    current =>
                      !current
                  )
                }

                className={`
                  shrink-0
                  rounded-xl
                  px-3
                  py-2
                  text-sm
                  font-bold
                  transition
                  ${
                    isCurrent

                      ? `
                        bg-black/5
                        text-black/60
                        hover:bg-black/10
                        hover:text-black
                      `

                      : `
                        bg-white/5
                        text-white/70
                        hover:bg-white/10
                        hover:text-white
                      `
                  }
                `}

              >

                {expanded
                  ? "▼"
                  : "▶"
                }

                {" "}

                {node.children.length}

                {" "}

                {
                  node.children.length === 1
                    ? "perspective"
                    : "perspectives"
                }

              </button>

            )}

          </div>


          {isCurrent && (

            <p
              className="
                mt-2
                text-xs
                font-bold
                text-black/60
              "
            >

              You are here

            </p>

          )}

        </div>


        {expanded && hasChildren && (

          <div
            className="
              relative
              mt-2
            "
          >

            {node.children.map(

              child => (

                <TreeNode

                  key={
                    child.id
                  }

                  node={
                    child
                  }

                  depth={
                    depth + 1
                  }

                />

              )

            )}

          </div>

        )}

      </div>

    )

  }


  if (
    nodes.length === 0
  ) {

    return null

  }


  return (

    <div
      className="
        bg-zinc-900
        text-white
        rounded-3xl
        p-6
        border
        border-black/10
      "
    >

      <div
        className="
          mb-5
        "
      >

        <p
          className="
            text-xs
            uppercase
            tracking-widest
            font-black
            text-white/50
          "
        >

          RANKD debate

        </p>


        <h2
          className="
            text-2xl
            font-black
            mt-1
          "
        >

          🌎 Conversation

        </h2>


        <p
          className="
            mt-2
            text-sm
            text-white/60
          "
        >

          Every remix adds another
          perspective to the original.

        </p>

      </div>


      <div
        className="
          space-y-2
          pl-1
        "
      >

        {nodes.map(

          node => (

            <TreeNode

              key={
                node.id
              }

              node={
                node
              }

            />

          )

        )}

      </div>

    </div>

  )

}