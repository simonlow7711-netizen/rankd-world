import Hero from "@/components/Hero"
import DailyRankd from "@/components/DailyRankd"
import Trending from "@/components/Trending"
import Categories from "@/components/Categories"
import WhyRankd from "@/components/WhyRankd"
import Footer from "@/components/Footer"


export default function Home() {


  return (

    <main className="
      min-h-screen
      bg-black
      text-white
    ">


      <Hero />



      <div className="
        max-w-6xl
        mx-auto
        px-6
        py-16
      ">


        <DailyRankd />



        <Trending />



        <Categories />



        <WhyRankd />



      </div>



      <Footer />


    </main>

  )

}