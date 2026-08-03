"use client"

import {
  DndContext,
  closestCenter,
  PointerSensor,
  useSensor,
  useSensors,
  DragEndEvent
} from "@dnd-kit/core"

import {
  SortableContext,
  verticalListSortingStrategy,
  useSortable,
  arrayMove
} from "@dnd-kit/sortable"

import {
  CSS
} from "@dnd-kit/utilities"

import { useState } from "react"



interface Item {

  id:string

  name:string

}



function SortableItem({

  item,

  index

}:{

  item:Item

  index:number

}){


  const {

    attributes,

    listeners,

    setNodeRef,

    transform,

    transition

  } = useSortable({

    id:item.id

  })




  const style={

    transform:
      CSS.Transform.toString(transform),

    transition

  }



  return (

    <div

      ref={setNodeRef}

      style={style}

      className="
        flex
        items-center
        gap-4
        bg-white
        rounded-2xl
        p-4
      "

    >

      <button

        {...attributes}

        {...listeners}

        className="
          w-12
          h-12
          rounded-full
          bg-black
          text-white
          font-black
          cursor-grab
        "

      >

        {index+1}

      </button>



      <p className="
        font-bold
        text-lg
      ">

        {item.name}

      </p>


    </div>

  )

}







export default function SortableRankView({

  initialItems

}:{

  initialItems:Item[]

}){



  const [items,setItems] =

    useState(initialItems)






  const sensors=

    useSensors(

      useSensor(

        PointerSensor,

        {

          activationConstraint:{

            distance:5

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

    } = event





    if(

      !over ||

      active.id===over.id

    ){

      return

    }




    const oldIndex=

      items.findIndex(

        item=>

          item.id===active.id

      )




    const newIndex=

      items.findIndex(

        item=>

          item.id===over.id

      )





    setItems(

      arrayMove(

        items,

        oldIndex,

        newIndex

      )

    )


  }







  return (

    <DndContext

      sensors={sensors}

      collisionDetection={closestCenter}

      onDragEnd={handleDragEnd}

    >


      <SortableContext

        items={items.map(

          item=>item.id

        )}

        strategy={verticalListSortingStrategy}

      >


        <div className="
          space-y-4
        ">


          {

            items.map(

              (item,index)=>(


                <SortableItem

                  key={item.id}

                  item={item}

                  index={index}

                />


              )

            )

          }


        </div>


      </SortableContext>


    </DndContext>

  )

}