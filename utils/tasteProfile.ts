export function calculateTasteDNA(
  rankings:any[] = []
){

  const categories:Record<string,number> = {}



  rankings.forEach((ranking)=>{


    const category =

      ranking.category || "General"



    categories[category] =

      (categories[category] || 0) + 1



  })




  return categories

}