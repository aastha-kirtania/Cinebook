import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  ApiBooking,
  cancelBookingRequest,
  fetchBookings,
} from "@/lib/api";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { useNavigate } from "@tanstack/react-router";
import { Calendar, Clock, Film, MapPin, Ticket, Trash2 } from "lucide-react";
import { AnimatePresence, motion } from "motion/react";

export function MyBookingsPage() {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { data: bookings = [], isLoading } = useQuery({
    queryKey: ["bookings"],
    queryFn: fetchBookings,
  });
  const cancelMutation = useMutation({
    mutationFn: cancelBookingRequest,
    onSuccess: async () => {
      await queryClient.invalidateQueries({ queryKey: ["bookings"] });
    },
  });

  const handleCancel = (bookingId: string) => {
    cancelMutation.mutate(bookingId);
  };

  const activeBookings = bookings.filter((booking) => booking.status === "confirmed");
  const cancelledBookings = bookings.filter((booking) => booking.status === "cancelled");

  if (isLoading) {
    return (
      <main className="min-h-screen bg-cinema-bg py-10 flex items-center justify-center">
        <p className="text-cinema-muted">Loading bookings...</p>
      </main>
    );
  }

  return (
    <main className="min-h-screen bg-cinema-bg py-10">
      <div className="max-w-[900px] mx-auto px-4">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <h1 className="text-3xl font-black uppercase tracking-[0.08em] text-cinema-text mb-2">
            My <span className="text-cinema-gold">Bookings</span>
          </h1>
          <p className="text-cinema-muted text-sm mb-8">
            All your ticket reservations in one place.
          </p>
        </motion.div>

        {bookings.length === 0 ? (
          <motion.div
            data-ocid="bookings.empty_state"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="text-center py-24"
          >
            <Film className="w-16 h-16 text-cinema-border mx-auto mb-4" />
            <p className="text-cinema-text font-bold text-xl mb-2">
              No bookings yet
            </p>
            <p className="text-cinema-muted text-sm mb-6">
              Book your first movie ticket to see it here.
            </p>
            <Button
              data-ocid="bookings.primary_button"
              onClick={() => navigate({ to: "/" })}
              className="bg-cinema-gold hover:bg-red-700 text-cinema-bg font-bold text-xs tracking-wider uppercase rounded-sm px-6"
            >
              BROWSE MOVIES
            </Button>
          </motion.div>
        ) : (
          <>
            {activeBookings.length > 0 && (
              <section className="mb-10">
                <h2 className="text-xs font-bold tracking-widest uppercase text-cinema-muted mb-4">
                  Active Bookings ({activeBookings.length})
                </h2>
                <div className="space-y-4">
                  <AnimatePresence>
                    {activeBookings.map((booking, idx) => (
                      <BookingCard
                        key={booking.id}
                        booking={booking}
                        idx={idx + 1}
                        onCancel={handleCancel}
                      />
                    ))}
                  </AnimatePresence>
                </div>
              </section>
            )}

            {cancelledBookings.length > 0 && (
              <section>
                <h2 className="text-xs font-bold tracking-widest uppercase text-cinema-muted mb-4">
                  Cancelled ({cancelledBookings.length})
                </h2>
                <div className="space-y-4 opacity-50">
                  {cancelledBookings.map((booking, idx) => (
                    <BookingCard key={booking.id} booking={booking} idx={idx + 1} />
                  ))}
                </div>
              </section>
            )}
          </>
        )}
      </div>
    </main>
  );
}

function BookingCard({
  booking,
  idx,
  onCancel,
}: {
  booking: ApiBooking;
  idx: number;
  onCancel?: (id: string) => void;
}) {
  const dateLabel = new Date(`${booking.date}T12:00:00`).toLocaleDateString(
    "en-US",
    { month: "short", day: "numeric", year: "numeric" },
  );

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, x: -20 }}
      data-ocid={`bookings.item.${idx}`}
      className="bg-cinema-card border border-cinema-border rounded-xl overflow-hidden hover:border-cinema-gold/40 transition-colors"
    >
      <div className="flex flex-col sm:flex-row gap-0">
        {booking.moviePosterImage && (
          <div className="w-full sm:w-24 h-24 sm:h-auto flex-shrink-0 overflow-hidden">
            <img
              src={booking.moviePosterImage}
              alt={booking.movieTitle}
              className="w-full h-full object-cover"
            />
          </div>
        )}

        <div className="flex-1 p-4">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1">
              <div className="flex items-center gap-2 mb-1">
                <h3 className="text-cinema-text font-bold text-base">
                  {booking.movieTitle}
                </h3>
                <Badge
                  className={`text-xs ${
                    booking.status === "confirmed"
                      ? "bg-green-900/40 text-green-400 border-green-700/50"
                      : "bg-red-900/30 text-red-400 border-red-700/40"
                  }`}
                >
                  {booking.status}
                </Badge>
              </div>

              <div className="flex flex-wrap gap-x-4 gap-y-1 text-cinema-muted text-xs mb-2">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3 h-3" />
                  {dateLabel}
                </span>
                <span className="flex items-center gap-1">
                  <Clock className="w-3 h-3" />
                  {booking.time}
                </span>
                <span className="flex items-center gap-1">
                  <MapPin className="w-3 h-3" />
                  {booking.hall}
                </span>
                <span className="flex items-center gap-1">
                  <Ticket className="w-3 h-3" />
                  {booking.seats.join(", ")}
                </span>
              </div>
            </div>

            <div className="text-right flex-shrink-0">
              <p className="text-cinema-gold font-black text-lg">
                ${booking.totalPrice}
              </p>
              <p className="text-cinema-muted text-xs font-mono">
                {booking.id}
              </p>
            </div>
          </div>

          {booking.status === "confirmed" && onCancel && (
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button
                  data-ocid={`bookings.delete_button.${idx}`}
                  variant="outline"
                  size="sm"
                  className="mt-2 border-red-700/40 text-red-400 hover:bg-red-900/20 hover:text-red-300 text-xs rounded-sm flex items-center gap-1.5"
                >
                  <Trash2 className="w-3.5 h-3.5" /> CANCEL BOOKING
                </Button>
              </AlertDialogTrigger>
              <AlertDialogContent
                data-ocid="bookings.dialog"
                className="bg-cinema-card border-cinema-border"
              >
                <AlertDialogHeader>
                  <AlertDialogTitle className="text-cinema-text">
                    Cancel Booking?
                  </AlertDialogTitle>
                  <AlertDialogDescription className="text-cinema-muted">
                    Are you sure you want to cancel your booking for{" "}
                    <strong className="text-cinema-text">
                      {booking.movieTitle}
                    </strong>
                    ? Your seats will be released.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel
                    data-ocid="bookings.cancel_button"
                    className="bg-cinema-inner border-cinema-border text-cinema-muted hover:text-cinema-text"
                  >
                    Keep Booking
                  </AlertDialogCancel>
                  <AlertDialogAction
                    data-ocid="bookings.confirm_button"
                    onClick={() => onCancel(booking.id)}
                    className="bg-red-700 hover:bg-red-600 text-white"
                  >
                    Yes, Cancel
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          )}
        </div>
      </div>
    </motion.div>
  );
}
