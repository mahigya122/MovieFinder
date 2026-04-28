import { useEffect, useState } from 'react'
/*import reactLogo from './assets/react.svg'
import viteLogo from './assets/vite.svg'
import heroImg from './assets/hero.png'*/

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

function Moviesearch() {

  //ask
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  //yo use garda const [query, setQuery] = useState<string>("movie")=> searche box ma default ma movie aayo so we place empty string
  const [query, setQuery] = useState<string>(""); //ask

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=1e4f67a1&s=${query? query : "movie"}`
        );
        const data = await response.json();

        setMovies(data.Search || []);
        setTotalResults(Number(data.totalResults) || 0);
        
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // yes ma chi loding vaye paxi continue garna ko lai false set gare ko ho load matra na hos vanera 
      }
    };

    fetchData();
  }, [query]);

  // for Sidebar (top movies)
  useEffect(() => {
    const fetchTop = async () => {
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=1e4f67a1&s=avengers`
        );
        const data = await response.json();

        setTopMovies(data.Search || []);
      } catch (error) {
        console.error(error);
      }
    };

    fetchTop();
  }, []);
  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-100">
        <p className="text-lg text-gray-500">Loading...</p>
      </div>
    );
  }
  return (
    <div className="min-h-screen bg-gray-100">

      {/* NAVBAR */}
        
      <div className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 p-4 text-white shadow-lg">
        <h1 className="text-xl font-bold tracking-wide !text-white">
          🎬 MovieFinder
        </h1>

        <input
          type="text"
          placeholder="Search movies..."
          className="w-full max-w-sm rounded bg-white px-3 py-2 text-black placeholder:text-gray-500"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />

        <p className="text-sm whitespace-nowrap text-white">
          Results: {totalResults}
        </p>
      </div>

      {/* MAIN LAYOUT */}
      <div className="flex">

        {/* for SIDEBAR */}
        <div className="hidden lg:block w-64 bg-white p-4 shadow-md">
          <h2 className="font-bold mb-3">Top Movies</h2>

          {topMovies.map((m, i) => (
            <div key={i} className="flex gap-2 mb-3 items-center">
              <img
                src={m.Poster}
                alt={m.Title}   //need alt as well
                className="w-10 h-14 object-cover"
              />
              <p className="text-sm">{m.Title}</p>
            </div>
          ))}
        </div>

        {/* MOVIES GRID */}
        <div className="flex-1 p-4 overflow-y-auto bg-gray-100">
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 gap-6 auto-rows-fr items-stretch">

          {movies.map((m: Movie, i: number) => (
            <div
              key={i}
              className="bg-white rounded-xl shadow-md hover:shadow-xl transition duration-300 overflow-hidden flex flex-col"
            >
              <img
                src={m.Poster}
                alt={m.Title}
                className="w-full h-44 object-cover"
              />

              <div className="p-3">
                <h2 className="text-lg font-bold truncate">{m.Title}</h2>
                <p className="text-gray-600">{m.Year}</p>
                <p className="text-sm text-gray-400">{m.Type}</p>
              </div>
            </div>
          ))}
        </div>

      </div>
    </div>
    </div>
  );
}

export default Moviesearch;