interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}
interface Props {
  movies: Movie[];
  loading: boolean;
}

function Hero({ movies, loading }: Props) {

  if (loading) {
    return (
      <div className="flex items-center justify-center flex-1 py-10 bg-black"> {/*min-h-screen = full screen height so its not flexible with component only loading and flex-1 tells the element to take all available space inside a flex container (Takes remaining horizontal space). */}
        <p className="h-10 w-10 animate-spin rounded-full border-4 border-gray-600 border-t-white">
          {/*h-10 w-10 → size of spinner
            rounded-full → circle shape
            border-4 → thickness
            border-gray-600 → base ring color
            border-t-white → top part bright (creates spinning effect)
            animate-spin → rotates continuously */}
        </p>
      </div>
    );
  } 

  if (!loading && movies.length === 0) {             {/*means “not loading AND no movies found”*/}
    return (
      <div className="flex flex-1 items-center justify-center bg-black">
        <p className="text-gray-400 text-lg">
          ❌ No movies found
        </p>
      </div>
    );
  }

  return (
    <div className="flex flex-col min-h-screen bg-black">
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 p-4 auto-rows-auto
        items-start"> {/*if i place auto-row-fr item-streach then the height of all the card will be same but it will overwrite image hight as well*/}

          {movies.map((m: Movie, i: number) => (
            <div
              key={i}
              className="flex flex-col
              overflow-hidden
              rounded-xl
            bg-[#111]
            text-white
              shadow-md
              transition-all duration-300
              hover:shadow-red-500/30
              hover:scale-105"
            >
              <div className="aspect-4/5 w-full bg-gray-100">  {/* aspect ratio helps us maintain consistancy between moviecard and image*/ }
              <img
               src={m.Poster}
               alt={m.Title}
               className="w-full object-cover"
               />
              </div>
            

              <div className="p-2">
                <h2 className="truncate text-sm font-semibold">{m.Title}</h2>
                <p className="text-xs text-gray-400">{m.Year}</p>
                <p className="text-[11px] text-gray-500">{m.Type}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
  );
}
export default Hero;



  