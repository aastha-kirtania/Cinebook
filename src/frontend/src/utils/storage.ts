import type { Booking } from "../data/movies";
import { getPreSeededSeats } from "../data/movies";

const BOOKINGS_KEY = "cinebook_bookings";

export function getBookedSeats(showtimeId: string): string[] {
  const key = `cinebook_booked_${showtimeId}`;
  const stored = localStorage.getItem(key);
  if (stored) return JSON.parse(stored);

  // Pre-seed
  const preSeeded = getPreSeededSeats(showtimeId);
  localStorage.setItem(key, JSON.stringify(preSeeded));
  return preSeeded;
}

export function addBookedSeats(showtimeId: string, seats: string[]): void {
  const key = `cinebook_booked_${showtimeId}`;
  const current = getBookedSeats(showtimeId);
  const updated = [...new Set([...current, ...seats])];
  localStorage.setItem(key, JSON.stringify(updated));
}

export function removeBookedSeats(showtimeId: string, seats: string[]): void {
  const key = `cinebook_booked_${showtimeId}`;
  const current = getBookedSeats(showtimeId);
  const updated = current.filter((s) => !seats.includes(s));
  localStorage.setItem(key, JSON.stringify(updated));
}

export function getBookings(): Booking[] {
  const stored = localStorage.getItem(BOOKINGS_KEY);
  if (!stored) return [];
  return JSON.parse(stored);
}

export function saveBooking(booking: Booking): void {
  const bookings = getBookings();
  bookings.unshift(booking);
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
}

export function cancelBooking(bookingId: string): void {
  const bookings = getBookings();
  const idx = bookings.findIndex((b) => b.id === bookingId);
  if (idx === -1) return;
  const booking = bookings[idx];
  booking.status = "cancelled";
  bookings[idx] = booking;
  localStorage.setItem(BOOKINGS_KEY, JSON.stringify(bookings));
  removeBookedSeats(booking.showtimeId, booking.seats);
}

export function generateBookingId(): string {
  return `CB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).substring(2, 6).toUpperCase()}`;
}
