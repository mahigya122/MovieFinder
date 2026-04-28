interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}
interface Props {
  topMovies: Movie[];
}


function TopMovieList({ topMovies }: Props) {
 
  return (
     <div className="hidden lg:block w-full max-w-xs p-4 bg-black text-white border-r border-gray-800"> {/*hidden lg:block → only desktop shows sidebar
             w-64 → fixed sidebar width
             bg-black → Netflix style
             border-r → separation line
             
             for fixed(non responsive) sidebar=hidden lg:block w-80 p-4 bg-black text-white border-r border-gray-800 cause w-80 dominates
             and max-w-sm does nothing useful Because fixed width already locks size. 
             */}
          <h2 className="font-bold mb-3">Top Movies</h2>

          {topMovies.map((m, i) => (
            <div key={i} className="flex gap-2 mb-3 items-center">
              <img
                src={m.Poster}
                alt={m.Title}   //need alt as well
                className="w-10 h-14 object-cover"
              />
              <p className="text-sm truncate">{m.Title}</p>
            </div>
          ))}
        </div>
        );
      }
export default TopMovieList;