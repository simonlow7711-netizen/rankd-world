"use client"


import {
  FormEvent,
  useState
} from "react"


import Link from "next/link"


import {
  submitContactMessage
} from "@/utils/contactMessages"


export default function ContactPage() {

  const [
    message,
    setMessage
  ] = useState("")


  const [
    email,
    setEmail
  ] = useState("")


  const [
    submitting,
    setSubmitting
  ] = useState(false)


  const [
    submitted,
    setSubmitted
  ] = useState(false)


  const [
    error,
    setError
  ] = useState("")


  async function handleSubmit(
    event: FormEvent<HTMLFormElement>
  ) {

    event.preventDefault()


    setError("")


    if (
      !message.trim()
    ) {

      setError(
        "Please enter a message."
      )

      return

    }


    setSubmitting(
      true
    )


    try {

      const pageUrl =
        typeof window !== "undefined"
          ? document.referrer ||
            window.location.href
          : undefined


      await submitContactMessage({

        message,

        email,

        pageUrl

      })


      setSubmitted(
        true
      )


      setMessage("")

      setEmail("")

    }

    catch (
      submissionError
    ) {

      console.error(
        submissionError
      )


      setError(
        submissionError instanceof Error
          ? submissionError.message
          : "Something went wrong. Please try again."
      )

    }

    finally {

      setSubmitting(
        false
      )

    }

  }


  return (

    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        px-6
        py-16
        md:py-24
      "
    >

      <div
        className="
          max-w-2xl
          mx-auto
        "
      >

        <Link
          href="/"
          className="
            text-sm
            font-bold
            hover:opacity-60
            transition
          "
        >

          ← Back to RANKD

        </Link>


        <div
          className="
            mt-12
          "
        >

          <p
            className="
              uppercase
              tracking-[0.3em]
              text-sm
              font-black
            "
          >

            Contact RANKD

          </p>


          <h1
            className="
              mt-4
              text-5xl
              md:text-7xl
              font-black
              leading-none
            "
          >

            Tell us what
            <br />
            you think.

          </h1>


          <p
            className="
              mt-6
              text-lg
              text-black/60
              max-w-xl
            "
          >

            Something not working?
            Have an idea?
            Found something you love?
            We'd love to hear from you.

          </p>

        </div>


        {
          submitted ? (

            <div
              className="
                mt-12
                rounded-[32px]
                bg-white
                p-8
                md:p-10
                shadow-sm
              "
            >

              <div
                className="
                  text-5xl
                  font-black
                "
              >

                Thanks.

              </div>


              <p
                className="
                  mt-4
                  text-lg
                  text-black/60
                "
              >

                Your message has been sent
                to the RANKD team.

              </p>


              <Link
                href="/"
                className="
                  inline-block
                  mt-8
                  bg-black
                  text-white
                  px-7
                  py-4
                  rounded-full
                  font-black
                  hover:opacity-80
                  transition
                "
              >

                Back to RANKD

              </Link>

            </div>

          ) : (

            <form
              onSubmit={
                handleSubmit
              }
              className="
                mt-12
                rounded-[32px]
                bg-white
                p-8
                md:p-10
                shadow-sm
              "
            >

              <div>

                <label
                  htmlFor="message"
                  className="
                    block
                    text-sm
                    font-black
                  "
                >

                  What's on your mind?

                </label>


                <textarea
                  id="message"
                  value={message}
                  onChange={
                    event =>
                      setMessage(
                        event.target.value
                      )
                  }
                  rows={8}
                  required
                  placeholder="
Tell us anything. Feedback, ideas, problems, suggestions...
"
                  className="
                    mt-3
                    w-full
                    rounded-2xl
                    border
                    border-black/10
                    bg-[#F7F4EE]
                    px-5
                    py-4
                    text-base
                    outline-none
                    focus:border-black/30
                    resize-y
                  "
                />

              </div>


              <div
                className="
                  mt-6
                "
              >

                <label
                  htmlFor="email"
                  className="
                    block
                    text-sm
                    font-black
                  "
                >

                  Email

                  <span
                    className="
                      ml-2
                      font-normal
                      text-black/40
                    "
                  >

                    optional

                  </span>

                </label>


                <input
                  id="email"
                  type="email"
                  value={email}
                  onChange={
                    event =>
                      setEmail(
                        event.target.value
                      )
                  }
                  placeholder="
Your email, if you'd like us to reply
"
                  className="
                    mt-3
                    w-full
                    rounded-2xl
                    border
                    border-black/10
                    bg-[#F7F4EE]
                    px-5
                    py-4
                    text-base
                    outline-none
                    focus:border-black/30
                  "
                />

              </div>


              {
                error && (

                  <p
                    className="
                      mt-5
                      text-sm
                      font-bold
                      text-red-600
                    "
                  >

                    {error}

                  </p>

                )
              }


              <button
                type="submit"
                disabled={
                  submitting
                }
                className="
                  mt-8
                  w-full
                  bg-black
                  text-white
                  px-7
                  py-4
                  rounded-full
                  font-black
                  hover:opacity-80
                  transition
                  disabled:opacity-40
                  disabled:cursor-not-allowed
                "
              >

                {
                  submitting
                    ? "Sending..."
                    : "Send message"
                }

              </button>

            </form>

          )
        }

      </div>

    </main>

  )

}