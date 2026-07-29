import Hero from "@/components/Hero";
import Trending from "@/components/Trending";
import Categories from "@/components/Categories";
import WhyRankd from "@/components/WhyRankd";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main>
      <Hero />
      <Trending />
      <Categories />
      <WhyRankd />
      <Footer />
    </main>
  );
}