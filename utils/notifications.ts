import {
  supabase
} from "@/utils/supabase"


type CreateRemixNotificationParams = {

  recipientUserId: string

  actorUserId: string

  originalRankingId: string

  remixRankingId: string

}


export async function createRemixNotification(

  {
    recipientUserId,

    actorUserId,

    originalRankingId,

    remixRankingId

  }: CreateRemixNotificationParams

) {

  if (
    !recipientUserId
    ||
    !actorUserId
    ||
    !originalRankingId
    ||
    !remixRankingId
  ) {

    return

  }


  if (
    recipientUserId ===
    actorUserId
  ) {

    return

  }


  const {
    error
  } =
    await supabase

      .from(
        "notifications"
      )

      .insert({

        recipient_user_id:
          recipientUserId,

        actor_user_id:
          actorUserId,

        type:
          "remix",

        ranking_id:
          originalRankingId,

        remix_ranking_id:
          remixRankingId

      })


  if (
    error
  ) {

    if (
      error.code ===
      "23505"
    ) {

      return

    }


    throw error

  }

}