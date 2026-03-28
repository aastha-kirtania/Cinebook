import { fetchMovies } from "@/lib/api";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { useQuery } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { ChevronLeft, ChevronRight, Clock, Star } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useMemo, useRef, useState } from "react";
import { MoviePoster } from "../components/MoviePoster";
import { getPosterFallback } from "../lib/posterFallback";

const MAIN_GENRES = [
  "Action",
  "Adventure",
  "Comedy",
  "Drama",
  "Romance",
  "Thriller",
];

export function HomePage() {
  const navigate = useNavigate();
  const [heroIndex, setHeroIndex] = useState(0);
  const [activeGenre, setActiveGenre] = useState("All");
  const intervalRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const nowShowingRef = useRef<HTMLDivElement>(null);

  const searchQuery =
    typeof window !== "undefined"
      ? (new URLSearchParams(window.location.search).get("search") ?? "")
      : "";

  const { data: movies = [], isLoading } = useQuery({
    queryKey: ["movies", searchQuery],
    queryFn: () => fetchMovies(searchQuery),
  });

  const genres = useMemo(
    () => [
      "All",
      ...MAIN_GENRES.filter((genre) =>
        movies.some((movie) => movie.genre === genre),
      ),
    ],
    [movies],
  );

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    if (params.get("section") === "showtimes" && nowShowingRef.current) {
      nowShowingRef.current.scrollIntoView({ behavior: "smooth" });
    }
  }, []);

  useEffect(() => {
    if (movies.length === 0) return;

    intervalRef.current = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % movies.length);
    }, 4000);

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current);
    };
  }, [movies.length]);

  useEffect(() => {
    if (heroIndex >= movies.length) {
      setHeroIndex(0);
    }
  }, [heroIndex, movies.length]);

  const resetInterval = () => {
    if (movies.length === 0) return;
    if (intervalRef.current) clearInterval(intervalRef.current);
    intervalRef.current = setInterval(() => {
      setHeroIndex((prev) => (prev + 1) % movies.length);
    }, 4000);
  };

  const prevHero = () => {
    if (movies.length === 0) return;
    setHeroIndex((prev) => (prev - 1 + movies.length) % movies.length);
    resetInterval();
  };

  const nextHero = () => {
    if (movies.length === 0) return;
    setHeroIndex((prev) => (prev + 1) % movies.length);
    resetInterval();
  };

  const filteredMovies = movies.filter(
    (movie) => activeGenre === "All" || movie.genre === activeGenre,
  );

  if (isLoading) {
    return (
      <main className="min-h-screen bg-cinema-bg flex items-center justify-center">
        <p className="text-cinema-muted">Loading movies...</p>
      </main>
    );
  }

  if (movies.length === 0) {
    return (
      <main className="min-h-screen bg-cinema-bg flex items-center justify-center">
        <p className="text-cinema-muted">No movies available.</p>
      </main>
    );
  }

  const heroMovie = movies[heroIndex];
  const prevIdx = (heroIndex - 1 + movies.length) % movies.length;
  const nextIdx = (heroIndex + 1) % movies.length;

  return (
    <main className="min-h-screen bg-cinema-bg">
      <section
        className="relative py-10 overflow-hidden"
        style={{
          background:
            "radial-gradient(ellipse at center, rgba(122, 8, 18, 0.55) 0%, #141414 68%)",
        }}
      >
        <div className="max-w-[1200px] mx-auto px-6">
          <div className="relative flex items-center justify-center gap-4 md:gap-8">
            <button
              type="button"
              data-ocid="hero.pagination_prev"
              onClick={prevHero}
              className="z-10 w-10 h-10 rounded-full border-2 border-cinema-gold/60 text-cinema-gold flex items-center justify-center hover:bg-cinema-gold hover:text-cinema-bg transition-all flex-shrink-0"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="hidden md:block w-40 opacity-40 scale-90 flex-shrink-0 pointer-events-none select-none">
              <MoviePoster movie={movies[prevIdx]} />
            </div>

            <AnimatePresence mode="wait">
              <motion.div
                key={heroIndex}
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.35 }}
                className="relative w-full max-w-[560px] flex-shrink-0 cursor-pointer group"
                onClick={() =>
                  navigate({ to: "/movie/$id", params: { id: heroMovie.id } })
                }
              >
                <div
                  className="relative overflow-hidden rounded-2xl shadow-2xl"
                  style={{ aspectRatio: "16/9" }}
                >
                  <img
                    src={heroMovie.posterImage}
                    alt={heroMovie.title}
                    className="w-full h-full object-cover"
                    onError={(event) => {
                      event.currentTarget.onerror = null;
                      event.currentTarget.src = getPosterFallback(heroMovie);
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/30 to-transparent" />
                  <div className="absolute inset-0 flex flex-col justify-end p-6 md:p-8">
                    <Badge className="w-fit mb-3 bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/40 text-xs tracking-wider">
                      {heroMovie.genre}
                    </Badge>
                    <h1 className="text-2xl md:text-4xl font-black text-white mb-2 tracking-tight">
                      {heroMovie.title}
                    </h1>
                    <div className="flex items-center gap-3 mb-4">
                      <div className="flex items-center gap-1">
                        <Star className="w-4 h-4 fill-cinema-gold text-cinema-gold" />
                        <span className="text-cinema-gold font-bold text-sm">
                          {heroMovie.rating}
                        </span>
                      </div>
                      <span className="text-cinema-muted text-sm">|</span>
                      <div className="flex items-center gap-1 text-cinema-muted text-sm">
                        <Clock className="w-3.5 h-3.5" />
                        <span>{heroMovie.duration} min</span>
                      </div>
                    </div>
                    <p className="text-cinema-muted text-sm mb-5 max-w-xs line-clamp-2">
                      {heroMovie.description}
                    </p>
                    <Button
                      data-ocid="hero.primary_button"
                      className="w-fit bg-cinema-gold hover:bg-red-700 text-cinema-bg font-bold text-xs tracking-[0.12em] uppercase px-6 py-2 rounded-sm"
                      onClick={(e) => {
                        e.stopPropagation();
                        navigate({
                          to: "/movie/$id",
                          params: { id: heroMovie.id },
                        });
                      }}
                    >
                      BOOK TICKETS
                    </Button>
                  </div>
                </div>
              </motion.div>
            </AnimatePresence>

            <div className="hidden md:block w-40 opacity-40 scale-90 flex-shrink-0 pointer-events-none select-none">
              <MoviePoster movie={movies[nextIdx]} />
            </div>

            <button
              type="button"
              data-ocid="hero.pagination_next"
              onClick={nextHero}
              className="z-10 w-10 h-10 rounded-full border-2 border-cinema-gold/60 text-cinema-gold flex items-center justify-center hover:bg-cinema-gold hover:text-cinema-bg transition-all flex-shrink-0"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>

          <div className="flex items-center justify-center gap-2 mt-6">
            {movies.map((movie, i) => (
              <button
                type="button"
                key={movie.id}
                data-ocid="hero.toggle"
                onClick={() => {
                  setHeroIndex(i);
                  resetInterval();
                }}
                className={`h-1.5 rounded-full transition-all ${
                  i === heroIndex
                    ? "w-8 bg-cinema-gold"
                    : "w-2 bg-cinema-border hover:bg-cinema-muted"
                }`}
              />
            ))}
          </div>
        </div>
      </section>

      <section
        ref={nowShowingRef}
        className="max-w-[1200px] mx-auto px-6 py-12"
      >
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl md:text-3xl font-black uppercase tracking-[0.08em] text-cinema-text">
            Now <span className="text-cinema-gold">Showing</span>
          </h2>
          {searchQuery && (
            <p className="text-cinema-muted text-sm">
              Results for "{searchQuery}"
            </p>
          )}
        </div>

        <div className="flex flex-wrap gap-2 mb-8" data-ocid="movies.tab">
          {genres.map((genre) => (
            <button
              type="button"
              key={genre}
              data-ocid="movies.tab"
              onClick={() => setActiveGenre(genre)}
              className={`px-4 py-1.5 rounded-full text-xs font-semibold tracking-wider uppercase transition-all border ${
                activeGenre === genre
                  ? "bg-cinema-gold text-cinema-bg border-cinema-gold"
                  : "bg-transparent text-cinema-muted border-cinema-border hover:border-cinema-gold hover:text-cinema-gold"
              }`}
            >
              {genre}
            </button>
          ))}
        </div>

        {filteredMovies.length === 0 ? (
          <div
            data-ocid="movies.empty_state"
            className="text-center py-20 text-cinema-muted"
          >
            <p className="text-lg">No movies found</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-4">
            {filteredMovies.map((movie, idx) => (
              <motion.div
                key={movie.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                data-ocid={`movies.item.${idx + 1}`}
                className="group cursor-pointer"
                onClick={() =>
                  navigate({ to: "/movie/$id", params: { id: movie.id } })
                }
              >
                <div className="relative overflow-hidden rounded-lg transition-transform duration-300 group-hover:-translate-y-1 group-hover:shadow-card-hover">
                  <MoviePoster movie={movie} />
                  <div className="absolute top-2 right-2 bg-black/70 rounded px-1.5 py-0.5 flex items-center gap-1">
                    <Star className="w-3 h-3 fill-cinema-gold text-cinema-gold" />
                    <span className="text-xs text-cinema-gold font-bold">
                      {movie.rating}
                    </span>
                  </div>
                </div>
                <div className="mt-2.5 px-0.5">
                  <h3 className="text-cinema-text font-bold text-sm leading-tight mb-1 group-hover:text-cinema-gold transition-colors">
                    {movie.title}
                  </h3>
                  <span className="text-cinema-muted text-xs">
                    {movie.genre} | {movie.duration}m
                  </span>
                  <Button
                    data-ocid={`movies.primary_button.${idx + 1}`}
                    size="sm"
                    className="mt-2 w-full bg-cinema-gold hover:bg-red-700 text-cinema-bg text-xs font-bold tracking-wider uppercase rounded-sm h-8"
                    onClick={(e) => {
                      e.stopPropagation();
                      navigate({ to: "/movie/$id", params: { id: movie.id } });
                    }}
                  >
                    BOOK NOW
                  </Button>
                </div>
              </motion.div>
            ))}
          </div>
        )}
      </section>
    </main>
  );
}
