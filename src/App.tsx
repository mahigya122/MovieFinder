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
  
  return (
    <div className="min-h-screen bg-black">

      <Navbar
        query={query}
        setQuery={setQuery}
        totalResults={totalResults}
      />

      <div className="flex">
        <TopMovieList topMovies={topMovies} />
        <Hero movies={movies} loading={loading} />
      </div>

    </div>
  );
}
        
export default Moviesearch;