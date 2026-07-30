export function calculateChallenge(

  userRankings: any[],

  otherRankings: any[]

) {


  const challenges:any[] = []




  userRankings.forEach((userRanking)=>{


    otherRankings.forEach((otherRanking)=>{



      const comparisons =

        userRanking.items

          .map((item:any)=>{


            const otherItem =

              otherRanking.items.find(

                (candidate:any)=>

                  candidate.name === item.name

              )



            if(!otherItem)

              return null



            return {


              item:item.name,


              userPosition:item.position,


              otherPosition:otherItem.position,


              difference:

                Math.abs(

                  item.position -

                  otherItem.position

                )


            }


          })

          .filter(Boolean)






      if(comparisons.length === 0)

        return






      comparisons.sort(

        (a:any,b:any)=>

          b.difference -

          a.difference

      )





      const biggestDifference =

        comparisons[0]





      const totalDifference =

        comparisons.reduce(

          (

            total:number,

            item:any

          )=>


            total + item.difference,


          0

        )







      challenges.push({


        ranking:userRanking,


        comparedRanking:otherRanking,


        biggestDifference,


        challengeScore:

          Math.min(

            Math.round(

              (

                totalDifference /

                (userRanking.items.length * 6)

              )

              * 100

            ),

            100

          )


      })



    })



  })








  challenges.sort(

    (a,b)=>

      b.challengeScore -

      a.challengeScore

  )






  return challenges[0] || null


}