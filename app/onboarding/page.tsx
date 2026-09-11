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
        bg-black
        text-white
        px-6
        py-20
      "
    >

      <div
        className="
          max-w-xl
          mx-auto
        "
      >

        <h1
          className="
            text-5xl
            font-black
          "
        >

          Claim your RANKD identity

        </h1>


        <p
          className="
            mt-4
            text-gray-400
          "
        >

          Choose your name and username.
          Your rankings become your taste profile.

        </p>


        <input

          className="
            mt-10
            w-full
            p-4
            rounded-xl
            bg-white
            text-black
            placeholder-gray-500
            outline-none
          "

          placeholder="Display name"

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


        <input

          className="
            mt-4
            w-full
            p-4
            rounded-xl
            bg-white
            text-black
            placeholder-gray-500
            outline-none
          "

          placeholder="Username"

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


        {
          message && (

            <p
              className="
                mt-6
                text-gray-300
                font-bold
              "
            >

              {message}

            </p>

          )
        }


        <button

          onClick={
            createProfile
          }

          disabled={
            loading ||
            loadingProfile
          }

          className="
            mt-8
            bg-white
            text-black
            px-8
            py-4
            rounded-full
            font-black
            disabled:opacity-50
          "
        >

          {
            loading
              ? "Claiming..."
              : "Claim Identity →"
          }

        </button>

      </div>

    </main>

  )

}