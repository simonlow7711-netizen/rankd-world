export function calculateLivePerspectiveScore(

  ranking:any

){

  const views =

    ranking.views ?? 0





  const debateScore =

    ranking.debateScore ?? 0





  const createdAt =

    ranking.created_at

    ||

    ranking.createdAt





  const ageHours = createdAt

    ?

    Math.max(

      1,

      (

        Date.now()

        -

        new Date(createdAt).getTime()

      )

      /

      (1000 * 60 * 60)

    )

    :

    24





  return (

    views

    +

    debateScore * 10

  )

  /

  ageHours


}