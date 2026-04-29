interface NavbarProps {
  query: string;
  setQuery: (value: string) => void;
  totalResults: number;
}
function Navbar({ query, setQuery, totalResults, onReset }: NavbarProps & { onReset: () => void }) {
  return (
     <div className="flex w-full items-center justify-between gap-4 bg-gradient-to-r from-gray-800 via-gray-900 to-gray-800 p-4 text-white shadow-lg">
        <h1 
        onClick={onReset}
        className="text-3xl font-bold tracking-wide !text-white cursor-pointer">
          🎬 
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
    );
}

export default Navbar;

        



    