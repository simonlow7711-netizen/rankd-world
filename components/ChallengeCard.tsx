"use client"

import Link from "next/link"

export default function ChallengeCard({

  person,

  ranking,

  challenge

}: any) {

  const biggest = challenge.biggestDifference

  return (

    <div
      className="
        bg-white
        text-black
        rounded-3xl
        p-6
        hover:scale-105
        transition
      "
    >

      <p
        className="
          text-red-500
          font-black
        "
      >
        🆚 Challenge My Taste
      </p>

      <h3
        className="
          text-2xl
          font-black
          mt-3
        "
      >
        {person.displayName}
      </h3>

      <p
        className="
          text-gray-500
          mt-2
        "
      >
        {ranking.title}
      </p>

      <div
        className="
          mt-6
        "
      >

        <p className="text-sm text-gray-500">
          Challenge Score
        </p>

        <p
          className="
            text-5xl
            font-black
          "
        >
          {challenge.challengeScore}%
        </p>

      </div>

      {biggest && (

        <div
          className="
            mt-6
            rounded-2xl
            bg-gray-100
            p-4
          "
        >

          <p
            className="
              font-bold
            "
          >
            Biggest disagreement
          </p>

          <p
            className="
              mt-2
              text-lg
            "
          >
            {biggest.item}
          </p>

          <p
            className="
              text-gray-600
              mt-2
            "
          >
            {person.displayName}: #{biggest.remixPosition}
          </p>

          <p
            className="
              text-gray-600
            "
          >
            You: #{biggest.originalPosition}
          </p>

        </div>

      )}

      <Link
        href="/create"
      >

        <button
          className="
            mt-8
            w-full
            bg-black
            text-white
            py-4
            rounded-full
            font-black
          "
        >
          Create Your Top 7 →
        </button>

      </Link>

    </div>

  )

}