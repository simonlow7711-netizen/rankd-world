"use client"

import {
  useState
} from "react"


type SwimmerList = {
  id: number
  title: string
  subtitle: string
  items: string[]
  x: number
  y: number
}


const swimmerLists: SwimmerList[] = [
  {
    id: 1,
    title: "Top 7 London Pubs",
    subtitle: "The places worth crossing town for",
    items: [
      "The Swimmer at the Grafton Arms",
      "The Holly Bush",
      "The Southampton Arms",
      "The Harp",
      "The French House",
      "The Sekforde",
      "The Compton Arms"
    ],
    x: 16,
    y: 56
  },
  {
    id: 2,
    title: "Top 7 Pub Drinks",
    subtitle: "What belongs on the bar",
    items: [
      "London Pride",
      "Neck Oil",
      "Five Points Pale Ale",
      "London Pilsner",
      "A proper gin and tonic",
      "Real cider",
      "A pint of something local"
    ],
    x: 72,
    y: 49
  },
  {
    id: 3,
    title: "Top 7 Pub Foods",
    subtitle: "The things we actually want to eat",
    items: [
      "Fish and chips",
      "Wagyu burger",
      "Sunday roast",
      "Mac and cheese",
      "Pie and mash",
      "Scotch egg",
      "Sticky toffee pudding"
    ],
    x: 43,
    y: 69
  },
  {
    id: 4,
    title: "Top 7 Things About British Pubs",
    subtitle: "The rituals that make them special",
    items: [
      "The pub sign",
      "A proper bar",
      "Sunday lunch",
      "A fireplace",
      "Local characters",
      "A quiz",
      "The first pint"
    ],
    x: 31,
    y: 27
  },
  {
    id: 5,
    title: "Top 7 London Sports",
    subtitle: "The city through sport",
    items: [
      "Football",
      "Cricket",
      "Tennis",
      "Rugby",
      "Swimming",
      "Cycling",
      "Rowing"
    ],
    x: 84,
    y: 25
  },
  {
    id: 6,
    title: "Top 7 Pub Interiors",
    subtitle: "Rooms with character",
    items: [
      "Dark wood",
      "Original features",
      "A proper gantry",
      "Art on the walls",
      "Old mirrors",
      "Red velvet",
      "A good fireplace"
    ],
    x: 55,
    y: 35
  },
  {
    id: 7,
    title: "Top 7 Things To Do In Holloway",
    subtitle: "A local RANKD",
    items: [
      "Explore The Swimmer",
      "Walk Holloway Road",
      "Visit Emirates Stadium",
      "Explore Highbury Fields",
      "Walk to Finsbury Park",
      "Find local independent food",
      "Discover the neighbourhood pubs"
    ],
    x: 67,
    y: 76
  }
]


export default function SwimmerTestPage() {
  const [
    activeList,
    setActiveList
  ] = useState<SwimmerList | null>(
    null
  )


  return (
    <main
      className="
        min-h-screen
        bg-[#F7F4EE]
        text-black
      "
    >
      <section
        className="
          mx-auto
          flex
          min-h-screen
          max-w-[1500px]
          flex-col
          px-4
          py-5
          sm:px-6
          sm:py-8
        "
      >
        <header
          className="
            mb-5
            flex
            items-end
            justify-between
            gap-4
          "
        >
          <div>
            <div
              className="
                flex
                items-center
                gap-2
              "
            >
              <span
                className="
                  flex
                  h-8
                  w-8
                  items-center
                  justify-center
                  rounded-full
                  bg-[#FF6B35]
                  text-lg
                  font-black
                  leading-none
                  text-white
                "
              >
                7
              </span>

              <span
                className="
                  text-lg
                  font-black
                  tracking-[-0.04em]
                "
              >
                RANKD
              </span>
            </div>

            <p
              className="
                mt-2
                text-sm
                font-medium
                text-black/55
              "
            >
              One photo. Seven RANKDs.
            </p>
          </div>

          <div
            className="
              hidden
              text-right
              sm:block
            "
          >
            <p
              className="
                text-xs
                font-bold
                uppercase
                tracking-[0.18em]
                text-black/40
              "
            >
              Test
            </p>

            <p
              className="
                mt-1
                text-sm
                font-semibold
              "
            >
              The Swimmer · Holloway
            </p>
          </div>
        </header>


        <div
          className="
            relative
            flex-1
            overflow-hidden
            rounded-[28px]
            bg-black
            shadow-[0_20px_70px_rgba(0,0,0,0.16)]
          "
        >
          <div
            className="
              absolute
              inset-0
              bg-cover
              bg-center
            "
            style={{
              backgroundImage:
                "url('https://theswimmer.co.uk/wp-content/uploads/sites/15/2024/12/049_SWIMMER_GRAFTON_RMP_220419_ABK.jpg')"
            }}
          />

          <div
            className="
              absolute
              inset-0
              bg-black/10
            "
          />


          <div
            className="
              absolute
              left-5
              top-5
              z-10
              max-w-[280px]
              sm:left-7
              sm:top-7
            "
          >
            <div
              className="
                rounded-2xl
                bg-black/65
                px-4
                py-3
                text-white
                backdrop-blur-md
              "
            >
              <p
                className="
                  text-[11px]
                  font-bold
                  uppercase
                  tracking-[0.18em]
                  text-white/60
                "
              >
                Explore the photograph
              </p>

              <p
                className="
                  mt-1
                  text-sm
                  font-semibold
                  leading-snug
                "
              >
                Seven orange 7s. Seven different RANKDs.
              </p>
            </div>
          </div>


          {
            swimmerLists.map(
              (
                list
              ) => (
                <button
                  key={list.id}
                  type="button"
                  aria-label={
                    `Open ${list.title}`
                  }
                  onClick={() =>
                    setActiveList(
                      list
                    )
                  }
                  className="
                    group
                    absolute
                    z-20
                    -translate-x-1/2
                    -translate-y-1/2
                    outline-none
                  "
                  style={{
                    left:
                      `${list.x}%`,
                    top:
                      `${list.y}%`
                  }}
                >
                  <span
                    className="
                      relative
                      flex
                      h-12
                      w-12
                      items-center
                      justify-center
                      rounded-full
                      border
                      border-white/80
                      bg-[#FF6B35]
                      text-[25px]
                      font-black
                      leading-none
                      text-white
                      shadow-[0_6px_25px_rgba(0,0,0,0.35)]
                      transition
                      duration-200
                      group-hover:scale-125
                      group-focus-visible:scale-125
                      sm:h-14
                      sm:w-14
                      sm:text-[29px]
                    "
                  >
                    7

                    <span
                      className="
                        pointer-events-none
                        absolute
                        -inset-2
                        rounded-full
                        border
                        border-[#FF6B35]/70
                        opacity-0
                        transition
                        duration-200
                        group-hover:scale-110
                        group-hover:opacity-100
                        group-focus-visible:scale-110
                        group-focus-visible:opacity-100
                      "
                    />
                  </span>

                  <span
                    className="
                      pointer-events-none
                      absolute
                      left-1/2
                      top-[calc(100%+10px)]
                      w-max
                      max-w-[190px]
                      -translate-x-1/2
                      rounded-full
                      bg-black/80
                      px-3
                      py-1.5
                      text-[11px]
                      font-bold
                      text-white
                      opacity-0
                      shadow-lg
                      backdrop-blur-sm
                      transition
                      duration-200
                      group-hover:opacity-100
                      group-focus-visible:opacity-100
                    "
                  >
                    {list.title}
                  </span>
                </button>
              )
            )
          }


          <div
            className="
              absolute
              bottom-5
              left-5
              z-10
              sm:bottom-7
              sm:left-7
            "
          >
            <div
              className="
                rounded-full
                bg-white/90
                px-4
                py-2
                text-xs
                font-bold
                text-black
                shadow-lg
                backdrop-blur-md
              "
            >
              Tap a 7
            </div>
          </div>
        </div>


        <footer
          className="
            flex
            items-center
            justify-between
            gap-4
            pt-4
          "
        >
          <p
            className="
              text-xs
              font-medium
              text-black/45
            "
          >
            Test concept · RANKD Visual Discovery
          </p>

          <p
            className="
              text-xs
              font-semibold
              text-black/45
            "
          >
            The Swimmer at the Grafton Arms
          </p>
        </footer>
      </section>


      {
        activeList && (
          <div
            className="
              fixed
              inset-0
              z-50
              flex
              items-end
              justify-center
              bg-black/55
              p-0
              backdrop-blur-sm
              sm:items-center
              sm:p-6
            "
            onClick={() =>
              setActiveList(null)
            }
          >
            <div
              role="dialog"
              aria-modal="true"
              aria-label={
                activeList.title
              }
              onClick={event =>
                event.stopPropagation()
              }
              className="
                w-full
                max-w-[560px]
                overflow-hidden
                rounded-t-[30px]
                bg-[#F7F4EE]
                shadow-[0_30px_100px_rgba(0,0,0,0.3)]
                sm:rounded-[30px]
              "
            >
              <div
                className="
                  flex
                  items-start
                  justify-between
                  gap-5
                  border-b
                  border-black/10
                  px-6
                  py-6
                "
              >
                <div>
                  <div
                    className="
                      mb-4
                      flex
                      h-10
                      w-10
                      items-center
                      justify-center
                      rounded-full
                      bg-[#FF6B35]
                      text-xl
                      font-black
                      text-white
                    "
                  >
                    7
                  </div>

                  <h2
                    className="
                      text-2xl
                      font-black
                      leading-[0.95]
                      tracking-[-0.045em]
                      sm:text-3xl
                    "
                  >
                    {activeList.title}
                  </h2>

                  <p
                    className="
                      mt-2
                      text-sm
                      font-medium
                      text-black/55
                    "
                  >
                    {activeList.subtitle}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() =>
                    setActiveList(null)
                  }
                  aria-label="Close"
                  className="
                    flex
                    h-9
                    w-9
                    shrink-0
                    items-center
                    justify-center
                    rounded-full
                    bg-black/5
                    text-xl
                    leading-none
                    transition
                    hover:bg-black/10
                  "
                >
                  ×
                </button>
              </div>


              <div
                className="
                  px-6
                  pb-6
                  pt-2
                "
              >
                {
                  activeList.items.map(
                    (
                      item,
                      index
                    ) => (
                      <div
                        key={item}
                        className="
                          flex
                          items-center
                          gap-4
                          border-b
                          border-black/8
                          py-4
                          last:border-b-0
                        "
                      >
                        <span
                          className="
                            w-7
                            shrink-0
                            text-sm
                            font-black
                            text-[#FF6B35]
                          "
                        >
                          {index + 1}
                        </span>

                        <span
                          className="
                            text-[15px]
                            font-bold
                            tracking-[-0.01em]
                          "
                        >
                          {item}
                        </span>
                      </div>
                    )
                  )
                }
              </div>


              <div
                className="
                  border-t
                  border-black/10
                  px-6
                  py-5
                "
              >
                <button
                  type="button"
                  onClick={() =>
                    setActiveList(null)
                  }
                  className="
                    w-full
                    rounded-full
                    bg-black
                    px-5
                    py-3
                    text-sm
                    font-bold
                    text-white
                    transition
                    hover:bg-black/85
                  "
                >
                  Back to the photo
                </button>
              </div>
            </div>
          </div>
        )
      }
    </main>
  )
}