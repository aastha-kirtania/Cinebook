import { Button } from "@/components/ui/button";
import { createBooking, fetchShowtimeDetails } from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import { ArrowLeft, Clock, MapPin, Ticket } from "lucide-react";
import { motion } from "motion/react";
import { useState } from "react";
import { SEAT_COLS, SEAT_ROWS } from "../data/movies";
import { getPosterFallback } from "../lib/posterFallback";

export function SeatsPage() {
  const { showtimeId } = useParams({ strict: false }) as { showtimeId: string };
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data, isLoading } = useQuery({
    queryKey: ["showtime-details", showtimeId],
    queryFn: () => fetchShowtimeDetails(showtimeId),
    enabled: Boolean(showtimeId),
  });

  const showtime = data?.showtime;
  const movie = data?.movie;
  const [selectedSeats, setSelectedSeats] = useState<string[]>([]);

  const bookingMutation = useMutation({
    mutationFn: () => createBooking({ showtimeId, seats: selectedSeats }),
    onSuccess: async (booking) => {
      await queryClient.invalidateQueries({
        queryKey: ["showtime-details", showtimeId],
      });
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
      navigate({ to: "/confirmation/$bookingId", params: { bookingId: booking.id } });
    },
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cinema-muted">Loading seats...</p>
      </div>
    );
  }

  if (!showtime || !movie || !showtimeId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cinema-muted">Showtime not found.</p>
      </div>
    );
  }

  const toggleSeat = (seat: string) => {
    if (data.bookedSeats.includes(seat)) return;
    setSelectedSeats((prev) =>
      prev.includes(seat) ? prev.filter((s) => s !== seat) : [...prev, seat],
    );
  };

  const totalPrice = selectedSeats.length * showtime.price;

  const handleConfirm = () => {
    if (selectedSeats.length === 0) return;
    bookingMutation.mutate();
  };

  const getSeatStatus = (seat: string): "booked" | "selected" | "available" => {
    if (data.bookedSeats.includes(seat)) return "booked";
    if (selectedSeats.includes(seat)) return "selected";
    return "available";
  };

  return (
    <main className="min-h-screen bg-cinema-bg py-8">
      <div className="max-w-[1100px] mx-auto px-4">
        <button
          type="button"
          data-ocid="seats.button"
          onClick={() =>
            navigate({ to: "/movie/$id", params: { id: movie.id } })
          }
          className="flex items-center gap-1 text-cinema-muted hover:text-cinema-gold text-sm mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" /> Back
        </button>

        <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <h1 className="text-2xl font-black uppercase tracking-widest text-cinema-text mb-2">
              Select <span className="text-cinema-gold">Seats</span>
            </h1>
            <div className="mb-6 rounded-xl border border-cinema-border bg-cinema-card/70 px-4 py-4">
              <p className="text-cinema-muted text-xs tracking-[0.2em] uppercase mb-2">
                Booking For
              </p>
              <p className="text-cinema-text text-lg font-bold mb-3">{movie.title}</p>
              <div className="flex flex-wrap gap-x-5 gap-y-2 text-sm">
                <div className="flex items-center gap-2 text-cinema-muted">
                  <Clock className="w-4 h-4 text-cinema-gold" />
                  <span>{showtime.dateLabel} • {showtime.time}</span>
                </div>
                <div className="flex items-center gap-2 text-cinema-muted">
                  <MapPin className="w-4 h-4 text-cinema-gold" />
                  <span>{showtime.hall}</span>
                </div>
              </div>
            </div>

            <div className="mb-8 overflow-x-auto">
              <div className="mx-auto w-[660px] max-w-full">
                <div className="text-center mb-8">
                  <div className="relative mx-auto w-[560px] max-w-[92%]">
                    <div className="h-3 rounded-full bg-gradient-to-r from-transparent via-cinema-gold/80 to-transparent shadow-gold mb-2" />
                    <div className="mx-auto h-10 w-[92%] rounded-[999px] border border-cinema-gold/30 bg-gradient-to-b from-cinema-gold/20 via-cinema-gold/8 to-transparent" />
                    <p className="text-cinema-muted text-[11px] tracking-[0.35em] uppercase mt-3">
                      Screen
                    </p>
                  </div>
                </div>

                <div className="flex justify-center">
                  <div className="inline-flex flex-col items-center gap-2 rounded-[2rem] border border-cinema-border bg-cinema-card/55 px-5 py-6">
                    {SEAT_ROWS.map((row, rowIndex) => (
                      <div
                        key={row}
                        className="flex items-center justify-center gap-1.5"
                        style={{
                          transform: `scale(${1 - rowIndex * 0.018})`,
                          transformOrigin: "center top",
                        }}
                      >
                        <span className="text-cinema-muted text-xs w-5 text-center flex-shrink-0">
                          {row}
                        </span>
                        {SEAT_COLS.map((col) => {
                          const seat = `${row}${col}`;
                          const status = getSeatStatus(seat);
                          const isAisleEdge = col === 5 || col === 6;

                          return (
                            <button
                              type="button"
                              key={seat}
                              data-ocid="seats.toggle"
                              onClick={() => toggleSeat(seat)}
                              disabled={status === "booked"}
                              title={seat}
                              className={`h-8 w-8 rounded-md text-[10px] font-bold transition-all ${
                                isAisleEdge ? "mx-2" : ""
                              } ${
                                status === "booked"
                                  ? "bg-cinema-seat-booked text-cinema-muted cursor-not-allowed opacity-40"
                                  : status === "selected"
                                    ? "bg-cinema-gold text-cinema-bg scale-105 shadow-gold"
                                    : "bg-cinema-seat-available text-cinema-muted hover:bg-cinema-gold/70 hover:text-cinema-bg hover:scale-105"
                              }`}
                            >
                              {col}
                            </button>
                          );
                        })}
                        <span className="text-cinema-muted text-xs w-5 text-center flex-shrink-0">
                          {row}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="flex flex-wrap gap-6 mt-6">
              {[
                { label: "Available", cls: "bg-cinema-seat-available" },
                { label: "Selected", cls: "bg-cinema-gold" },
                { label: "Occupied", cls: "bg-cinema-seat-booked opacity-40" },
              ].map(({ label, cls }) => (
                <div key={label} className="flex items-center gap-2">
                  <div className={`w-5 h-5 rounded-sm ${cls}`} />
                  <span className="text-cinema-muted text-xs">{label}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.15 }}
            data-ocid="booking.panel"
            className="lg:sticky lg:top-24"
          >
            <div className="bg-cinema-card rounded-xl border border-cinema-border p-6">
              <h2 className="text-cinema-text font-bold uppercase tracking-widest text-xs mb-5">
                BOOKING SUMMARY
              </h2>

              <div className="flex gap-3 mb-5">
                <img
                  src={movie.posterImage}
                  alt={movie.title}
                  className="w-14 h-20 object-cover rounded-md flex-shrink-0"
                  onError={(event) => {
                    event.currentTarget.onerror = null;
                    event.currentTarget.src = getPosterFallback(movie);
                  }}
                />
                <div>
                  <h3 className="text-cinema-text font-bold text-sm leading-tight mb-1">
                    {movie.title}
                  </h3>
                  <p className="text-cinema-muted text-xs">
                    {showtime.dateLabel}
                  </p>
                  <p className="text-cinema-muted text-xs">{showtime.time}</p>
                  <p className="text-cinema-muted text-xs">{showtime.hall}</p>
                </div>
              </div>

              <div className="border-t border-cinema-border pt-4 mb-4">
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-cinema-muted">Seats</span>
                  <span className="text-cinema-text font-medium">
                    {selectedSeats.length > 0
                      ? [...selectedSeats].sort().join(", ")
                      : "None selected"}
                  </span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-cinema-muted">Price per seat</span>
                  <span className="text-cinema-text">${showtime.price}</span>
                </div>
                <div className="flex justify-between text-sm mb-2">
                  <span className="text-cinema-muted">Count</span>
                  <span className="text-cinema-text">
                    {selectedSeats.length}
                  </span>
                </div>
              </div>

              <div className="border-t border-cinema-border pt-4 mb-6">
                <div className="flex justify-between">
                  <span className="text-cinema-text font-bold">Total</span>
                  <span className="text-cinema-gold font-black text-xl">
                    ${totalPrice}
                  </span>
                </div>
              </div>

              <Button
                data-ocid="booking.submit_button"
                disabled={selectedSeats.length === 0 || bookingMutation.isPending}
                onClick={handleConfirm}
                className="w-full bg-cinema-gold hover:bg-red-700 disabled:opacity-40 text-cinema-bg font-bold text-sm tracking-[0.1em] uppercase rounded-sm flex items-center justify-center gap-2 py-3"
              >
                <Ticket className="w-4 h-4" /> CONFIRM BOOKING
              </Button>

              {bookingMutation.isError && (
                <p className="text-red-400 text-xs text-center mt-3">
                  {bookingMutation.error instanceof Error
                    ? bookingMutation.error.message
                    : "Booking failed"}
                </p>
              )}

              {selectedSeats.length === 0 && !bookingMutation.isError && (
                <p className="text-cinema-muted text-xs text-center mt-3">
                  Select at least one seat to continue
                </p>
              )}
            </div>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
