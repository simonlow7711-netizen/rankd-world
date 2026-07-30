export function calculateTasteDNA(rankings:any[]) {


  const categoryCount:any = {}



  rankings.forEach((ranking)=>{


    const category = ranking.category || "General"


    if(categoryCount[category]){

      categoryCount[category]++

    } else {

      categoryCount[category] = 1

    }


  })





  const tasteDNA = Object.entries(categoryCount)

    .map(([category,count]:any)=>({

      category,

      count

    }))


    .sort((a:any,b:any)=>{

      return b.count - a.count

    })





  const strongestCategory =

    tasteDNA.length > 0

      ? tasteDNA[0].category

      : null





  return {

    tasteDNA,

    strongestCategory,

    totalRankings: rankings.length

  }


}