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

interface Props {
  movies: Movie[];
  loading: boolean;
  hasSearched: boolean;
  onSelectMovie: (movie: Movie) => void;   //onSelectMovie is a function that takes a movie and returns nothing
  selectedMovie: MovieDetails | null;
  onClose: () => void;
}

import { useState, useEffect } from 'react';

function Hero({ movies, loading, hasSearched, onSelectMovie, selectedMovie, onClose }: Props) {
  const [rating, setRating] = useState<number>(0);
  const [hover, setHover] = useState<number>(0);
  const [review, setReview] = useState<string>("");
  const [savedReviews, setSavedReviews] = useState<any[]>([]);

  // load saved reviews
  useEffect(() => {
    const stored = localStorage.getItem("reviews");
    //this show what reviews are saved in local storage and we parse it to get the actual data structure (array of reviews) and set it to state so we can use it in our component
    if (stored) {
      const parsedReviews = JSON.parse(stored).map((item: any, index: number) => ({
        ...item,
        id: item.id || item.createdAt || `${item.movieId}-${index}`,
      }));
      setSavedReviews(parsedReviews);
    }
  }, []);

    // delete review function that takes reviewId and removes the review with that id from savedReviews state and also updates localStorage to reflect the change
  const handleDeleteReview = (reviewId: string) => {
    const updated = savedReviews.filter((item) => item.id !== reviewId);
    localStorage.setItem("reviews", JSON.stringify(updated));
    setSavedReviews(updated);
  };
     // save review function that creates a new review object with movie details, user rating, and review text, then saves it to localStorage and updates the savedReviews state. It also resets the review input and rating after saving.
  const handleSaveReview = () => {
    if (!selectedMovie) return;
    const newReview = {
      id: `${selectedMovie.imdbID}-${Date.now()}`,
      movieId: selectedMovie.imdbID,
      title: selectedMovie.Title,
      rating,
      review,
      createdAt: new Date().toISOString(),
      date: new Date().toLocaleDateString('en-US', {            //it show when the review was wriytten*
        year: 'numeric',
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      }),
    };

    const stored = localStorage.getItem("reviews");
    const existing = stored ? JSON.parse(stored) : [];
    const updated = [...existing, newReview];

    localStorage.setItem("reviews", JSON.stringify(updated));
    setSavedReviews(updated);

    setReview("");           {/*whatever user typed in review box gets cleared and Resets rating back to zero */}
    setRating(0);
  };

  // Get reviews for selected movie
  const reviewsForMovie = selectedMovie
    ? savedReviews.filter((r) => r.movieId === selectedMovie.imdbID)
    : [];

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

  if (!loading && hasSearched && movies.length === 0) {             {/*means “not loading AND no movies found”*/}
    return (
      <div className="flex flex-1 items-center justify-center bg-black">
        <p className="text-gray-400 text-lg">
          ❌ No movies found
        </p>
      </div>
    );
  }

  return (
    <div className="relative flex flex-1 min-h-screen bg-black overflow-hidden">
      {/* Movie Grid - Left Side */}
      <div className={`flex-1 transition-all duration-300 ${selectedMovie ? 'pr-96' : ''}`}>        {/*If selectedMovie exists: add pr-96, If NOT:-> add nothing. here pr-96 = padding-right: 24rem (384px) it uses Backticks" ` "This is a template string. it lets you mix: normal text (class names) and JavaScript logic (${...}) */}
        <div
          className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-5 p-4 auto-rows-auto items-start">

          {movies.map((m: Movie, i: number) => (
            <div
              key={i}
              onClick={() => onSelectMovie(m)}
              className="flex flex-col overflow-hidden rounded-xl bg-[#111] text-white shadow-md transition-all duration-300 hover:shadow-red-500/30 hover:scale-105 cursor-pointer"
            >
              <div className="aspect-4/5 w-full bg-gray-100">
                <img
                  src={m.Poster}
                  alt={m.Title}
                  className="w-full object-cover"   //w-full-> image take full width of the container(the one we see first in hero)
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

      {/* Detail Panel - Right Side (Fixed) */}
      {selectedMovie && (
        <div className="absolute right-0 top-0 h-full w-96 bg-linear-to-b from-black via-gray-900 to-black text-white border-l border-red-600/30 shadow-2xl overflow-y-auto z-20">    {/*when we place absolute the side pannel position itself to that of the hero component*/}
          {/* Close Button */}
          <div className="sticky top-0 bg-black/80 backdrop-blur-sm p-4 border-b border-gray-800 flex justify-between items-center">
            <h3 className="text-lg font-bold">Movie Details</h3>
            <button
              onClick={onClose}
              className="text-gray-400 hover:text-white text-xl"
            >
              ✕     {/*icon to close right side pannel*/}

            </button>
          </div>

          <div className="p-4 space-y-4">      {/*Adds space inside the container*/}
            <div className="flex gap-4 items-start">     {/*items-start->Aligns items at the top So if one item is taller, others stay aligned at the top (Place items side by side with spacing, aligned at the top)*/}
              {/* Poster */}
              <img
                src={selectedMovie.Poster}
                alt={selectedMovie.Title}
                className="w-36 shrink-0 rounded-lg shadow-lg border border-gray-700 object-cover"
              />

              {/* Title & Info */}
              <div className="min-w-0 flex-1">          {/*min-w-0 ->Prevents overflow issues Without this: text might push layout outside container, With this: text can shrink properly truncation/ellipsis works correctly (Take remaining space but allow shrinking without breaking layout) */}
                <h1 className="text-2xl font-bold mb-2 leading-tight">{selectedMovie.Title}</h1>  {/*mb-2 -> Margin bottom (space below heading), leading-tight -> Reduces line spacing (tighter text) */}
                <div className="space-y-1 text-sm text-gray-400">                               {/*space-y-1 = Small vertical spacing between lines */}
                  <p><span className="text-gray-300">Year:</span> {selectedMovie.Year}</p>
                  <p><span className="text-gray-300">Type:</span> {selectedMovie.Type}</p>
                  <p><span className="text-gray-300">Rating:</span> <span className="text-yellow-400 font-semibold">{selectedMovie.imdbRating}</span></p>
                  <p><span className="text-gray-300">Runtime:</span> {selectedMovie.Runtime}</p>
                </div>
              </div>
            </div>

            {/* Plot */}
            <div>
              <h3 className="font-semibold text-sm mb-2 text-gray-300">Plot</h3>
              <p className="text-xs text-gray-400 leading-relaxed line-clamp-4">
                {selectedMovie.Plot || "No description available"}
              </p>
            </div>

            {/* Divider */}
            <div className="border-t border-gray-700"></div>

            {/* Your Rating */}
            <div>
              <h3 className="font-semibold text-sm mb-2 text-gray-300">Your Rating</h3>
              <div className="flex gap-2">
                {[1, 2, 3, 4, 5].map((star) => (
                  <span
                    key={star}
                    onClick={() => setRating(star)}
                    onMouseEnter={() => setHover(star)}
                    onMouseLeave={() => setHover(0)}
                    className="cursor-pointer text-2xl transition-transform hover:scale-110"
                  >
                    {star <= (hover || rating) ? "⭐" : "☆"}
                  </span>
                ))}
              </div>
            </div>

            {/* Review Textarea */}
            <div>
              <h3 className="font-semibold text-sm mb-2 text-gray-300">Write Review</h3>
              <textarea
                className="w-full p-2 rounded bg-gray-800/50 text-white text-xs border border-gray-700 focus:border-red-600 focus:outline-none"
                placeholder="Share your thoughts..."
                value={review}
                onChange={(e) => setReview(e.target.value)}
                rows={3}
              />
              <button
                onClick={handleSaveReview}
                className="w-full mt-2 px-3 py-2 bg-red-600 hover:bg-red-700 rounded font-semibold text-sm transition-colors"
              >
                Save Review
              </button>
            </div>

            {/* Saved Reviews */}
            {reviewsForMovie.length > 0 && (
              <div>
                <h3 className="font-semibold text-sm mb-2 text-gray-300">Your Reviews ({reviewsForMovie.length})</h3>
                <div className="space-y-2 max-h-48 overflow-y-auto">

                  {/* review boxes for each review */}
                  {reviewsForMovie.map((r, idx) => (
                    <div key={r.id || idx} className="bg-gray-800/40 border border-gray-700 p-2 rounded relative">

                      <button
                        type="button"
                        onClick={() => handleDeleteReview(r.id || `${r.movieId}-${idx}`)}         // This runs a delete function on click, passing either the review’s real ID or a fallback ID made from movie ID and index.
                        className="absolute right-2 top-2 inline-flex h-5 w-5 items-center justify-center rounded-full border border-gray-600 bg-black/60 text-[10px] text-gray-300 transition hover:border-red-500 hover:text-red-400"
                        aria-label="Delete review"
                      >
                        -        {/*button use to delete review*/}

                      </button>
                      <div className="flex items-center justify-between mb-1 pr-6">
                        <span className="text-xs font-semibold text-gray-300">{r.title}</span>
                        <span className="text-yellow-400 text-sm">{'⭐'.repeat(r.rating)}</span>
                      </div>

                      {/* date and review text */}
                      <p className="text-xs text-gray-400 leading-relaxed">{r.review}</p>
                      <p className="mt-2 inline-flex items-center rounded-full border border-gray-700 bg-black/40 px-2 py-1 text-[11px] text-gray-300">
                        Added on {r.date || new Date(r.createdAt).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric',
                          hour: '2-digit',
                          minute: '2-digit',
                        })}
                      </p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
export default Hero;



  