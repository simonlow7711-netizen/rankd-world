"use client"

import {
  useEffect,
  useState
} from "react"

import {
  useRouter
} from "next/navigation"

import {
  supabase
} from "@/utils/supabase"


export default function OnboardingPage() {

  const router =
    useRouter()


  const [
    displayName,
    setDisplayName
  ] =
    useState("")


  const [
    username,
    setUsername
  ] =
    useState("")


  const [
    message,
    setMessage
  ] =
    useState("")


  const [
    loading,
    setLoading
  ] =
    useState(false)


  const [
    loadingProfile,
    setLoadingProfile
  ] =
    useState(true)


  useEffect(() => {

    async function loadProfile() {

      const {
        data: {
          user
        }
      } =
        await supabase.auth.getUser()


      if (!user) {

        setLoadingProfile(false)

        return

      }


      const {
        data: profile,
        error
      } =
        await supabase
          .from("profiles")
          .select(
            "username,display_name"
          )
          .eq(
            "id",
            user.id
          )
          .maybeSingle()


      if (error) {

        console.error(
          "PROFILE LOAD ERROR:",
          error
        )

        setMessage(
          error.message
        )

        setLoadingProfile(false)

        return

      }


      if (profile) {

        setDisplayName(
          profile.display_name ?? ""
        )

        setUsername(
          profile.username ?? ""
        )

      }


      setLoadingProfile(false)

    }


    loadProfile()

  }, [])


  async function createProfile() {

    setMessage("")


    const cleanUsername =
      username
        .toLowerCase()
        .trim()
        .replace(
          /[^a-z0-9]/g,
          ""
        )


    if (
      !displayName.trim()
    ) {

      setMessage(
        "Please add your name"
      )

      return

    }


    if (
      cleanUsername.length < 3
    ) {

      setMessage(
        "Username must be at least 3 characters"
      )

      return

    }


    setLoading(true)


    /*
      Get the current authenticated user.

      If no user exists, create the anonymous
      Supabase identity that will own this profile.
    */


    let {
      data: {
        user
      }
    } =
      await supabase.auth.getUser()


    if (!user) {

      const {
        data,
        error
      } =
        await supabase.auth.signInAnonymously()


      if (error) {

        console.error(
          "AUTH ERROR:",
          error
        )

        setMessage(
          error.message
        )

        setLoading(false)

        return

      }


      user =
        data.user

    }


    if (!user) {

      setMessage(
        "Unable to create account"
      )

      setLoading(false)

      return

    }


    /*
      Check whether this authenticated user
      already has a profile.
    */


    const {
      data: currentProfile,
      error: currentProfileError
    } =
      await supabase
        .from("profiles")
        .select(
          "id,username,display_name"
        )
        .eq(
          "id",
          user.id
        )
        .maybeSingle()


    if (currentProfileError) {

      console.error(
        "CURRENT PROFILE ERROR:",
        currentProfileError
      )

      setMessage(
        currentProfileError.message
      )

      setLoading(false)

      return

    }


    /*
      Check whether the requested username
      belongs to somebody else.
    */


    const {
      data: existing,
      error: existingError
    } =
      await supabase
        .from("profiles")
        .select(
          "id"
        )
        .eq(
          "username",
          cleanUsername
        )
        .maybeSingle()


    if (existingError) {

      console.error(
        existingError
      )

      setMessage(
        existingError.message
      )

      setLoading(false)

      return

    }


    if (
      existing &&
      existing.id !== user.id
    ) {

      setMessage(
        "Username already taken"
      )

      setLoading(false)

      return

    }


    /*
      Claim or update the current RANKD identity.

      The profile ID remains the Supabase Auth user ID.
      Existing rankings therefore remain owned by the
      same identity.
    */


    const {
      error
    } =
      await supabase
        .from("profiles")
        .upsert({

          id: user.id,

          username: cleanUsername,

          display_name:
            displayName.trim()

        })


    if (error) {

      console.error(
        "PROFILE ERROR:",
        error
      )

      setMessage(
        error.message
      )

      setLoading(false)

      return

    }


    router.push(
      "/explore"
    )

  }


  return (

    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        text-black
        px-6
        py-10
        md:py-16
      "
    >

      <div
        className="
          mx-auto
          flex
          min-h-[calc(100vh-5rem)]
          max-w-4xl
          items-center
          justify-center
          md:min-h-[calc(100vh-8rem)]
        "
      >

        <section
          className="
            relative
            w-full
            overflow-hidden
            rounded-[28px]
            border
            border-black/[0.06]
            bg-white/30
            px-7
            py-9
            md:px-12
            md:py-12
          "
        >

          <div
            className="
              pointer-events-none
              absolute
              -right-8
              -top-12
              select-none
              text-[12rem]
              font-black
              leading-none
              tracking-[-0.15em]
              text-[#FF6B35]/[0.07]
              md:-right-2
              md:-top-16
              md:text-[18rem]
            "
            aria-hidden="true"
          >
            7
          </div>


          <div
            className="
              relative
              z-10
              mx-auto
              max-w-2xl
            "
          >

            <p
              className="
                text-xs
                font-black
                uppercase
                tracking-[0.2em]
                text-black/40
              "
            >
              RANKD / IDENTITY
            </p>


            <h1
              className="
                mt-5
                max-w-2xl
                text-5xl
                font-black
                leading-[0.94]
                tracking-[-0.055em]
                md:text-7xl
              "
            >
              Claim your
              <br />
              RANKD identity.
            </h1>


            <p
              className="
                mt-6
                max-w-xl
                text-lg
                font-bold
                leading-relaxed
                tracking-[-0.02em]
                text-black/60
                md:text-xl
              "
            >
              Choose the name that will own your rankings.
              Claim the identity behind your taste.
            </p>


            <div
              className="
                mt-10
                space-y-4
              "
            >

              <div>

                <label
                  htmlFor="display-name"
                  className="
                    mb-2
                    block
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-black/45
                  "
                >
                  Display name
                </label>


                <input
                  id="display-name"
                  className="
                    w-full
                    rounded-2xl
                    border
                    border-black/[0.08]
                    bg-[#F7F4EE]
                    px-5
                    py-4
                    text-lg
                    font-bold
                    text-black
                    outline-none
                    transition
                    placeholder:text-black/25
                    focus:border-black/25
                    focus:bg-white
                  "
                  placeholder="Your name"
                  value={
                    displayName
                  }
                  onChange={
                    e =>
                      setDisplayName(
                        e.target.value
                      )
                  }
                  disabled={
                    loadingProfile
                  }
                />

              </div>


              <div>

                <label
                  htmlFor="username"
                  className="
                    mb-2
                    block
                    text-xs
                    font-black
                    uppercase
                    tracking-[0.16em]
                    text-black/45
                  "
                >
                  Username
                </label>


                <div
                  className="
                    flex
                    items-center
                    rounded-2xl
                    border
                    border-black/[0.08]
                    bg-[#F7F4EE]
                    px-5
                    transition
                    focus-within:border-black/25
                    focus-within:bg-white
                  "
                >

                  <span
                    className="
                      text-lg
                      font-black
                      text-black/30
                    "
                  >
                    @
                  </span>


                  <input
                    id="username"
                    className="
                      min-w-0
                      flex-1
                      bg-transparent
                      px-2
                      py-4
                      text-lg
                      font-bold
                      text-black
                      outline-none
                      placeholder:text-black/25
                    "
                    placeholder="username"
                    value={
                      username
                    }
                    onChange={
                      e =>
                        setUsername(
                          e.target.value
                        )
                    }
                    disabled={
                      loadingProfile
                    }
                  />

                </div>

              </div>

            </div>


            {
              message && (

                <div
                  className="
                    mt-5
                    rounded-2xl
                    border
                    border-[#FF6B35]/20
                    bg-[#FF6B35]/[0.08]
                    px-5
                    py-4
                  "
                >

                  <p
                    className="
                      text-sm
                      font-black
                      text-black/70
                    "
                  >
                    {message}
                  </p>

                </div>

              )
            }


            <div
              className="
                mt-8
                flex
                flex-wrap
                items-center
                gap-4
              "
            >

              <button
                onClick={
                  createProfile
                }
                disabled={
                  loading ||
                  loadingProfile
                }
                className="
                  inline-flex
                  items-center
                  justify-center
                  rounded-full
                  bg-black
                  px-8
                  py-4
                  text-sm
                  font-black
                  text-white
                  transition
                  hover:bg-[#FF6B35]
                  hover:text-black
                  disabled:cursor-not-allowed
                  disabled:opacity-40
                "
              >

                {
                  loading
                    ? "Claiming..."
                    : "Claim Identity →"
                }

              </button>


              <p
                className="
                  text-xs
                  font-bold
                  text-black/35
                "
              >
                Your rankings stay yours.
              </p>

            </div>

          </div>

        </section>

      </div>

    </main>

  )

}