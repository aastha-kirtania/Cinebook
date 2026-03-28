import type { Booking, Movie, Showtime } from "../data/movies";

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || "http://localhost:3001/api";

export type ApiBooking = Booking & {
  dateLabel: string;
  moviePosterImage?: string;
};

export type ShowtimeDetails = {
  showtime: Showtime;
  movie: Movie;
  bookedSeats: string[];
};

async function apiFetch<T>(path: string, init?: RequestInit): Promise<T> {
  const response = await fetch(`${API_BASE_URL}${path}`, {
    headers: {
      "Content-Type": "application/json",
      ...(init?.headers ?? {}),
    },
    ...init,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "Request failed");
  }

  return response.json() as Promise<T>;
}

export function fetchMovies(search?: string) {
  const query = search?.trim() ? `?search=${encodeURIComponent(search.trim())}` : "";
  return apiFetch<Movie[]>(`/movies${query}`);
}

export function fetchMovie(movieId: string) {
  return apiFetch<Movie>(`/movies/${movieId}`);
}

export function fetchMovieShowtimes(movieId: string) {
  return apiFetch<Showtime[]>(`/movies/${movieId}/showtimes`);
}

export function fetchShowtimeDetails(showtimeId: string) {
  return apiFetch<ShowtimeDetails>(`/showtimes/${showtimeId}`);
}

export function fetchBookings() {
  return apiFetch<ApiBooking[]>("/bookings");
}

export function fetchBooking(bookingId: string) {
  return apiFetch<ApiBooking>(`/bookings/${bookingId}`);
}

export function createBooking(input: { showtimeId: string; seats: string[] }) {
  return apiFetch<ApiBooking>("/bookings", {
    method: "POST",
    body: JSON.stringify(input),
  });
}

export function cancelBookingRequest(bookingId: string) {
  return apiFetch<ApiBooking>(`/bookings/${bookingId}/cancel`, {
    method: "PATCH",
  });
}
