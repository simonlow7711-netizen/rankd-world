import Link from "next/link"


type Step = {

  number: string

  title: string

  text: string

  link: string

  action: string

}


const steps: Step[] = [

  {

    number:
      "01",

    title:
      "Choose a topic",

    text:
      "Pick anything. Films, food, travel, sport, music or your own idea.",

    link:
      "/categories",

    action:
      "Find a topic →"

  },


  {

    number:
      "02",

    title:
      "Rank your Top 7",

    text:
      "Put your choices in order. Your #1 says something about you.",

    link:
      "/create",

    action:
      "Create your RANKD →"

  },


  {

    number:
      "03",

    title:
      "Compare perspectives",

    text:
      "See where people agree, disagree and create different rankings.",

    link:
      "/explore",

    action:
      "Explore debates →"

  }

]


export default function WhyRankd() {

  return (

    <section
      className="
        bg-[#F7F4EE]
        px-6
        py-20
        md:py-24
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
            max-w-3xl
          "
        >

          <p
            className="
              text-xs
              font-black
              uppercase
              tracking-[0.3em]
              rankd-accent
            "
          >
            HOW RANKD WORKS
          </p>


          <h2
            className="
              mt-4
              text-4xl
              font-black
              leading-[1.02]
              tracking-[-0.045em]
              md:text-6xl
            "
          >
            Every opinion has a ranking.
          </h2>


          <p
            className="
              mt-5
              max-w-2xl
              text-lg
              leading-relaxed
              rankd-muted
              md:text-xl
            "
          >
            Create your Top 7.
            See how your perspective compares with the world.
          </p>

        </div>


        <div
          className="
            mt-14
            grid
            md:grid-cols-3
          "
        >

          {steps.map(
            step => (

              <Link
                key={
                  step.number
                }
                href={
                  step.link
                }
                className="
                  group
                  block
                  border-t
                  border-black/10
                  py-8
                  transition
                  md:border-t-0
                  md:border-l
                  md:px-8
                  md:first:border-l-0
                  md:first:pl-0
                  md:last:pr-0
                "
              >

                <div
                  className="
                    flex
                    items-start
                    justify-between
                    gap-6
                  "
                >

                  <p
                    className="
                      text-6xl
                      font-black
                      leading-none
                      tracking-[-0.06em]
                      text-black/10
                      transition
                      duration-300
                      group-hover:text-[#FF6B35]
                      md:text-7xl
                    "
                  >
                    {step.number}
                  </p>


                  <span
                    className="
                      pt-2
                      text-xl
                      leading-none
                      text-[#FF6B35]
                      opacity-0
                      transition
                      duration-300
                      group-hover:opacity-100
                    "
                  >
                    →
                  </span>

                </div>


                <h3
                  className="
                    mt-8
                    text-2xl
                    font-black
                    leading-tight
                    tracking-[-0.025em]
                    md:text-3xl
                  "
                >
                  {step.title}
                </h3>


                <p
                  className="
                    mt-4
                    max-w-sm
                    leading-relaxed
                    text-black/55
                  "
                >
                  {step.text}
                </p>


                <p
                  className="
                    mt-7
                    text-sm
                    font-black
                    transition
                    duration-300
                    group-hover:text-[#FF6B35]
                  "
                >
                  {step.action}
                </p>

              </Link>

            )
          )}

        </div>

      </div>

    </section>

  )

}