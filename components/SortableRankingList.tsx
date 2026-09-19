"use client"

import {
  useEffect,
  useState
} from "react"

import {
  DndContext,
  DragEndEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors
} from "@dnd-kit/core"

import {
  arrayMove,
  SortableContext,
  useSortable,
  verticalListSortingStrategy
} from "@dnd-kit/sortable"

import {
  CSS
} from "@dnd-kit/utilities"

import {
  RankingBuilderItem
} from "@/types/ranking"


type Props = {

  items:
    RankingBuilderItem[]

  setItems:
    React.Dispatch<
      React.SetStateAction<
        RankingBuilderItem[]
      >
    >

}


function SortableItem({

  item,

  index,

  updateRankingItem

}:{

  item:
    RankingBuilderItem

  index:
    number

  updateRankingItem:
    (
      id:string,
      value:string
    ) => void

}){

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition
  } =
    useSortable({
      id:
        item.id
    })


  const style = {

    transform:
      CSS.Transform.toString(
        transform
      ),

    transition

  }


  return (

    <div
      ref={
        setNodeRef
      }
      style={
        style
      }
      className="
        group
        flex
        min-w-0
        items-center
        border-b
        border-black/10
        py-3
        sm:py-4
      "
    >

      <button
        {...attributes}
        {...listeners}
        type="button"
        aria-label={`Move ${
          item.name ||
          `choice ${index + 1}`
        }`}
        className="
          flex
          h-9
          w-7
          shrink-0
          cursor-grab
          touch-none
          select-none
          items-center
          justify-center
          text-lg
          font-black
          leading-none
          text-black/25
          transition
          group-hover:text-black
          active:cursor-grabbing
          sm:h-10
          sm:w-9
        "
      >
        <span
          aria-hidden="true"
          className="
            tracking-[-0.18em]
          "
        >
          ⋮⋮
        </span>
      </button>


      <div
        className="
          flex
          w-12
          shrink-0
          items-center
          text-2xl
          font-black
          leading-none
          text-[#FF6B35]
          sm:w-16
          sm:text-3xl
        "
      >
        {index + 1}
      </div>


      <input
        value={
          item.name
        }
        onChange={
          event =>
            updateRankingItem(
              item.id,
              event.target.value
            )
        }
        placeholder={
          `Choice ${index + 1}`
        }
        aria-label={
          `Choice ${index + 1}`
        }
        className="
          min-w-0
          flex-1
          border-0
          bg-transparent
          px-0
          py-2
          text-lg
          font-bold
          leading-tight
          text-black
          outline-none
          placeholder:text-black/20
          sm:text-xl
          md:text-2xl
        "
      />

    </div>

  )

}


export default function SortableRankingList({

  items,

  setItems

}:Props){

  const [
    hydrated,
    setHydrated
  ] =
    useState(false)


  useEffect(
    () => {

      setHydrated(
        true
      )

    },
    []
  )


  const sensors =
    useSensors(

      useSensor(
        PointerSensor,
        {
          activationConstraint:{
            distance:8
          }
        }
      )

    )


  function handleDragEnd(
    event:DragEndEvent
  ){

    const {
      active,
      over
    } =
      event


    if(!over){

      return

    }


    if(
      active.id ===
      over.id
    ){

      return

    }


    setItems(
      current => {

        const oldIndex =
          current.findIndex(
            item =>
              item.id ===
              active.id
          )

        const newIndex =
          current.findIndex(
            item =>
              item.id ===
              over.id
          )


        if(
          oldIndex === -1
          ||
          newIndex === -1
        ){

          return current

        }


        return arrayMove(
          current,
          oldIndex,
          newIndex
        )

      }
    )

  }


  function updateRankingItem(
    id:string,
    value:string
  ){

    setItems(
      current =>
        current.map(
          item =>
            item.id === id
              ? {
                  ...item,
                  name:value
                }
              : item
        )
    )

  }


  if(!hydrated){

    return (

      <div
        className="
          divide-y
          divide-black/10
        "
      >

        {items.map(
          (
            item,
            index
          ) => (

            <div
              key={
                item.id
              }
              className="
                flex
                items-center
                py-4
              "
            >

              <div
                className="
                  w-7
                  shrink-0
                "
              />

              <div
                className="
                  w-12
                  shrink-0
                  text-2xl
                  font-black
                  text-black/10
                "
              >
                {index + 1}
              </div>

              <div
                className="
                  h-8
                  flex-1
                  bg-black/5
                "
              />

            </div>

          )
        )}

      </div>

    )

  }


  return (

    <div>

      <div
        className="
          mb-4
          flex
          items-center
          justify-between
          text-xs
          font-bold
          text-black/40
        "
      >

        <span>
          1 = your favourite
        </span>

        <span>
          Drag to reorder
        </span>

      </div>


      <DndContext
        sensors={
          sensors
        }
        collisionDetection={
          closestCenter
        }
        onDragEnd={
          handleDragEnd
        }
      >

        <SortableContext
          items={
            items.map(
              item =>
                item.id
            )
          }
          strategy={
            verticalListSortingStrategy
          }
        >

          <div>

            {items.map(
              (
                item,
                index
              ) => (

                <SortableItem
                  key={
                    item.id
                  }
                  item={
                    item
                  }
                  index={
                    index
                  }
                  updateRankingItem={
                    updateRankingItem
                  }
                />

              )
            )}

          </div>

        </SortableContext>

      </DndContext>

    </div>

  )

}