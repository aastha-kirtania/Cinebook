import { Button } from "@/components/ui/button";
import { fetchBooking } from "@/lib/api";
import { useQuery } from "@tanstack/react-query";
import { useNavigate, useParams } from "@tanstack/react-router";
import {
  BookOpen,
  Calendar,
  CheckCircle,
  Clock,
  Home,
  MapPin,
  Ticket,
} from "lucide-react";
import { motion } from "motion/react";

export function ConfirmationPage() {
  const { bookingId } = useParams({ strict: false }) as { bookingId: string };
  const navigate = useNavigate();
  const { data: booking, isLoading } = useQuery({
    queryKey: ["booking", bookingId],
    queryFn: () => fetchBooking(bookingId),
    enabled: Boolean(bookingId),
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cinema-muted">Loading booking...</p>
      </div>
    );
  }

  if (!booking) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-cinema-muted">Booking not found.</p>
      </div>
    );
  }

  const dateLabel = new Date(`${booking.date}T12:00:00`).toLocaleDateString(
    "en-US",
    { weekday: "short", month: "long", day: "numeric" },
  );

  return (
    <main className="min-h-screen bg-cinema-bg flex items-center justify-center py-16 px-4">
      <motion.div
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, type: "spring" }}
        data-ocid="confirmation.panel"
        className="w-full max-w-lg"
      >
        <div className="text-center mb-8">
          <motion.div
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            transition={{ delay: 0.2, type: "spring", stiffness: 200 }}
          >
            <CheckCircle className="w-20 h-20 text-cinema-gold mx-auto mb-4" />
          </motion.div>
          <h1 className="text-3xl font-black uppercase tracking-widest text-cinema-text mb-2">
            Booking <span className="text-cinema-gold">Confirmed!</span>
          </h1>
          <p className="text-cinema-muted text-sm">
            Your tickets are booked. Enjoy the show!
          </p>
        </div>

        <div className="bg-cinema-card border border-cinema-border rounded-2xl overflow-hidden shadow-2xl">
          {booking.moviePosterImage && (
            <div className="relative h-32 overflow-hidden">
              <img
                src={booking.moviePosterImage}
                alt={booking.movieTitle}
                className="w-full h-full object-cover opacity-50"
              />
              <div className="absolute inset-0 bg-gradient-to-b from-transparent to-cinema-card" />
            </div>
          )}

          <div className="relative flex items-center px-6 py-2">
            <div className="flex-1 border-t border-dashed border-cinema-border" />
            <div className="mx-4">
              <Ticket className="w-5 h-5 text-cinema-gold" />
            </div>
            <div className="flex-1 border-t border-dashed border-cinema-border" />
          </div>

          <div className="px-6 pb-6">
            <h2 className="text-cinema-text font-black text-xl mb-4">
              {booking.movieTitle}
            </h2>

            <div className="grid grid-cols-2 gap-4 mb-6">
              <div>
                <div className="flex items-center gap-1.5 text-cinema-muted text-xs mb-1">
                  <Calendar className="w-3.5 h-3.5" /> DATE
                </div>
                <p className="text-cinema-text font-semibold text-sm">
                  {dateLabel}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-cinema-muted text-xs mb-1">
                  <Clock className="w-3.5 h-3.5" /> TIME
                </div>
                <p className="text-cinema-text font-semibold text-sm">
                  {booking.time}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-cinema-muted text-xs mb-1">
                  <MapPin className="w-3.5 h-3.5" /> HALL
                </div>
                <p className="text-cinema-text font-semibold text-sm">
                  {booking.hall}
                </p>
              </div>
              <div>
                <div className="flex items-center gap-1.5 text-cinema-muted text-xs mb-1">
                  <Ticket className="w-3.5 h-3.5" /> SEATS
                </div>
                <p className="text-cinema-text font-semibold text-sm">
                  {booking.seats.join(", ")}
                </p>
              </div>
            </div>

            <div className="bg-cinema-inner rounded-lg p-4 flex items-center justify-between mb-6">
              <div>
                <p className="text-cinema-muted text-xs mb-1">BOOKING ID</p>
                <p className="text-cinema-gold font-mono font-bold text-sm">
                  {booking.id}
                </p>
              </div>
              <div className="text-right">
                <p className="text-cinema-muted text-xs mb-1">TOTAL PAID</p>
                <p className="text-cinema-gold font-black text-2xl">
                  ${booking.totalPrice}
                </p>
              </div>
            </div>

            <div className="flex gap-3">
              <Button
                data-ocid="confirmation.primary_button"
                onClick={() => navigate({ to: "/" })}
                className="flex-1 bg-cinema-gold hover:bg-red-700 text-cinema-bg font-bold text-xs tracking-wider uppercase rounded-sm flex items-center justify-center gap-2"
              >
                <Home className="w-4 h-4" /> HOME
              </Button>
              <Button
                data-ocid="confirmation.secondary_button"
                onClick={() => navigate({ to: "/my-bookings" })}
                variant="outline"
                className="flex-1 border-cinema-border text-cinema-muted hover:text-cinema-text hover:border-cinema-gold font-bold text-xs tracking-wider uppercase rounded-sm flex items-center justify-center gap-2"
              >
                <BookOpen className="w-4 h-4" /> MY BOOKINGS
              </Button>
            </div>
          </div>
        </div>
      </motion.div>
    </main>
  );
}
