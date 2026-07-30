import { Ranking } from "@/types/ranking"


export function calculatePerspectiveGap(
  original: Ranking,
  remix: Ranking
) {


  const differences = remix.items.map((remixItem) => {


    const originalItem = original.items.find(
      item => item.name === remixItem.name
    )


    if (!originalItem) {

      return null

    }



    return {

      item: remixItem.name,

      originalPosition: originalItem.position,

      remixPosition: remixItem.position,

      difference: Math.abs(
        originalItem.position - remixItem.position
      )

    }


  }).filter(Boolean)



  return differences.sort(

    (a:any,b:any) =>
      b.difference - a.difference

  )

}