import { useState, useEffect } from 'react';
import StarRating from './starrating';

interface Movie {
  Title: string;
  Year: string;
  imdbID: string;
  Type: string;
  Poster: string;
  Plot: string;
  imdbRating: string;
  Runtime: string;
}

interface Props {
  movie: Movie | null;
  onClose: () => void;      //onClose function takes NO arguments it returns nothing (void) and is used to close the selected movie view or reset the selected movie data when triggered. 
}

function Selected({ movie, onClose }: Props) {

  const [rating, setRating] = useState<number>(0);
  const [review, setReview] = useState<string>(""); 
  const [savedReviews, setSavedReviews] = useState<any[]>([]);

  // load saved reviews
  useEffect(() => {
    const stored = localStorage.getItem("reviews");
    if (stored) {
      setSavedReviews(JSON.parse(stored));      //Loads saved review data from localStorage (done by storing), converts it from string format into JavaScript objects using JSON.parse, and stores it in React state for rendering.
    }
  }, []);

  if (!movie) return null;

  const reviewsForMovie = savedReviews.filter((r) => r.movieId === movie.imdbID);

  // save review
  const handleSaveReview = () => {
    const newReview = {
      movieId: movie.imdbID, 
      title: movie.Title,
      rating,
      review,
      date: new Date().toLocaleDateString(),
    };
    
    //store locally in browser using localStorage 
    const stored = localStorage.getItem("reviews");
    const existing = stored ? JSON.parse(stored) : [];

    const updated = [...existing, newReview];

    localStorage.setItem("reviews", JSON.stringify(updated));
    setSavedReviews(updated);

    setReview("");       {/*whatever user typed in review box gets cleared and Resets rating back to zero */}
    setRating(0);
  };

  return (
    <div className="absolute right-0 top-0 h-full w-80                    {/*transform ->enables animation, transition-transform duration-300 ->smooth slide (300ms), translate-x-0 ->visible state (onscreen), if we translate-x-full  → hidden (off screen), translate-x-0 → visible*/}
        bg-black text-white border-l border-gray-800 p-4
        overflow-y-auto shadow-2xl
        transform transition-transform duration-300 translate-x-0">

      {/* Close */}
      <button
        onClick={onClose}
        className="text-gray-400 hover:text-white mb-4"
      >
        ✖ Close
      </button>

      {/* Poster */}
      <img
        src={movie.Poster}
        alt={movie.Title}
        className="w-full rounded-lg mb-4"
      />

      {/* Title */}
      <h2 className="text-xl font-bold">{movie.Title}</h2>

      {/* Info */}
      <p className="text-gray-400 text-sm mt-1">{movie.Year}</p>
      <p className="text-gray-500 text-sm">{movie.Type}</p>

      {/* Description */}
      <p className="mt-3 text-sm text-gray-300 leading-relaxed line-clamp-4">
        {movie.Plot || "No description available"}
      </p>

      {/* Stars system for reviews */}
      <StarRating value={rating} onChange={setRating} />   {/*taked value from starrating.tsx8*/}

      {/* Review input */}
      <textarea
        className="w-full mt-3 p-2 rounded bg-gray-800 text-white"
        placeholder="Write your review..."
        value={review}
        onChange={(e) => setReview(e.target.value)}
      />

      {/* Save  button */}
      <button
        onClick={handleSaveReview}
        className="mt-2 px-4 py-2 bg-red-600 rounded"
      >
        Save Review
      </button>

      {/* Saved reviews for this movie */}
      {reviewsForMovie.length > 0 && (
        <div className="mt-4">
          <h3 className="font-semibold mb-2">Saved Reviews</h3>
          <ul className="space-y-3">
            {/*creates a list of reviews UI i.e.Renders a simple list item*/}
            {reviewsForMovie.map((r, idx) => (                         //r is just a variable name. It represents one item inside the array you are looping over. and idx = index (position in array)
              <li key={idx} className="bg-gray-900 p-3 rounded">
                <div className="flex items-center justify-between">
                  <strong>{r.title}</strong>
                  <span className="text-yellow-400">{'⭐'.repeat(r.rating)}</span>
                </div>
                <p className="text-sm text-gray-300 mt-1">{r.review}</p>
              </li>
            ))}
          </ul>
        </div>
      )}

    </div>
  );
}

export default Selected;