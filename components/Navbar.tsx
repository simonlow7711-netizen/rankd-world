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
  const [unreadCount, setUnreadCount] = useState(0)

  const refreshUnreadCount = useCallback(
    async () => {
      try {
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser()

        if (!user) {
          setUnreadCount(0)
          return
        }

        const count = await getUnreadNotificationCount(user.id)

        setUnreadCount(count)
      } catch {
        setUnreadCount(0)
      }
    },
    []
  )

  useEffect(
    () => {
      refreshUnreadCount()

      const handleVisibilityChange = () => {
        if (document.visibilityState === "visible") {
          refreshUnreadCount()
        }
      }

      const handleFocus = () => {
        refreshUnreadCount()
      }

      document.addEventListener(
        "visibilitychange",
        handleVisibilityChange
      )

      window.addEventListener(
        "focus",
        handleFocus
      )

      return () => {
        document.removeEventListener(
          "visibilitychange",
          handleVisibilityChange
        )

        window.removeEventListener(
          "focus",
          handleFocus
        )
      }
    },
    [
      refreshUnreadCount
    ]
  )

  useEffect(
    () => {
      let channel:
        ReturnType<typeof supabase.channel> | null = null

      const setupRealtime = async () => {
        const {
          data: {
            user
          }
        } = await supabase.auth.getUser()

        if (!user) {
          return
        }

        channel = supabase
          .channel(
            `notifications-${user.id}`
          )
          .on(
            "postgres_changes",
            {
              event: "*",
              schema: "public",
              table: "notifications",
              filter: `user_id=eq.${user.id}`
            },
            () => {
              refreshUnreadCount()
            }
          )
          .subscribe()
      }

      setupRealtime()

      return () => {
        if (channel) {
          supabase.removeChannel(channel)
        }
      }
    },
    [
      refreshUnreadCount
    ]
  )

  return (
    <header
      className="
        sticky
        top-0
        z-50
        border-b
        border-black/[0.06]
        bg-[#F7F4EE]/95
        backdrop-blur-md
      "
    >
      <div
        className="
          relative
          mx-auto
          w-full
          max-w-7xl
          px-4
          py-3
          md:px-6
        "
      >

        <div
          className="
            hidden
            items-center
            justify-between
            md:flex
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


          <nav
            className="
              flex
              items-center
              gap-1
            "
          >

            <Link
              href="/explore"
              className="
                flex
                items-center
                gap-2
                rounded-full
                px-4
                py-2.5
                text-sm
                font-semibold
                text-black/70
                transition
                hover:bg-black/[0.05]
                hover:text-black
              "
            >

              <Compass
                className="h-4 w-4"
              />

              <span>
                Explore
              </span>

            </Link>


            <Link
              href="/categories"
              className="
                flex
                items-center
                gap-2
                rounded-full
                px-4
                py-2.5
                text-sm
                font-semibold
                text-black/70
                transition
                hover:bg-black/[0.05]
                hover:text-black
              "
            >

              <Grid2X2
                className="h-4 w-4"
              />

              <span>
                Categories
              </span>

            </Link>


            <Link
              href="/create"
              className="
                ml-1
                flex
                items-center
                gap-2
                rounded-full
                bg-black
                px-4
                py-2.5
                text-sm
                font-semibold
                text-white
                transition
                hover:bg-black/85
              "
            >

              <Plus
                className="h-4 w-4"
              />

              <span>
                Create
              </span>

            </Link>


            <Link
              href="/profile"
              className="
                flex
                items-center
                gap-2
                rounded-full
                px-4
                py-2.5
                text-sm
                font-semibold
                text-black/70
                transition
                hover:bg-black/[0.05]
                hover:text-black
              "
            >

              <User
                className="h-4 w-4"
              />

              <span>
                Profile
              </span>

            </Link>


            <Link
              href="/notifications"
              className="
                relative
                flex
                items-center
                gap-2
                rounded-full
                px-4
                py-2.5
                text-sm
                font-semibold
                text-black/70
                transition
                hover:bg-black/[0.05]
                hover:text-black
              "
            >

              <Bell
                className="h-4 w-4"
              />

              <span>
                Notifications
              </span>

              {unreadCount > 0 && (
                <span
                  className="
                    flex
                    min-w-5
                    items-center
                    justify-center
                    rounded-full
                    bg-[#FF6B35]
                    px-1.5
                    py-0.5
                    text-[10px]
                    font-bold
                    leading-none
                    text-white
                  "
                >
                  {unreadCount > 99
                    ? "99+"
                    : unreadCount}
                </span>
              )}

            </Link>

          </nav>

        </div>


        <div
          className="
            relative
            flex
            min-h-12
            items-center
            justify-center
            md:hidden
          "
        >

          <Link
            href="/"
            className="
              group
              absolute
              left-1/2
              top-1/2
              flex
              h-12
              w-fit
              -translate-x-1/2
              -translate-y-1/2
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
              "
            >
              RANKD
            </span>

          </Link>

        </div>


        <nav
          className="
            grid
            grid-cols-5
            items-center
            gap-1
            border-t
            border-black/[0.06]
            pt-3
            md:hidden
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
              rounded-xl
              py-2
              text-black/60
              transition
              hover:bg-black/[0.04]
              hover:text-black
            "
          >

            <Compass
              className="h-5 w-5"
            />

            <span
              className="
                text-[10px]
                font-semibold
              "
            >
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
              rounded-xl
              py-2
              text-black/60
              transition
              hover:bg-black/[0.04]
              hover:text-black
            "
          >

            <Grid2X2
              className="h-5 w-5"
            />

            <span
              className="
                text-[10px]
                font-semibold
              "
            >
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
              rounded-xl
              bg-black
              py-2
              text-white
              transition
              hover:bg-black/85
            "
          >

            <Plus
              className="h-5 w-5"
            />

            <span
              className="
                text-[10px]
                font-semibold
              "
            >
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
              rounded-xl
              py-2
              text-black/60
              transition
              hover:bg-black/[0.04]
              hover:text-black
            "
          >

            <Bell
              className="h-5 w-5"
            />

            <span
              className="
                text-[10px]
                font-semibold
              "
            >
              Notifications
            </span>

            {unreadCount > 0 && (
              <span
                className="
                  absolute
                  right-1/2
                  top-0.5
                  flex
                  min-w-4
                  translate-x-5
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FF6B35]
                  px-1
                  py-0.5
                  text-[9px]
                  font-bold
                  leading-none
                  text-white
                "
              >
                {unreadCount > 99
                  ? "99+"
                  : unreadCount}
              </span>
            )}

          </Link>


          <Link
            href="/profile"
            className="
              flex
              flex-col
              items-center
              justify-center
              gap-1
              rounded-xl
              py-2
              text-black/60
              transition
              hover:bg-black/[0.04]
              hover:text-black
            "
          >

            <User
              className="h-5 w-5"
            />

            <span
              className="
                text-[10px]
                font-semibold
              "
            >
              Profile
            </span>

          </Link>

        </nav>

      </div>
    </header>
  )
}