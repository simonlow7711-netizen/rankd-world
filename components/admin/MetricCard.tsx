export default function MetricCard({

  title,

  value,

  description

}:{

  title:string

  value:string | number

  description?:string

}) {


  return (

    <div className="
      bg-black
      text-white
      rounded-[32px]
      p-7
    ">


      <p className="
        text-gray-400
        uppercase
        tracking-widest
        text-xs
        font-black
      ">

        {title}

      </p>




      <p className="
        text-5xl
        font-black
        mt-4
      ">

        {value}

      </p>




      {description && (

        <p className="
          text-gray-400
          mt-3
        ">

          {description}

        </p>

      )}


    </div>

  )

}