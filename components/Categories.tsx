const categories = [
  "🍔 Food",
  "🎬 Movies",
  "🎵 Music",
  "⚽ Sport",
  "🎮 Gaming",
  "✈️ Travel",
  "📚 Books",
  "💻 Technology",
];

export default function Categories() {
  return (
    <section className="
      bg-black
      text-white
      px-6
      py-20
    ">

      <h2 className="
        text-4xl
        font-black
        mb-10
      ">
        Browse Categories
      </h2>


      <div className="
        grid
        grid-cols-2
        md:grid-cols-4
        gap-5
      ">

        {categories.map((category) => (

          <div
            key={category}
            className="
              bg-zinc-900
              rounded-3xl
              p-8
              text-xl
              font-bold
              hover:scale-105
              transition
              cursor-pointer
            "
          >
            {category}
          </div>

        ))}

      </div>

    </section>
  );
}