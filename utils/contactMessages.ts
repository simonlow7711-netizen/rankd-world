import {
  supabase
} from "@/utils/supabase"


export type ContactMessageInput = {

  message: string

  email?: string

  pageUrl?: string

}


export async function submitContactMessage(
  input: ContactMessageInput
) {

  const message =
    input.message.trim()


  const email =
    input.email?.trim() ||
    null


  const pageUrl =
    input.pageUrl?.trim() ||
    null


  if (
    !message
  ) {

    throw new Error(
      "Please enter a message."
    )

  }


  const {
    error
  } =
    await supabase

      .from(
        "contact_messages"
      )

      .insert({

        message,

        email,

        page_url:
          pageUrl

      })


  if (
    error
  ) {

    console.error(
      "SUBMIT CONTACT MESSAGE ERROR",
      error
    )

    throw new Error(
      "Unable to send your message."
    )

  }

}