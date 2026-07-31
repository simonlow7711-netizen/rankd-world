export function getStoredUserId(){

  if(typeof window === "undefined"){

    return null

  }


  return localStorage.getItem(
    "rankdUserId"
  )

}





export function setStoredUserId(

  id:string

){

  if(typeof window === "undefined"){

    return

  }


  localStorage.setItem(

    "rankdUserId",

    id

  )

}