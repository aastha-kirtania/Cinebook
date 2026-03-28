import type { Movie } from "../data/movies";
import { getPosterFallback } from "../lib/posterFallback";

interface MoviePosterProps {
  movie: Movie;
  className?: string;
  showOverlay?: boolean;
}

export function MoviePoster({
  movie,
  className = "",
  showOverlay = true,
}: MoviePosterProps) {
  return (
    <div
      className={`relative overflow-hidden rounded-lg bg-cinema-inner ${className}`}
      style={{ aspectRatio: "2/3" }}
    >
      <img
        src={movie.posterImage}
        alt={movie.title}
        className="w-full h-full object-cover"
        loading="lazy"
        onError={(event) => {
          event.currentTarget.onerror = null;
          event.currentTarget.src = getPosterFallback(movie);
        }}
      />
      {showOverlay && (
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/20 to-transparent">
          <div className="absolute bottom-0 left-0 right-0 p-3">
            <div className="text-xs font-semibold tracking-wider text-cinema-gold uppercase mb-1">
              {movie.genre}
            </div>
            <div className="text-sm font-bold text-cinema-text leading-tight">
              {movie.title}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
