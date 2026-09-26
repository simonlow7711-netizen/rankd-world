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
              bg-black/10
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
              bg-black/10
            "
          />

        )}


        <div

          className={`

            relative

            rounded-2xl

            border

            p-4

            transition-all

            duration-200

            ${
              isCurrent

                ? `
                  bg-white
                  text-black
                  border-black/10
                  shadow-sm
                `

                : `
                  bg-[#F7F4EE]
                  text-black
                  border-black/10
                  hover:border-black/20
                  hover:-translate-y-0.5
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
                hover:opacity-70
                transition
              "

            >

              <span
                className={`
                  block
                  mb-1
                  text-[9px]
                  uppercase
                  tracking-[0.2em]
                  font-black
                  ${
                    isCurrent
                      ? "text-[#FF6B35]"
                      : "text-black/45"
                  }
                `}
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
                  leading-tight
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
                  border
                  px-3
                  py-2
                  text-[10px]
                  font-black
                  uppercase
                  tracking-[0.08em]
                  transition
                  ${
                    isCurrent

                      ? `
                        border-black/10
                        bg-black/[0.03]
                        text-black/50
                        hover:bg-black/[0.06]
                        hover:text-black
                      `

                      : `
                        border-black/10
                        bg-white/60
                        text-black/45
                        hover:border-black/20
                        hover:text-black
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
                text-[10px]
                font-bold
                text-black/45
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
        rounded-3xl
        border
        border-black/10
        bg-[#F7F4EE]
        p-6
        text-black
        md:p-7
      "
    >

      <div
        className="
          mb-5
        "
      >

        <p
          className="
            text-[9px]
            uppercase
            tracking-[0.24em]
            font-black
            text-[#FF6B35]
          "
        >

          RANKD debate

        </p>


        <h2
          className="
            mt-1
            text-2xl
            font-black
            tracking-[-0.04em]
          "
        >

          Conversation

        </h2>


        <p
          className="
            mt-2
            max-w-xl
            text-sm
            leading-relaxed
            text-black/50
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