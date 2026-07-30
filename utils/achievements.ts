export function calculateAchievements(rankings:any[]) {


  const achievements = []




  if (rankings.length >= 1) {

    achievements.push({

      title: "⭐ First Choice",

      description:
        "Created your first RANKD."

    })

  }





  if (rankings.length >= 7) {

    achievements.push({

      title: "7️⃣ Lucky Seven",

      description:
        "Created 7 RANKDs."

    })

  }





  const hasRemix = rankings.some(

    ranking => ranking.remixedFrom

  )



  if (hasRemix) {

    achievements.push({

      title: "🔁 Remixer",

      description:
        "Created your first RANKD remix."

    })

  }





  const categories:any = {}



  rankings.forEach((ranking)=>{


    const category =
      ranking.category || "General"


    categories[category] =
      (categories[category] || 0) + 1


  })





  const expertCategory =
    Object.keys(categories).find(

      category =>
        categories[category] >= 7

    )





  if (expertCategory) {

    achievements.push({

      title: "🏆 Category Expert",

      description:
        `Created 7 ${expertCategory} RANKDs.`

    })

  }





  return achievements


}