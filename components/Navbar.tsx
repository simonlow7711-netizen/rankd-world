"use client"


import {
  useCallback,
  useEffect,
  useState
} from "react"


import Link from "next/link"


import {
  Bell,
  Compass,
  Grid2X2,
  Plus,
  User
} from "lucide-react"


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


  const loadUnreadCount =
    useCallback(

      async () => {

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

            setUnreadCount(
              0
            )

            return

          }


          const count =
            await getUnreadNotificationCount(
              user.id
            )


          setUnreadCount(
            count
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

      },

      []

    )


  useEffect(() => {

    let mounted =
      true


    let notificationChannel:
      ReturnType<
        typeof supabase.channel
      > |
      null =
        null


    async function initialiseNotifications() {

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

                if (
                  !mounted
                ) {

                  return

                }


                await loadUnreadCount()

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

          "INITIALISE NOTIFICATIONS ERROR",

          error

        )

      }

    }


    initialiseNotifications()


    function handleVisibilityChange() {

      if (
        document.visibilityState ===
        "visible"
      ) {

        loadUnreadCount()

      }

    }


    function handleWindowFocus() {

      loadUnreadCount()

    }


    document.addEventListener(

      "visibilitychange",

      handleVisibilityChange

    )


    window.addEventListener(

      "focus",

      handleWindowFocus

    )


    return () => {

      mounted =
        false


      document.removeEventListener(

        "visibilitychange",

        handleVisibilityChange

      )


      window.removeEventListener(

        "focus",

        handleWindowFocus

      )


      if (
        notificationChannel
      ) {

        supabase.removeChannel(
          notificationChannel
        )

      }

    }

  }, [

    loadUnreadCount

  ])


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
        "
      >

        <div
          className="
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

              <Bell
                size={20}
                strokeWidth={2}
                aria-hidden="true"
              />


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

        </div>


        <div
          className="
            md:hidden
            mt-4
            pt-3
            border-t
            border-black/10
            grid
            grid-cols-5
            items-center
          "
        >

          <Link
            href="/explore"
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              min-h-12
              text-[11px]
              font-bold
              hover:opacity-60
              transition
            "
          >

            <Compass
              size={20}
              strokeWidth={2}
              aria-hidden="true"
            />

            <span>
              Explore
            </span>

          </Link>


          <Link
            href="/categories"
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              min-h-12
              text-[11px]
              font-bold
              hover:opacity-60
              transition
            "
          >

            <Grid2X2
              size={20}
              strokeWidth={2}
              aria-hidden="true"
            />

            <span>
              Categories
            </span>

          </Link>


          <Link
            href="/create"
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              min-h-12
              text-[11px]
              font-bold
              hover:opacity-60
              transition
            "
            aria-label="Create a RANKD"
          >

            <span
              className="
                w-8
                h-8
                rounded-full
                bg-black
                text-white
                flex
                items-center
                justify-center
              "
            >

              <Plus
                size={20}
                strokeWidth={3}
                aria-hidden="true"
              />

            </span>


            <span>
              Create
            </span>

          </Link>


          <Link
            href="/notifications"
            className="
              relative
              flex
              flex-col
              items-center
              justify-center
              gap-1
              min-h-12
              text-[11px]
              font-bold
              hover:opacity-60
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
                relative
                flex
                items-center
                justify-center
              "
            >

              <Bell
                size={20}
                strokeWidth={2}
                aria-hidden="true"
              />


              {
                unreadCount > 0 && (

                  <span
                    className="
                      absolute
                      -top-2
                      -right-3
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

            </span>


            <span>
              Notifications
            </span>

          </Link>


          <Link
            href="/profile"
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              min-h-12
              text-[11px]
              font-bold
              hover:opacity-60
              transition
            "
            aria-label="Profile"
          >

            <User
              size={20}
              strokeWidth={2}
              aria-hidden="true"
            />

            <span>
              Profile
            </span>

          </Link>

        </div>

      </div>

    </nav>

  )

}