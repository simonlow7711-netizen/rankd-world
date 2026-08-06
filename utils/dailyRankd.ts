export type DailyRankd = {

  title:string

  category:string

}





export const dailyRankds:DailyRankd[] = [

  {
    title:
      "Top 7 Films Everyone Should Watch",

    category:
      "Film & TV"
  },


  {
    title:
      "Top 7 Foods You Could Eat Forever",

    category:
      "Food & Drink"
  },


  {
    title:
      "Top 7 Cities To Visit",

    category:
      "Travel"
  },


  {
    title:
      "Top 7 Songs Of All Time",

    category:
      "Music"
  },


  {
    title:
      "Top 7 Athletes Ever",

    category:
      "Sport"
  },


  {
    title:
      "Top 7 Inventions That Changed The World",

    category:
      "Technology"
  },


  {
    title:
      "Top 7 Things That Make You Happy",

    category:
      "Lifestyle"
  }

]





export function getDailyRankd(){

  const dayNumber =

    Math.floor(

      Date.now()

      /

      (

        1000 *

        60 *

        60 *

        24

      )

    )


  return dailyRankds[

    dayNumber %

    dailyRankds.length

  ]

}