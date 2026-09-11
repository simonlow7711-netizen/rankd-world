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
        border-b
        border-black/[0.06]
        bg-[#F7F4EE]/95
        px-4
        py-3
        backdrop-blur-md
        md:px-8
        md:py-4
      "
    >

      <div
        className="
          mx-auto
          max-w-7xl
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
              group
              relative
              flex
              h-12
              shrink-0
              items-center
              justify-center
              px-1
            "
          >

            <span
              className="
                pointer-events-none
                absolute
                left-1/2
                top-1/2
                -translate-x-1/2
                -translate-y-1/2
                select-none
                text-[5rem]
                font-black
                leading-none
                tracking-[-0.16em]
                text-[#FF6B35]/[0.14]
                transition
                group-hover:text-[#FF6B35]/[0.19]
                md:text-[5.5rem]
              "
              aria-hidden="true"
            >
              7
            </span>


            <span
              className="
                relative
                z-10
                text-2xl
                font-black
                leading-none
                tracking-[-0.065em]
                text-black
                md:text-3xl
              "
            >
              RANKD
            </span>

          </Link>


          <div
            className="
              hidden
              items-center
              gap-1
              md:flex
            "
          >

            <Link
              href="/explore"
              className="
                rounded-full
                px-4
                py-2.5
                text-sm
                font-black
                text-black/75
                transition
                hover:bg-black/[0.04]
                hover:text-[#FF6B35]
              "
            >
              Explore
            </Link>


            <Link
              href="/categories"
              className="
                rounded-full
                px-4
                py-2.5
                text-sm
                font-black
                text-black/75
                transition
                hover:bg-black/[0.04]
                hover:text-[#FF6B35]
              "
            >
              Categories
            </Link>


            <Link
              href="/create"
              className="
                ml-2
                inline-flex
                items-center
                gap-2
                rounded-full
                bg-black
                px-5
                py-2.5
                text-sm
                font-black
                text-white
                transition
                hover:bg-[#FF6B35]
              "
            >

              <Plus
                size={16}
                strokeWidth={3}
                aria-hidden="true"
              />

              Create

            </Link>


            <Link
              href="/profile"
              className="
                ml-1
                inline-flex
                items-center
                gap-2
                rounded-full
                px-4
                py-2.5
                text-sm
                font-black
                text-black/75
                transition
                hover:bg-black/[0.04]
                hover:text-[#FF6B35]
              "
            >

              <User
                size={17}
                strokeWidth={2.5}
                aria-hidden="true"
              />

              Profile

            </Link>


            <Link
              href="/notifications"
              className="
                relative
                ml-1
                flex
                h-10
                w-10
                items-center
                justify-center
                rounded-full
                text-black/70
                transition
                hover:bg-black/[0.04]
                hover:text-[#FF6B35]
              "
              aria-label={
                unreadCount > 0
                  ? `Notifications, ${unreadCount} unread`
                  : "Notifications"
              }
            >

              <Bell
                size={19}
                strokeWidth={2.25}
                aria-hidden="true"
              />


              {
                unreadCount > 0 && (

                  <span
                    className="
                      absolute
                      -right-1
                      -top-1
                      flex
                      min-h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-[#FF6B35]
                      px-1
                      text-[10px]
                      font-black
                      text-white
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
            mt-3
            grid
            grid-cols-5
            items-center
            border-t
            border-black/[0.06]
            pt-2
            md:hidden
          "
        >

          <Link
            href="/explore"
            className="
              flex
              min-h-11
              flex-col
              items-center
              justify-center
              gap-1
              rounded-2xl
              text-[10px]
              font-black
              text-black/65
              transition
              hover:bg-black/[0.04]
              hover:text-[#FF6B35]
            "
          >

            <Compass
              size={19}
              strokeWidth={2.25}
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
              min-h-11
              flex-col
              items-center
              justify-center
              gap-1
              rounded-2xl
              text-[10px]
              font-black
              text-black/65
              transition
              hover:bg-black/[0.04]
              hover:text-[#FF6B35]
            "
          >

            <Grid2X2
              size={19}
              strokeWidth={2.25}
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
              min-h-11
              flex-col
              items-center
              justify-center
              gap-1
              rounded-2xl
              text-[10px]
              font-black
              text-black/65
              transition
              hover:text-[#FF6B35]
            "
            aria-label="Create a RANKD"
          >

            <span
              className="
                flex
                h-9
                w-9
                items-center
                justify-center
                rounded-[12px]
                bg-black
                text-white
                transition
                hover:bg-[#FF6B35]
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
              min-h-11
              flex-col
              items-center
              justify-center
              gap-1
              rounded-2xl
              text-[10px]
              font-black
              text-black/65
              transition
              hover:bg-black/[0.04]
              hover:text-[#FF6B35]
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
                size={19}
                strokeWidth={2.25}
                aria-hidden="true"
              />


              {
                unreadCount > 0 && (

                  <span
                    className="
                      absolute
                      -right-3
                      -top-2
                      flex
                      min-h-5
                      min-w-5
                      items-center
                      justify-center
                      rounded-full
                      bg-[#FF6B35]
                      px-1
                      text-[10px]
                      font-black
                      text-white
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
              min-h-11
              flex-col
              items-center
              justify-center
              gap-1
              rounded-2xl
              text-[10px]
              font-black
              text-black/65
              transition
              hover:bg-black/[0.04]
              hover:text-[#FF6B35]
            "
            aria-label="Profile"
          >

            <User
              size={19}
              strokeWidth={2.25}
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