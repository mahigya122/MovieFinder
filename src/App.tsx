import { useEffect, useState } from 'react';
import Navbar from './components/navbar';
import TopMovieList from './components/topmovies';
import Hero from './components/hero';

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
}

interface MovieDetails extends Movie {
  Plot: string;
  imdbRating: string;
  Runtime: string;
}

function Moviesearch() {

  //ask
  const [movies, setMovies] = useState<Movie[]>([]);
  const [totalResults, setTotalResults] = useState<number>(0);
  const [topMovies, setTopMovies] = useState<Movie[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  //yo use garda const [query, setQuery] = useState<string>("movie")=> searche box ma default ma movie aayo so we place empty string
  const [query, setQuery] = useState<string>(""); //ask
  const [hasSearched, setHasSearched] = useState<boolean>(false); 
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [selectedMovie, setSelectedMovie] = useState<MovieDetails | null>(null);

  // for search results
  useEffect(() => {
    // Right now you search even for "a" or empty string, so short queries are ignored.
    if (query.length > 0 && query.length < 3) {
      setMovies([]);
      setTotalResults(0);
      setHasSearched(false);
      return;
    }
    const controller = new AbortController();   //This creates an AbortController, which is used to cancel (abort) ongoing operations,



    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=1e4f67a1&s=${query? query : "movie"}`,       //fetch(URL, OPTIONS)
          { signal: controller.signal }
        );
        const data = await response.json();

        setMovies(data.Search || []);
        setTotalResults(Number(data.totalResults) || 0);
        setHasSearched(true);     // Set to true once a search is completed (even if no results are found)
       
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false); // yes ma chi loding vaye paxi continue garna ko lai false set gare ko ho load matra na hos vanera 
      }
    };

    fetchData();
    return () => controller.abort();
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

    // for MovieDetails when selected
    useEffect(() => {
      if (!selectedId) return;  // If no movie is selected, we don't need to fetch details, so we exit early.
      
      const fetchMovieDetails = async () => {
      try { 
        const response = await fetch(
          `https://www.omdbapi.com/?apikey=1e4f67a1&i=${selectedId}&plot=full`
        );
        const data = await response.json();

        setSelectedMovie(data);              /* data.Search is only for search API; details API returns one movie object directly. */
      }catch (error) {
        console.error(error);
      }
    };
      
      fetchMovieDetails();
    }, [selectedId]);
   
  
  return (
    <div className="min-h-screen bg-black">

      <Navbar
        query={query}
        setQuery={setQuery}
        totalResults={totalResults}
      />

      <div className="flex">
        <TopMovieList topMovies={topMovies} />
        <Hero
          movies={movies}
          loading={loading}
          hasSearched={hasSearched}
          onSelectMovie={(movie: Movie) => setSelectedId(movie.imdbID)}
          selectedMovie={selectedMovie}
          onClose={() => setSelectedMovie(null)}
        />
      </div>

    </div>
  );
}

export default Moviesearch;