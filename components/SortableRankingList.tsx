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





export type RankingItem = {

  id:string

  name:string

}







type Props = {

  items:RankingItem[]

  setItems:React.Dispatch<
    React.SetStateAction<RankingItem[]>
  >

}









function SortableItem({

  item,

  index,

  updateItem

}:{

  item:RankingItem

  index:number

  updateItem:(

    id:string,

    value:string

  )=>void

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

      className="
        flex
        items-center
        gap-4
        touch-none
      "

    >





      <button

        {...attributes}

        {...listeners}

        type="button"

        aria-label="Drag to reorder"

        className="
          w-12
          h-12
          rounded-full
          bg-black
          text-white
          text-xl
          font-black
          flex
          items-center
          justify-center
          shrink-0
          cursor-grab
          active:cursor-grabbing
          select-none
          touch-none
        "

      >

        ☰

      </button>








      <div className="
        w-10
        h-10
        rounded-full
        bg-[#E8E2D8]
        flex
        items-center
        justify-center
        font-black
        shrink-0
      ">

        {index + 1}

      </div>








      <input

        value={item.name}

        onChange={e=>

          updateItem(

            item.id,

            e.target.value

          )

        }

        placeholder={`Choice ${index + 1}`}

        className="
          flex-1
          p-4
          rounded-2xl
          bg-[#F7F4EE]
          text-lg
          font-bold
          outline-none
          min-w-0
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

  ] = useState(false)







  useEffect(()=>{


    setHydrated(true)


  },[])







  const sensors = useSensors(



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

    } = event







    if(!over) return






    if(

      active.id === over.id

    ){

      return

    }








    setItems(current=>{


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


    })


  }
    function updateItem(

    id:string,

    value:string

  ){


    setItems(current=>

      current.map(item=>

        item.id === id

        ?

        {

          ...item,

          name:value

        }

        :

        item

      )

    )


  }








  if(!hydrated){


    return (

      <div className="
        space-y-4
      ">


        {items.map((item,index)=>(


          <div

            key={item.id}

            className="
              flex
              items-center
              gap-4
            "

          >

            <div className="
              w-12
              h-12
              rounded-full
              bg-black/10
            " />



            <div className="
              flex-1
              h-14
              rounded-2xl
              bg-[#F7F4EE]
            " />


          </div>


        ))}


      </div>

    )


  }








  return (

    <div>


      <p className="
        text-center
        rankd-muted
        text-sm
        font-bold
        mb-6
      ">

        Hold ☰ and drag to reorder your Top 7

      </p>





      <DndContext

        sensors={sensors}

        collisionDetection={closestCenter}

        onDragEnd={handleDragEnd}

      >



        <SortableContext

          items={items.map(

            item => item.id

          )}

          strategy={verticalListSortingStrategy}

        >



          <div className="
            space-y-4
          ">



            {items.map((item,index)=>(


              <SortableItem

                key={item.id}

                item={item}

                index={index}

                updateItem={updateItem}

              />


            ))}



          </div>



        </SortableContext>



      </DndContext>



    </div>

  )

}