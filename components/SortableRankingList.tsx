"use client"

import {
  useEffect,
  useMemo
} from "react"

import {
  DndContext,
  DragEndEvent,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors
} from "@dnd-kit/core"

import {
  arrayMove,
  SortableContext,
  verticalListSortingStrategy,
  useSortable
} from "@dnd-kit/sortable"

import {
  CSS
} from "@dnd-kit/utilities"







export type RankingItem = {

  id:string

  name:string

}







type SortableRankingListProps = {

  items:RankingItem[]

  setItems:React.Dispatch<
    React.SetStateAction<RankingItem[]>
  >

}







type SortableItemProps = {

  item:RankingItem

  index:number

  updateItem:(
    id:string,
    name:string
  )=>void

}









function SortableItem({

  item,

  index,

  updateItem

}:SortableItemProps){



  const {

    attributes,

    listeners,

    setNodeRef,

    transform,

    transition,

    isDragging

  } = useSortable({

    id:item.id

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

      ref={setNodeRef}

      style={style}

      className={`
        flex
        items-center
        gap-4
        ${isDragging ? "opacity-50" : ""}
      `}

    >



      <button

        {...attributes}

        {...listeners}

        type="button"

        className="
          w-12
          h-12
          rounded-full
          bg-black
          text-white
          font-black
          cursor-grab
          shrink-0
        "

      >

        {index + 1}

      </button>








      <input

        value={item.name ?? ""}

        onChange={(e)=>

          updateItem(

            item.id,

            e.target.value

          )

        }

        placeholder={`Rank #${index + 1}`}

        className="
          flex-1
          p-4
          rounded-2xl
          bg-[#F7F4EE]
          text-lg
          font-bold
          outline-none
        "

      />



    </div>

  )

}









export default function SortableRankingList({

  items,

  setItems

}:SortableRankingListProps){



  const sensors = useSensors(


    useSensor(

      PointerSensor,

      {

        activationConstraint:{

          distance:5

        }

      }

    )


  )








  const itemIds = useMemo(

    ()=>

      items.map(

        item=>item.id

      ),

    [

      items

    ]

  )








  useEffect(()=>{


    if(items.length === 0){


      setItems(

        Array.from(

          {

            length:7

          },

          ()=>({


            id:

              crypto.randomUUID(),


            name:""


          })

        )

      )


    }


  },[items.length,setItems])









  function updateItem(

    id:string,

    name:string

  ){


    setItems(

      current =>

        current.map(

          item =>

            item.id === id

            ?

            {

              ...item,

              name

            }

            :

            item

        )

    )


  }









  function handleDragEnd(

    event:DragEndEvent

  ){


    const {

      active,

      over

    } = event





    if(!over || active.id === over.id){

      return

    }






    setItems(

      current => {


        const oldIndex =

          current.findIndex(

            item=>

              item.id === active.id

          )



        const newIndex =

          current.findIndex(

            item=>

              item.id === over.id

          )





        return arrayMove(

          current,

          oldIndex,

          newIndex

        )


      }

    )


  }









  return (
        <DndContext

      sensors={sensors}

      collisionDetection={closestCenter}

      onDragEnd={handleDragEnd}

    >


      <SortableContext

        items={itemIds}

        strategy={verticalListSortingStrategy}

      >


        <div className="
          space-y-4
        ">


          {items.map(

            (

              item,

              index

            )=>(


              <SortableItem

                key={item.id}

                item={item}

                index={index}

                updateItem={updateItem}

              />


            )


          )}


        </div>


      </SortableContext>


    </DndContext>

  )

}