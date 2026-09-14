import Link from "next/link"


export default function Footer() {

  return (

    <footer
      className="
        bg-[#F7F4EE]
        px-6
        pb-10
        pt-20
        text-black
        md:pt-24
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
            border-t
            border-black/10
            pt-12
            md:pt-16
          "
        >

          <div
            className="
              grid
              gap-12
              md:grid-cols-[1fr_auto]
              md:items-start
            "
          >

            <div>

              <Link
                href="/"
                className="
                  group
                  relative
                  flex
                  h-14
                  w-fit
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


              <p
                className="
                  mt-4
                  max-w-sm
                  text-sm
                  leading-relaxed
                  text-black/45
                "
              >
                The world's Top 7 everything.
              </p>

            </div>


            <nav
              className="
                grid
                grid-cols-2
                gap-x-12
                gap-y-4
                text-sm
                font-black
                md:grid-cols-4
                md:gap-x-8
              "
            >

              <Link
                href="/explore"
                className="
                  transition
                  hover:text-[#FF6B35]
                "
              >
                Explore
              </Link>


              <Link
                href="/categories"
                className="
                  transition
                  hover:text-[#FF6B35]
                "
              >
                Categories
              </Link>


              <Link
                href="/profile"
                className="
                  transition
                  hover:text-[#FF6B35]
                "
              >
                Profile
              </Link>


              <Link
                href="/contact"
                className="
                  transition
                  hover:text-[#FF6B35]
                "
              >
                Contact
              </Link>

            </nav>

          </div>


          <div
            className="
              mt-16
              flex
              flex-col
              gap-3
              border-t
              border-black/10
              pt-6
              text-xs
              text-black/35
              md:flex-row
              md:items-center
              md:justify-between
            "
          >

            <p>
              © {new Date().getFullYear()} RANKD.
            </p>


            <p>
              Built around human opinions.
            </p>

          </div>

        </div>

      </div>

    </footer>

  )

}