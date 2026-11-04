"use client"

import {
  useCallback,
  useEffect,
  useState
} from "react"

import {
  supabase
} from "@/utils/supabase"

import {
  trackEvent
} from "@/utils/analytics"


const VOTER_KEY =
  "rankd.uprankd.voter"


export type ItemUprankState = {
  count: number
  mine: boolean
}


type SummaryRow = {
  item_position: number
  uprank_count: number | string
  is_mine: boolean
}


type ToggleRow = {
  uprank_count: number | string
  is_mine: boolean
}


export function getUprankdVoterKey() {
  if (typeof window === "undefined") {
    return ""
  }

  try {
    const existing =
      window.localStorage.getItem(VOTER_KEY)?.trim()

    if (existing && existing.length >= 8) {
      return existing
    }

    const next =
      window.crypto.randomUUID()

    window.localStorage.setItem(VOTER_KEY, next)

    return next
  } catch {
    return ""
  }
}


export async function loadItemUpranks(
  rankingId: string
) {
  const voterKey =
    getUprankdVoterKey()

  const {
    data,
    error
  } = await supabase.rpc(
    "item_uprank_summary",
    {
      p_ranking_id: rankingId,
      p_voter_key: voterKey
    }
  )

  if (error) {
    if (!/item_uprank_summary|schema cache/i.test(error.message)) {
      console.error("upRANKD summary error:", error)
    }

    return [] as SummaryRow[]
  }

  return (data ?? []) as SummaryRow[]
}


export async function toggleItemUprank(
  rankingId: string,
  position: number
) {
  const voterKey =
    getUprankdVoterKey()

  if (!voterKey) {
    throw new Error("upRANKD needs a browser that can store a visitor key.")
  }

  const {
    data,
    error
  } = await supabase.rpc(
    "toggle_item_uprank",
    {
      p_ranking_id: rankingId,
      p_item_position: position,
      p_voter_key: voterKey
    }
  )

  if (error) {
    throw error
  }

  const row =
    (data as ToggleRow[] | null)?.[0]

  if (!row) {
    throw new Error("upRANKD did not return a result.")
  }

  return {
    count: Number(row.uprank_count) || 0,
    mine: Boolean(row.is_mine)
  } satisfies ItemUprankState
}


export function useItemUpranks(
  rankingId?: string | null
) {
  const [
    byPosition,
    setByPosition
  ] = useState<Record<number, ItemUprankState>>({})

  useEffect(() => {
    if (!rankingId) {
      return
    }

    let cancelled = false

    void loadItemUpranks(rankingId).then(rows => {
      if (cancelled) {
        return
      }

      const next: Record<number, ItemUprankState> = {}

      for (const row of rows) {
        next[row.item_position] = {
          count: Number(row.uprank_count) || 0,
          mine: Boolean(row.is_mine)
        }
      }

      setByPosition(next)
    })

    return () => {
      cancelled = true
    }
  }, [rankingId])

  const toggle = useCallback(async (
    position: number
  ) => {
    if (!rankingId) {
      return
    }

    let snapshot: ItemUprankState = {
      count: 0,
      mine: false
    }

    setByPosition(existing => {
      snapshot =
        existing[position] ?? {
          count: 0,
          mine: false
        }

      const optimistic: ItemUprankState =
        snapshot.mine
          ? {
              count: Math.max(0, snapshot.count - 1),
              mine: false
            }
          : {
              count: snapshot.count + 1,
              mine: true
            }

      return {
        ...existing,
        [position]: optimistic
      }
    })

    try {
      const result =
        await toggleItemUprank(
          rankingId,
          position
        )

      setByPosition(existing => ({
        ...existing,
        [position]: result
      }))

      void trackEvent(
        "item_uprankd",
        {
          rankingId,
          position,
          on:
            result.mine
        }
      )
    } catch (error) {
      console.error("upRANKD toggle error:", error)

      setByPosition(existing => ({
        ...existing,
        [position]: snapshot
      }))
    }
  }, [rankingId])

  function forPosition(
    position: number
  ) {
    return byPosition[position] ?? {
      count: 0,
      mine: false
    }
  }

  return {
    forPosition,
    toggle
  }
}
