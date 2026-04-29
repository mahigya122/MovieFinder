{/*interface Movie {
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
     <div className="hidden lg:block w-full max-w-xs p-4 bg-black text-white border-r border-gray-800"> 
             
             // this is just a discription for me to undersatand
             *hidden lg:block → only desktop shows sidebar
             w-64 → fixed sidebar width
             bg-black → Netflix style
             border-r → separation line
             
             for fixed(non responsive) sidebar=hidden lg:block w-80 p-4 bg-black text-white border-r border-gray-800 cause w-80 dominates
             and max-w-sm does nothing useful Because fixed width already locks size. 
            // it ends here

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
export default TopMovieList; */}

import { useEffect, useState } from 'react';

// Review interface: defines the structure of a review/watched movie from localStorage
interface Review {
  id: string;           // Unique ID for the review
  movieId: string;      // IMDB movie ID
  title: string;        // Movie title
  poster: string;       // Movie poster URL
  rating: number;       // User's rating (1-5)
  review: string;       // User's review text
  date: string;         // Date when review was added
  createdAt: string;    // ISO timestamp
}

function TopMovieList({ onWatchedMovieClick }: any) {
  const [watched, setWatched] = useState<any[]>([]);

  useEffect(() => {
    const load = () => {
      const stored = localStorage.getItem("reviews");

      if (stored) {
        const parsed = JSON.parse(stored);

        // remove duplicates (keep latest per movie)
        const unique = Object.values(
          parsed.reduce((acc: any, item: Review) => {     //reduce() is transforming a list of reviews into a lookup object using movieId as keys for fast access.
            acc[item.movieId] = item;
            return acc;
          }, {})
        );

        setWatched(unique as Review[]);
      }
    };

    load();
    window.addEventListener("reviewsUpdated", load);
    return() => window.removeEventListener("reviewsUpdated", load);   //cleanup function to remove event listener when component unmounts
  }, []);

   return (
    <div className="hidden lg:block w-80 p-4 bg-black text-white border-r border-gray-800">
      <h2 className="font-bold mb-3"> Watched Movies</h2>
        {/*Loop through all watched movies and render UI for each one. i.e Renders a fully interactive UI card*/}
      {watched.map((m) => (
        <div
          key={m.movieId}
          onClick={() => onWatchedMovieClick(m.movieId)}
          className="flex gap-2 mb-3 items-center cursor-pointer hover:bg-gray-800 p-2 rounded"
        >
          <img src={m.poster} className="w-10 h-14 object-cover" />   {/*object-cover keeps image ratio clean*/}
          <div>
            <p className="text-sm truncate">{m.title}</p>
            <p className="text-xs text-yellow-400">
              {'⭐'.repeat(m.rating)}
            </p>
          </div>
        </div>
      ))}
    </div>
  );
}

export default TopMovieList;