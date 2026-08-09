"use client"

import {
  useEffect,
  useState
} from "react"

import {
  supabase
} from "@/utils/supabase"

import {
  getTasteGraph
} from "@/utils/tasteGraphRepository"

import {
  calculateTasteDNADiagnostic,
  TasteDNADiagnostic
} from "@/utils/tasteDNADiagnostic"


export default function TasteDiagnosticPage(){

  const [
    diagnostic,
    setDiagnostic
  ] = useState<TasteDNADiagnostic | null>(
    null
  )


  const [
    loading,
    setLoading
  ] = useState(true)


  const [
    error,
    setError
  ] = useState<string | null>(
    null
  )


  useEffect(()=>{

    async function loadDiagnostic(){

      try {

        setLoading(true)

        setError(null)


        const {
          data:{
            user
          }
        } = await supabase.auth.getUser()


        if(!user){

          setError(
            "No authenticated user found."
          )

          return

        }


        const graph =

          await getTasteGraph(

            user.id

          )


        const result =

          calculateTasteDNADiagnostic(

            graph

          )


        setDiagnostic(

          result

        )

      }

      catch(
        diagnosticError
      ){

        console.error(

          "TASTE DNA DIAGNOSTIC ERROR",

          diagnosticError

        )


        setError(

          "Unable to load Taste DNA diagnostic."

        )

      }

      finally {

        setLoading(false)

      }

    }


    loadDiagnostic()

  },[])


  if(loading){

    return (

      <main className="min-h-screen p-8">

        <h1 className="text-2xl font-bold">

          Taste DNA Diagnostic

        </h1>


        <p className="mt-4">

          Loading Taste Graph...

        </p>

      </main>

    )

  }


  if(error){

    return (

      <main className="min-h-screen p-8">

        <h1 className="text-2xl font-bold">

          Taste DNA Diagnostic

        </h1>


        <p className="mt-4 text-red-600">

          {error}

        </p>

      </main>

    )

  }


  if(!diagnostic){

    return (

      <main className="min-h-screen p-8">

        <h1 className="text-2xl font-bold">

          Taste DNA Diagnostic

        </h1>


        <p className="mt-4">

          No diagnostic data available.

        </p>

      </main>

    )

  }


  return (

    <main className="min-h-screen p-8">

      <div className="mx-auto max-w-5xl">

        <h1 className="text-3xl font-bold">

          Taste DNA Diagnostic

        </h1>


        <p className="mt-2 text-gray-600">

          Internal RANKD development diagnostic.

        </p>


        <section className="mt-8 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">


          <div className="rounded-xl border p-5">

            <p className="text-sm text-gray-500">

              Rankings

            </p>

            <p className="mt-2 text-3xl font-bold">

              {diagnostic.totalRankings}

            </p>

          </div>


          <div className="rounded-xl border p-5">

            <p className="text-sm text-gray-500">

              Signals

            </p>

            <p className="mt-2 text-3xl font-bold">

              {diagnostic.totalSignals}

            </p>

          </div>


          <div className="rounded-xl border p-5">

            <p className="text-sm text-gray-500">

              Unique items

            </p>

            <p className="mt-2 text-3xl font-bold">

              {diagnostic.uniqueItems}

            </p>

          </div>


          <div className="rounded-xl border p-5">

            <p className="text-sm text-gray-500">

              Categories

            </p>

            <p className="mt-2 text-3xl font-bold">

              {diagnostic.uniqueCategories}

            </p>

          </div>


        </section>


        <section className="mt-8">

          <h2 className="text-xl font-bold">

            Behaviour

          </h2>


          <div className="mt-4 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">


            <div className="rounded-xl border p-5">

              <p className="text-sm text-gray-500">

                Average position

              </p>

              <p className="mt-2 text-2xl font-bold">

                {diagnostic.averagePosition}

              </p>

            </div>


            <div className="rounded-xl border p-5">

              <p className="text-sm text-gray-500">

                #1 choice rate

              </p>

              <p className="mt-2 text-2xl font-bold">

                {diagnostic.topChoiceRate}

              </p>

            </div>


            <div className="rounded-xl border p-5">

              <p className="text-sm text-gray-500">

                Preference strength

              </p>

              <p className="mt-2 text-2xl font-bold">

                {diagnostic.preferenceStrength}

              </p>

            </div>


            <div className="rounded-xl border p-5">

              <p className="text-sm text-gray-500">

                Taste variety

              </p>

              <p className="mt-2 text-2xl font-bold">

                {diagnostic.tasteVariety}

              </p>

            </div>


            <div className="rounded-xl border p-5">

              <p className="text-sm text-gray-500">

                Taste concentration

              </p>

              <p className="mt-2 text-2xl font-bold">

                {diagnostic.tasteConcentration}

              </p>

            </div>


            <div className="rounded-xl border p-5">

              <p className="text-sm text-gray-500">

                Confidence

              </p>

              <p className="mt-2 text-2xl font-bold">

                {diagnostic.confidence}

              </p>

            </div>


          </div>

        </section>


        <section className="mt-8 grid gap-8 lg:grid-cols-2">


          <div>

            <h2 className="text-xl font-bold">

              Strongest categories

            </h2>


            <div className="mt-4 space-y-3">

              {diagnostic.strongestCategories.map(

                (
                  category,
                  index
                ) => (

                  <div
                    key={
                      `${category.label}-${index}`
                    }
                    className="rounded-xl border p-4"
                  >

                    <div className="flex items-center justify-between">

                      <span className="font-medium">

                        {index + 1}. {category.label}

                      </span>


                      <span className="font-bold">

                        {category.value}

                      </span>

                    </div>


                    <p className="mt-1 text-sm text-gray-500">

                      {category.description}

                    </p>

                  </div>

                )

              )}

            </div>

          </div>


          <div>

            <h2 className="text-xl font-bold">

              Strongest choices

            </h2>


            <div className="mt-4 space-y-3">

              {diagnostic.strongestChoices.map(

                (
                  choice,
                  index
                ) => (

                  <div
                    key={
                      `${choice.label}-${index}`
                    }
                    className="rounded-xl border p-4"
                  >

                    <div className="flex items-center justify-between">

                      <span className="font-medium">

                        {index + 1}. {choice.label}

                      </span>


                      <span className="font-bold">

                        {choice.value}

                      </span>

                    </div>


                    <p className="mt-1 text-sm text-gray-500">

                      {choice.description}

                    </p>

                  </div>

                )

              )}

            </div>

          </div>


        </section>


        <section className="mt-8">

          <h2 className="text-xl font-bold">

            Taste insights

          </h2>


          <div className="mt-4 space-y-3">

            {diagnostic.insights.map(

              (
                insight,
                index
              ) => (

                <div
                  key={index}
                  className="rounded-xl border p-4"
                >

                  {insight}

                </div>

              )

            )}

          </div>

        </section>


        <section className="mt-8 rounded-xl border bg-gray-50 p-5">

          <h2 className="font-bold">

            Diagnostic JSON

          </h2>


          <pre className="mt-4 overflow-x-auto text-xs">

            {JSON.stringify(

              diagnostic,

              null,

              2

            )}

          </pre>

        </section>


      </div>

    </main>

  )

}