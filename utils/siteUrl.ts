import type {
  Metadata
} from "next"


export const SITE_URL =
  "https://www.rankd.world"


export const indexableRobots: Metadata["robots"] = {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
    "max-image-preview": "large",
    "max-snippet": -1,
    "max-video-preview": -1
  }
}
