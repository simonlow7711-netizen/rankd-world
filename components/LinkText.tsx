import {
  splitTextLinks
} from "@/utils/linkText"


type LinkTextProps = {
  text: string
}


export default function LinkText({
  text
}: LinkTextProps) {

  return (
    <>
      {
        splitTextLinks(text).map(
          (part, index) =>
            part.type ===
            "url" ? (
              <a
                key={
                  `${part.value}-${index}`
                }
                href={
                  part.value
                }
                target="_blank"
                rel="noopener noreferrer"
                className="
                  break-words
                  font-black
                  text-[#FF6B35]
                  underline
                  decoration-[#FF6B35]
                  decoration-2
                  underline-offset-4
                "
              >
                {part.value}
              </a>
            ) : (
              <span
                key={
                  `text-${index}`
                }
              >
                {part.value}
              </span>
            )
        )
      }
    </>
  )

}
