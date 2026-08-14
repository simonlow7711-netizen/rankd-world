import {
  supabase
} from "@/utils/supabase"


export type Notification = {

  id: string

  recipientUserId: string

  actorUserId: string

  type: string

  rankingId: string | null

  remixRankingId: string | null

  read: boolean

  createdAt: string

}


type CreateRemixNotificationParams = {

  recipientUserId: string

  actorUserId: string

  originalRankingId: string

  remixRankingId: string

}


function mapNotification(
  row: any
): Notification {

  return {

    id:
      row.id,

    recipientUserId:
      row.recipient_user_id,

    actorUserId:
      row.actor_user_id,

    type:
      row.type,

    rankingId:
      row.ranking_id ??
      null,

    remixRankingId:
      row.remix_ranking_id ??
      null,

    read:
      row.read ??
      false,

    createdAt:
      row.created_at

  }

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


export async function getNotifications(
  userId: string
): Promise<Notification[]> {

  if (
    !userId
  ) {

    return []

  }


  const {
    data,
    error
  } =
    await supabase

      .from(
        "notifications"
      )

      .select(
        `
          id,
          recipient_user_id,
          actor_user_id,
          type,
          ranking_id,
          remix_ranking_id,
          read,
          created_at
        `
      )

      .eq(
        "recipient_user_id",
        userId
      )

      .order(
        "created_at",
        {
          ascending:
            false
        }
      )


  if (
    error
  ) {

    throw error

  }


  return (

    data ??
    []

  ).map(

    mapNotification

  )

}


export async function getUnreadNotificationCount(
  userId: string
): Promise<number> {

  if (
    !userId
  ) {

    return 0

  }


  const {
    count,
    error
  } =
    await supabase

      .from(
        "notifications"
      )

      .select(
        "id",
        {
          count:
            "exact",
          head:
            true
        }
      )

      .eq(
        "recipient_user_id",
        userId
      )

      .eq(
        "read",
        false
      )


  if (
    error
  ) {

    throw error

  }


  return (
    count ??
    0
  )

}


export async function markNotificationAsRead(
  notificationId: string
) {

  if (
    !notificationId
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

      .update({

        read:
          true

      })

      .eq(
        "id",
        notificationId
      )


  if (
    error
  ) {

    throw error

  }

}


export async function markAllNotificationsAsRead(
  userId: string
) {

  if (
    !userId
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

      .update({

        read:
          true

      })

      .eq(
        "recipient_user_id",
        userId
      )

      .eq(
        "read",
        false
      )


  if (
    error
  ) {

    throw error

  }

}