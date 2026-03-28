import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { fetchMovie, fetchMovieShowtimes } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, ChevronRight, Clock, Globe, MapPin, Star } from "lucide-react";
import { motion } from "motion/react";
import { useEffect, useMemo, useState } from "react";
import { getPosterFallback } from "../lib/posterFallback";

export function MovieDetailPage() {
  const { id } = useParams({ strict: false }) as { id: string };
  const navigate = useNavigate();
  const { data: movie, isLoading: movieLoading } = useQuery({
    queryKey: ["movie", id],
    queryFn: () => fetchMovie(id),
    enabled: Boolean(id),
  });
  const { data: showtimes = [], isLoading: showtimesLoading } = useQuery({
    queryKey: ["movie-showtimes", id],
    queryFn: () => fetchMovieShowtimes(id),
    enabled: Boolean(id),
  });

  const dates = useMemo(() => {
    const seen = new Set<string>();
    return showtimes.filter((showtime) => {
      if (seen.has(showtime.date)) return false;
      seen.add(showtime.date);
      return true;
    });
  }, [showtimes]);

  const [selectedDate, setSelectedDate] = useState("");
  const [selectedTime, setSelectedTime] = useState("");

  useEffect(() => {
    if (!selectedDate && dates[0]?.date) {
      setSelectedDate(dates[0].date);
    }
  }, [dates, selectedDate]);

  const timesForDate = showtimes.filter((showtime) => showtime.date === selectedDate);
  const selectedShowtime = timesForDate.find(
    (showtime) => showtime.time === selectedTime,
  );

  if (movieLoading || showtimesLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cinema-muted">Loading movie...</p>
      </div>
    );
  }

  if (!movie) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cinema-muted">Movie not found.</p>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-cinema-bg">
      <div className="relative h-64 md:h-80 overflow-hidden">
        <img
          src={movie.posterImage}
          alt={movie.title}
          className="w-full h-full object-cover blur-sm scale-105 opacity-40"
          onError={(event) => {
            event.currentTarget.onerror = null;
            event.currentTarget.src = getPosterFallback(movie);
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-cinema-bg/20 via-cinema-bg/60 to-cinema-bg" />
      </div>

      <div className="max-w-[1200px] mx-auto px-6 -mt-48 relative z-10">
        <button
          type="button"
          data-ocid="detail.button"
          onClick={() => navigate({ to: "/" })}
          className="flex items-center gap-1 text-cinema-muted hover:text-cinema-gold text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 md:grid-cols-[280px_1fr] gap-8 lg:gap-12">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="w-full max-w-[280px] mx-auto md:mx-0"
          >
            <div className="rounded-xl overflow-hidden shadow-2xl">
              <img
                src={movie.posterImage}
                alt={movie.title}
                className="w-full h-auto"
                style={{ aspectRatio: "2/3", objectFit: "cover" }}
                onError={(event) => {
                  event.currentTarget.onerror = null;
                  event.currentTarget.src = getPosterFallback(movie);
                }}
              />
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="pt-4"
          >
            <Badge className="mb-3 bg-cinema-gold/20 text-cinema-gold border border-cinema-gold/40 text-xs tracking-wider">
              {movie.genre}
            </Badge>
            <h1 className="text-3xl md:text-5xl font-black text-cinema-text mb-4 leading-tight">
              {movie.title}
            </h1>

            <div className="flex flex-wrap items-center gap-4 mb-6">
              <div className="flex items-center gap-1.5">
                <Star className="w-5 h-5 fill-cinema-gold text-cinema-gold" />
                <span className="text-cinema-gold font-bold text-lg">
                  {movie.rating}
                </span>
                <span className="text-cinema-muted text-sm">/10</span>
              </div>
              <div className="flex items-center gap-1.5 text-cinema-muted">
                <Clock className="w-4 h-4" />
                <span className="text-sm">
                  {Math.floor(movie.duration / 60)}h {movie.duration % 60}m
                </span>
              </div>
              <div className="flex items-center gap-1.5 text-cinema-muted">
                <Globe className="w-4 h-4" />
                <span className="text-sm">{movie.language}</span>
              </div>
              <div className="text-cinema-gold font-bold">
                ${movie.ticketPrice} / seat
              </div>
            </div>

            <p className="text-cinema-muted leading-relaxed mb-8 max-w-xl">
              {movie.description}
            </p>

            <div className="bg-cinema-card rounded-xl p-6 border border-cinema-border">
              <h3 className="text-cinema-text font-bold uppercase tracking-widest text-xs mb-5">
                SELECT DATE
              </h3>
              <div className="flex flex-wrap gap-2 mb-6">
                {dates.map((showtime) => (
                  <button
                    type="button"
                    key={showtime.date}
                    data-ocid="showtimes.tab"
                    onClick={() => {
                      setSelectedDate(showtime.date);
                      setSelectedTime("");
                    }}
                    className={`px-4 py-2 rounded-md text-sm font-semibold transition-all border ${
                      selectedDate === showtime.date
                        ? "bg-cinema-gold text-cinema-bg border-cinema-gold"
                        : "bg-cinema-inner text-cinema-muted border-cinema-border hover:border-cinema-gold hover:text-cinema-text"
                    }`}
                  >
                    {showtime.dateLabel}
                  </button>
                ))}
              </div>

              <h3 className="text-cinema-text font-bold uppercase tracking-widest text-xs mb-4">
                SELECT SHOWTIME
              </h3>
              <div className="flex flex-wrap gap-3 mb-6">
                {timesForDate.map((showtime) => (
                  <button
                    type="button"
                    key={showtime.id}
                    data-ocid="showtimes.tab"
                    onClick={() => setSelectedTime(showtime.time)}
                    className={`px-5 py-2.5 rounded-md text-sm font-semibold transition-all border ${
                      selectedTime === showtime.time
                        ? "bg-cinema-gold text-cinema-bg border-cinema-gold"
                        : "bg-cinema-inner text-cinema-muted border-cinema-border hover:border-cinema-gold hover:text-cinema-text"
                    }`}
                  >
                    <div className="text-base">{showtime.time}</div>
                    <div className="text-xs opacity-70 mt-0.5">
                      {showtime.hall}
                    </div>
                  </button>
                ))}
              </div>

              {selectedShowtime && (
                <div className="mb-6 rounded-xl border border-cinema-gold/30 bg-cinema-inner px-4 py-4">
                  <p className="text-cinema-gold text-xs font-bold tracking-[0.18em] uppercase mb-3">
                    Selected Session
                  </p>
                  <div className="flex flex-wrap gap-x-6 gap-y-2 text-sm">
                    <div className="flex items-center gap-2 text-cinema-text">
                      <Clock className="w-4 h-4 text-cinema-gold" />
                      <span>{selectedShowtime.time}</span>
                    </div>
                    <div className="flex items-center gap-2 text-cinema-text">
                      <MapPin className="w-4 h-4 text-cinema-gold" />
                      <span>{selectedShowtime.hall}</span>
                    </div>
                  </div>
                </div>
              )}

              <Button
                data-ocid="detail.primary_button"
                disabled={!selectedShowtime}
                onClick={() =>
                  selectedShowtime &&
                  navigate({
                    to: "/seats/$showtimeId",
                    params: { showtimeId: selectedShowtime.id },
                  })
                }
                className="w-full md:w-auto bg-cinema-gold hover:bg-red-700 disabled:opacity-40 text-cinema-bg font-bold text-sm tracking-[0.1em] uppercase px-8 py-3 rounded-sm flex items-center justify-center gap-2"
              >
                SELECT SEATS <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
