"use client"


import {
  useEffect,
  useState
} from "react"


import Link from "next/link"


import {
  supabase
} from "@/utils/supabase"


import {
  getUnreadNotificationCount
} from "@/utils/notifications"


export default function Navbar() {

  const [
    unreadCount,
    setUnreadCount
  ] = useState(0)


  useEffect(() => {

    let mounted =
      true


    let notificationChannel:
      ReturnType<
        typeof supabase.channel
      > |
      null =
        null


    async function loadUnreadCount() {

      try {

        const {
          data: {
            user
          }
        } =
          await supabase.auth.getUser()


        if (
          !user
        ) {

          if (
            mounted
          ) {

            setUnreadCount(
              0
            )

          }

          return

        }


        const count =
          await getUnreadNotificationCount(
            user.id
          )


        if (
          mounted
        ) {

          setUnreadCount(
            count
          )

        }


        notificationChannel =
          supabase

            .channel(
              `notifications-${user.id}`
            )

            .on(

              "postgres_changes",

              {
                event:
                  "*",

                schema:
                  "public",

                table:
                  "notifications",

                filter:
                  `recipient_user_id=eq.${user.id}`

              },

              async () => {

                try {

                  const updatedCount =
                    await getUnreadNotificationCount(
                      user.id
                    )


                  if (
                    mounted
                  ) {

                    setUnreadCount(
                      updatedCount
                    )

                  }

                }

                catch (
                  error
                ) {

                  console.error(

                    "REFRESH NOTIFICATION COUNT ERROR",

                    error

                  )

                }

              }

            )

            .subscribe(

              status => {

                if (
                  status ===
                  "CHANNEL_ERROR"
                ) {

                  console.error(

                    "NOTIFICATION REALTIME CHANNEL ERROR"

                  )

                }

              }

            )

      }

      catch (
        error
      ) {

        console.error(

          "LOAD NOTIFICATION COUNT ERROR",

          error

        )

      }

    }


    loadUnreadCount()


    return () => {

      mounted =
        false


      if (
        notificationChannel
      ) {

        supabase.removeChannel(
          notificationChannel
        )

      }

    }

  }, [])


  return (

    <nav
      className="
        sticky
        top-0
        z-50
        w-full
        px-4
        md:px-8
        py-4
        bg-[#F7F4EE]/90
        backdrop-blur-md
      "
    >

      <div
        className="
          max-w-7xl
          mx-auto
          bg-white
          rounded-full
          px-5
          md:px-7
          py-3
          shadow-sm
          flex
          items-center
          justify-between
          gap-6
        "
      >

        <Link
          href="/"
          className="
            flex
            flex-col
            shrink-0
            leading-none
          "
        >

          <span
            className="
              text-2xl
              md:text-3xl
              font-black
              tracking-tight
            "
          >

            RANKD

          </span>


          <span
            className="
              mt-1
              text-[9px]
              md:text-[10px]
              font-bold
              tracking-tight
              text-black/50
              whitespace-nowrap
            "
          >

            The world's Top 7 everything.

          </span>

        </Link>


        <div
          className="
            hidden
            md:flex
            items-center
            gap-7
            font-bold
          "
        >

          <Link
            href="/explore"
            className="
              hover:opacity-60
              transition
            "
          >

            Explore

          </Link>


          <Link
            href="/create"
            className="
              hover:opacity-60
              transition
            "
          >

            Create

          </Link>


          <Link
            href="/categories"
            className="
              hover:opacity-60
              transition
            "
          >

            Categories

          </Link>


          <Link
            href="/profile"
            className="
              hover:opacity-60
              transition
            "
          >

            Profile

          </Link>


          <Link
            href="/notifications"
            className="
              relative
              flex
              items-center
              justify-center
              w-10
              h-10
              rounded-full
              hover:bg-black/5
              transition
            "
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
          >

            <span
              className="
                text-xl
                leading-none
              "
              aria-hidden="true"
            >

              🔔

            </span>


            {
              unreadCount > 0 && (

                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-5
                    h-5
                    px-1
                    rounded-full
                    bg-black
                    text-white
                    text-[10px]
                    font-black
                    flex
                    items-center
                    justify-center
                  "
                >

                  {
                    unreadCount > 99
                      ? "99+"
                      : unreadCount
                  }

                </span>

              )
            }

          </Link>

        </div>


        <div
          className="
            md:hidden
            flex
            items-center
            gap-3
          "
        >

          <Link
            href="/explore"
            className="
              text-sm
              font-bold
            "
          >

            Explore

          </Link>


          <Link
            href="/categories"
            className="
              text-sm
              font-bold
            "
          >

            Categories

          </Link>


          <Link
            href="/notifications"
            className="
              relative
              w-10
              h-10
              rounded-full
              flex
              items-center
              justify-center
              text-lg
            "
            aria-label={
              unreadCount > 0
                ? `Notifications, ${unreadCount} unread`
                : "Notifications"
            }
          >

            <span
              aria-hidden="true"
            >

              🔔

            </span>


            {
              unreadCount > 0 && (

                <span
                  className="
                    absolute
                    -top-1
                    -right-1
                    min-w-5
                    h-5
                    px-1
                    rounded-full
                    bg-black
                    text-white
                    text-[10px]
                    font-black
                    flex
                    items-center
                    justify-center
                  "
                >

                  {
                    unreadCount > 99
                      ? "99+"
                      : unreadCount
                  }

                </span>

              )
            }

          </Link>


          <Link
            href="/create"
            className="
              w-10
              h-10
              rounded-full
              bg-black
              text-white
              flex
              items-center
              justify-center
              text-xl
              font-black
            "
            aria-label="Create a RANKD"
          >

            +

          </Link>

        </div>

      </div>

    </nav>

  )

}