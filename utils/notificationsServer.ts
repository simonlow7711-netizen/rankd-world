import {
  revalidatePath
} from "next/cache"


import {
  createSupabaseServerClient
} from "@/utils/supabaseServer"


import type {
  Notification
} from "@/utils/notifications"


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


export async function getServerNotifications(
  userId: string
): Promise<Notification[]> {

  if (
    !userId
  ) {

    return []

  }


  const supabase =
    await createSupabaseServerClient()


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


export async function markServerNotificationAsRead(
  notificationId: string
) {

  if (
    !notificationId
  ) {

    return

  }


  const supabase =
    await createSupabaseServerClient()


  const {
    data: {
      user
    }
  } =
    await supabase.auth.getUser()


  if (
    !user
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

      .eq(
        "recipient_user_id",
        user.id
      )


  if (
    error
  ) {

    throw error

  }


  revalidatePath(
    "/notifications"
  )

}


export async function markAllServerNotificationsAsRead(
  userId: string
) {

  if (
    !userId
  ) {

    return

  }


  const supabase =
    await createSupabaseServerClient()


  const {
    data: {
      user
    }
  } =
    await supabase.auth.getUser()


  if (
    !user
  ) {

    return

  }


  if (
    user.id !==
    userId
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
        user.id
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


  revalidatePath(
    "/notifications"
  )

}