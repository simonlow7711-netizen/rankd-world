const SESSION_KEY = "rankdSessionId"


function getSessionId() {

  if (typeof window === "undefined") {
    return null
  }


  let sessionId =
    localStorage.getItem(SESSION_KEY)


  if (!sessionId) {

    sessionId =
      crypto.randomUUID()

    localStorage.setItem(
      SESSION_KEY,
      sessionId
    )

  }


  return sessionId

}



export function trackEvent(
  event: string,
  data = {}
) {

  if (typeof window === "undefined") {
    return
  }


  const existingEvents = JSON.parse(
    localStorage.getItem("rankdEvents") || "[]"
  )


  existingEvents.push({

    event,

    data,

    timestamp:
      new Date().toISOString(),

    sessionId:
      getSessionId(),

    version:
      "beta-1"

  })


  localStorage.setItem(
    "rankdEvents",
    JSON.stringify(existingEvents)
  )


}