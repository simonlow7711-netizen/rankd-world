import {
  Ranking
} from "@/types/ranking"

import {
  getDiscoveryReason
} from "@/utils/discoveryReason"


type Props = {

  ranking: Ranking

}


export default function DiscoveryReason({

  ranking

}: Props) {


  return (

    <div className="
      mt-4
      rounded-2xl
      bg-black/5
      px-4
      py-3
    ">


      <p className="
        text-sm
        font-semibold
      ">

        {
          getDiscoveryReason(
            ranking
          )
        }

      </p>


    </div>

  )

}