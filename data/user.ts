const USER_KEY = "rankdUser"



export type RankdUser = {

  username: string

  displayName: string

}





export function getUser(): RankdUser {


  if (typeof window === "undefined") {

    return {

      username: "guest",

      displayName: "Guest"

    }

  }



  const existingUser =
    localStorage.getItem(USER_KEY)



  if (existingUser) {

    return JSON.parse(existingUser)

  }



  const id =
    Math.random()
      .toString(36)
      .substring(2,8)



  const newUser: RankdUser = {

    username:
      `rankd_${id}`,

    displayName:
      "New RANKD User"

  }



  localStorage.setItem(

    USER_KEY,

    JSON.stringify(newUser)

  )



  return newUser


}





// Backwards compatibility
// Existing beta components still use this export

export const user = {

  username: "simon",

  displayName: "Simon Low"

}