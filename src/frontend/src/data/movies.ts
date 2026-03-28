export interface Movie {
  id: string;
  title: string;
  genre: string;
  duration: number;
  rating: number;
  description: string;
  language: string;
  posterColor: string;
  posterImage: string;
  ticketPrice: number;
}

export interface Showtime {
  id: string;
  movieId: string;
  date: string;
  dateLabel: string;
  time: string;
  hall: string;
  price: number;
}

export interface Booking {
  id: string;
  movieId: string;
  movieTitle: string;
  showtimeId: string;
  date: string;
  time: string;
  hall: string;
  seats: string[];
  totalPrice: number;
  timestamp: number;
  status: "confirmed" | "cancelled";
}

export const MOVIES: Movie[] = [
  {
    id: "1",
    title: "Galactic Storm",
    genre: "Sci-Fi",
    duration: 142,
    rating: 8.4,
    description:
      "A crew of astronauts must prevent a rogue AI from destroying the galaxy. In the farthest reaches of space, where stars are born and die, humanity's last hope rests on a team of unlikely heroes.",
    language: "English",
    posterColor: "#102845",
    posterImage:
      "https://images.unsplash.com/photo-1763074100766-7a20ea4a18df?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1200",
    ticketPrice: 15,
  },
  {
    id: "2",
    title: "Shadow Kingdom",
    genre: "Action",
    duration: 128,
    rating: 7.9,
    description:
      "An elite soldier goes rogue to expose a government conspiracy. When loyalty becomes a liability, one man must choose between duty and truth in a battle that will shake the foundations of power.",
    language: "English",
    posterColor: "#271017",
    posterImage:
      "https://images.unsplash.com/photo-1687585612462-cb26cc62ca9b?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1200",
    ticketPrice: 12,
  },
  {
    id: "3",
    title: "Eternal Bloom",
    genre: "Romance",
    duration: 110,
    rating: 8.1,
    description:
      "Two strangers meet at the end of the world and fall hopelessly in love. Against the backdrop of Earth's final sunset, a bond forms that transcends time, space, and the inevitable.",
    language: "English",
    posterColor: "#4c2232",
    posterImage:
      "https://images.unsplash.com/photo-1750076914104-cccd074a8ae1?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1200",
    ticketPrice: 12,
  },
  {
    id: "4",
    title: "Iron Verdict",
    genre: "Thriller",
    duration: 135,
    rating: 7.6,
    description:
      "A retired judge is forced back into a deadly game of cat and mouse. When the hunter becomes the hunted, justice must be carved out in the shadows.",
    language: "English",
    posterColor: "#2f090d",
    posterImage:
      "https://images.unsplash.com/photo-1730114101031-28c807f1acf9?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1200",
    ticketPrice: 12,
  },
  {
    id: "5",
    title: "Laughing Ghosts",
    genre: "Comedy",
    duration: 98,
    rating: 7.2,
    description:
      "A family moves into a haunted house and the ghosts are surprisingly funny. What started as a nightmare quickly becomes the most entertaining summer the Henderson family has ever had.",
    language: "English",
    posterColor: "#47394a",
    posterImage:
      "https://images.unsplash.com/photo-1730861780373-b8724525e155?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1200",
    ticketPrice: 12,
  },
  {
    id: "6",
    title: "The Last Dawn",
    genre: "Drama",
    duration: 118,
    rating: 8.7,
    description:
      "A powerful drama about sacrifice and redemption in post-war Europe. When the dust settles, all that remains is the choice between who we were and who we must become.",
    language: "English",
    posterColor: "#3b1c16",
    posterImage:
      "https://images.unsplash.com/photo-1743309411498-a0f4f4b96b65?auto=format&fit=crop&fm=jpg&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&ixlib=rb-4.1.0&q=60&w=1200",
    ticketPrice: 15,
  },
];

const TIMES = ["10:30 AM", "2:00 PM", "7:30 PM"];
const HALLS = ["Hall 1", "Hall 2", "Hall 3"];

export function generateShowtimes(movieId: string): Showtime[] {
  const movie = MOVIES.find((m) => m.id === movieId)!;
  const showtimes: Showtime[] = [];
  const today = new Date();

  for (let dateIndex = 0; dateIndex < 3; dateIndex++) {
    const date = new Date(today);
    date.setDate(today.getDate() + dateIndex);
    const dateStr = date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
    });
    const dateIso = date.toISOString().split("T")[0];

    for (let timeIndex = 0; timeIndex < 3; timeIndex++) {
      const hallIndex = (Number.parseInt(movieId) + dateIndex + timeIndex) % 3;
      showtimes.push({
        id: `${movieId}-${dateIndex}-${timeIndex}`,
        movieId,
        date: dateIso,
        dateLabel: dateStr,
        time: TIMES[timeIndex],
        hall: HALLS[hallIndex],
        price: movie.ticketPrice,
      });
    }
  }

  return showtimes;
}

export function getShowtimeById(showtimeId: string): Showtime | undefined {
  const [movieId] = showtimeId.split("-");
  const showtimes = generateShowtimes(movieId);
  return showtimes.find((s) => s.id === showtimeId);
}

export const SEAT_ROWS = ["A", "B", "C", "D", "E", "F", "G", "H", "I", "J"];
export const SEAT_COLS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];

const PRE_SEEDED_SEATS: Record<string, string[]> = {};

export function getPreSeededSeats(showtimeId: string): string[] {
  if (!PRE_SEEDED_SEATS[showtimeId]) {
    // Deterministic seeding based on showtimeId
    const hash = showtimeId
      .split("")
      .reduce((acc, c) => acc + c.charCodeAt(0), 0);
    const seats: string[] = [];
    const count = 8 + (hash % 8); // 8-15 pre-booked seats
    const allSeats = SEAT_ROWS.flatMap((r) => SEAT_COLS.map((c) => `${r}${c}`));
    for (let i = 0; i < count; i++) {
      const idx = (hash * (i + 7) * 13) % allSeats.length;
      if (!seats.includes(allSeats[idx])) {
        seats.push(allSeats[idx]);
      }
    }
    PRE_SEEDED_SEATS[showtimeId] = seats;
  }
  return PRE_SEEDED_SEATS[showtimeId];
}
