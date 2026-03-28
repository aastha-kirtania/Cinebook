import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import mysql from "mysql2/promise";

dotenv.config();

const app = express();
app.use(cors());
app.use(express.json());

const {
  PORT = 3001,
  MYSQL_HOST = "127.0.0.1",
  MYSQL_PORT = 3306,
  MYSQL_USER = "root",
  MYSQL_PASSWORD = "endsem@db26",
  MYSQL_DATABASE = "cinebook",
} = process.env;

const movieSeed = [
  {
    id: "1",
    title: "Galactic Storm",
    genre: "Adventure",
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
  {
    id: "7",
    title: "Crimson Circuit",
    genre: "Action",
    duration: 124,
    rating: 8.0,
    description:
      "A street racer with a stolen combat implant is pulled into a city-wide data war. Neon alleys, rival syndicates, and one impossible chase decide the fate of the grid.",
    language: "English",
    posterColor: "#4b0f2b",
    posterImage:
      "https://images.unsplash.com/photo-1520034475321-cbe63696469a?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 14,
  },
  {
    id: "8",
    title: "Maple Street Mystery",
    genre: "Thriller",
    duration: 112,
    rating: 7.8,
    description:
      "When a beloved clockmaker disappears, a sharp-eyed teenager uncovers a trail of coded letters hidden across a sleepy town. Every secret points to a family legend no one believed.",
    language: "English",
    posterColor: "#5a3b21",
    posterImage:
      "https://images.unsplash.com/photo-1519074069444-1ba4fff66d16?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 11,
  },
  {
    id: "9",
    title: "Blue Horizon",
    genre: "Adventure",
    duration: 131,
    rating: 8.3,
    description:
      "A marine cartographer and her estranged brother race across uncharted islands to complete their father's final map. Storms, shipwrecks, and old grudges shadow every mile.",
    language: "English",
    posterColor: "#114b5f",
    posterImage:
      "https://images.unsplash.com/photo-1500375592092-40eb2168fd21?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 15,
  },
  {
    id: "10",
    title: "Velvet Heist",
    genre: "Thriller",
    duration: 119,
    rating: 7.7,
    description:
      "A disgraced art curator assembles a crew of specialists to steal back a masterpiece before it vanishes into the private market forever. Nothing goes to plan after the first alarm.",
    language: "English",
    posterColor: "#311b2b",
    posterImage:
      "https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 13,
  },
  {
    id: "11",
    title: "Evergreen Hearts",
    genre: "Drama",
    duration: 102,
    rating: 7.5,
    description:
      "Three generations return to their mountain hometown for one last holiday season at the family lodge. Old traditions and new beginnings collide under the first snowfall.",
    language: "English",
    posterColor: "#355834",
    posterImage:
      "https://images.unsplash.com/photo-1511497584788-876760111969?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 10,
  },
  {
    id: "12",
    title: "Kingdom of Embers",
    genre: "Adventure",
    duration: 146,
    rating: 8.6,
    description:
      "A reluctant blacksmith discovers she is the last heir to a fallen fire kingdom. To reclaim the throne, she must forge an ancient blade before the winter armies arrive.",
    language: "English",
    posterColor: "#5c1d16",
    posterImage:
      "https://images.unsplash.com/photo-1518562180175-34a163b1a9a6?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 16,
  },
  {
    id: "13",
    title: "Neon Pulse",
    genre: "Drama",
    duration: 108,
    rating: 7.9,
    description:
      "A washed-up producer and a fearless club singer gamble everything on one underground performance that could change the sound of the city forever.",
    language: "English",
    posterColor: "#1d1a52",
    posterImage:
      "https://images.unsplash.com/photo-1493225457124-a3eb161ffa5f?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 12,
  },
  {
    id: "14",
    title: "Silent Orbit",
    genre: "Adventure",
    duration: 121,
    rating: 8.2,
    description:
      "After a catastrophic communications blackout, two astronauts drifting near Jupiter must decide whether to save themselves or finish the mission that could rescue Earth.",
    language: "English",
    posterColor: "#0e2039",
    posterImage:
      "https://images.unsplash.com/photo-1446776811953-b23d57bd21aa?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 15,
  },
  {
    id: "15",
    title: "Paper Crown",
    genre: "Drama",
    duration: 138,
    rating: 8.1,
    description:
      "In a court built on rumor and ceremony, a young royal scribe records a conspiracy that could topple the empire. Every page he writes becomes a risk to his life.",
    language: "English",
    posterColor: "#7a5c2e",
    posterImage:
      "https://images.unsplash.com/photo-1461360228754-6e81c478b882?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 14,
  },
  {
    id: "16",
    title: "Afterglow Station",
    genre: "Comedy",
    duration: 96,
    rating: 8.4,
    description:
      "A runaway mechanic and a tiny repair bot keep a forgotten train station alive on the edge of the desert. Their quiet world changes when the first passenger in years arrives.",
    language: "English",
    posterColor: "#d26a3d",
    posterImage:
      "https://images.unsplash.com/photo-1519608487953-e999c86e7455?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 11,
  },
  {
    id: "17",
    title: "Winter Protocol",
    genre: "Thriller",
    duration: 127,
    rating: 7.8,
    description:
      "An intelligence analyst finds a dormant Cold War program reactivating across Europe. With every ally compromised, she has seventy-two hours to stop a silent coup.",
    language: "English",
    posterColor: "#213447",
    posterImage:
      "https://images.unsplash.com/photo-1489515217757-5fd1be406fef?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 13,
  },
  {
    id: "18",
    title: "Sunflower Lane",
    genre: "Drama",
    duration: 104,
    rating: 7.6,
    description:
      "During one restless summer, a shy teenager documents her neighborhood on a borrowed camera and discovers that growing up means learning which memories to keep.",
    language: "English",
    posterColor: "#ad7d20",
    posterImage:
      "https://images.unsplash.com/photo-1470770903676-69b98201ea1c?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 10,
  },
  {
    id: "19",
    title: "Titan Run",
    genre: "Drama",
    duration: 117,
    rating: 7.9,
    description:
      "A former champion sprinter returns to the track to coach a defiant prodigy with world-class speed and a self-destructive streak. Their last shot at glory becomes a fight for trust.",
    language: "English",
    posterColor: "#9b2d20",
    posterImage:
      "https://images.unsplash.com/photo-1552674605-db6ffd4facb5?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 12,
  },
  {
    id: "20",
    title: "Marble Sky",
    genre: "Drama",
    duration: 109,
    rating: 8.0,
    description:
      "A young architect returns home to restore an abandoned observatory and unexpectedly reconnects with the friend she left behind. Under a fading town skyline, both must choose what to rebuild.",
    language: "English",
    posterColor: "#51657d",
    posterImage:
      "https://images.unsplash.com/photo-1494526585095-c41746248156?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 11,
  },
  {
    id: "21",
    title: "Temple of Tides",
    genre: "Adventure",
    duration: 143,
    rating: 8.5,
    description:
      "A rogue diver, a historian, and a smuggler hunt for a submerged temple said to control the monsoon seas. Every discovery drags them deeper into a war between coastal kingdoms.",
    language: "English",
    posterColor: "#0c596b",
    posterImage:
      "https://images.unsplash.com/photo-1544551763-46a013bb70d5?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 16,
  },
  {
    id: "22",
    title: "Static Veil",
    genre: "Thriller",
    duration: 101,
    rating: 7.4,
    description:
      "After moving into a remote broadcast tower, a late-night radio host begins receiving calls from listeners who should already be dead. The signal grows clearer every night.",
    language: "English",
    posterColor: "#1a1d24",
    posterImage:
      "https://images.unsplash.com/photo-1500530855697-b586d89ba3ee?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 12,
  },
  {
    id: "23",
    title: "Golden Bazaar",
    genre: "Romance",
    duration: 115,
    rating: 7.8,
    description:
      "A gifted tailor and a rebellious singer fall in love while preparing the grand market festival that could save their neighborhood from demolition.",
    language: "English",
    posterColor: "#b86a1f",
    posterImage:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 13,
  },
  {
    id: "24",
    title: "Glass Frontier",
    genre: "Thriller",
    duration: 129,
    rating: 8.3,
    description:
      "Scientists stationed in a transparent research city at the edge of an ice shelf discover that the glacier beneath them is preserving something far older than humanity.",
    language: "English",
    posterColor: "#4b8396",
    posterImage:
      "https://images.unsplash.com/photo-1511300636408-a63a89df3482?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 15,
  },
  {
    id: "25",
    title: "River House",
    genre: "Drama",
    duration: 107,
    rating: 7.7,
    description:
      "Siblings divided by inheritance spend one monsoon week trapped in their late mother's riverside home. The floodwater outside rises as long-buried truths finally break loose.",
    language: "English",
    posterColor: "#5a4c43",
    posterImage:
      "https://images.unsplash.com/photo-1505693416388-ac5ce068fe85?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 11,
  },
  {
    id: "26",
    title: "Orbit Academy",
    genre: "Adventure",
    duration: 114,
    rating: 7.5,
    description:
      "A scholarship student arrives at the solar system's most elite flight school and stumbles into a cover-up tied to a vanished class of cadets.",
    language: "English",
    posterColor: "#202f63",
    posterImage:
      "https://images.unsplash.com/photo-1516849677043-ef67c9557e16?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 12,
  },
  {
    id: "27",
    title: "The Ninth Lantern",
    genre: "Adventure",
    duration: 133,
    rating: 8.2,
    description:
      "When eight sacred lanterns go dark on the same night, a novice keeper must travel through haunted valleys to relight the ninth and prevent an ancient curse from waking.",
    language: "English",
    posterColor: "#53361f",
    posterImage:
      "https://images.unsplash.com/photo-1513151233558-d860c5398176?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 14,
  },
  {
    id: "28",
    title: "Midnight Courier",
    genre: "Action",
    duration: 122,
    rating: 7.9,
    description:
      "A bike messenger witnesses a political assassination and has one night to deliver the evidence across a city already locked down by the people chasing him.",
    language: "English",
    posterColor: "#2d1f31",
    posterImage:
      "https://images.unsplash.com/photo-1500534623283-312aade485b7?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 13,
  },
  {
    id: "29",
    title: "Peach Season",
    genre: "Drama",
    duration: 99,
    rating: 7.4,
    description:
      "On a fading family orchard, a college dropout spends one final harvest learning that ordinary days can hold the most difficult choices of all.",
    language: "English",
    posterColor: "#d48a62",
    posterImage:
      "https://images.unsplash.com/photo-1471943311424-646960669fbc?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 10,
  },
  {
    id: "30",
    title: "Black Reef",
    genre: "Thriller",
    duration: 118,
    rating: 7.8,
    description:
      "A storm leaves a diving expedition stranded on a volcanic reef with failing oxygen, no radio contact, and something vast moving in the water below them.",
    language: "English",
    posterColor: "#102f35",
    posterImage:
      "https://images.unsplash.com/photo-1524704654690-b56c05c78a00?auto=format&fit=crop&fm=jpg&q=60&w=1200",
    ticketPrice: 13,
  },
];

const TIMES = ["10:30 AM", "2:00 PM", "7:30 PM"];
const HALLS = [
  "CineBook Downtown",
  "CineBook Riverside",
  "CineBook Grand Mall",
  "CineBook Skyline",
];

let pool;

function createBookingId() {
  return `CB-${Date.now().toString(36).toUpperCase()}-${Math.random().toString(36).slice(2, 6).toUpperCase()}`;
}

function formatDateLabel(date) {
  return new Intl.DateTimeFormat("en-US", {
    weekday: "short",
    month: "short",
    day: "numeric",
    timeZone: "UTC",
  }).format(date);
}

function isoDate(date) {
  return date.toISOString().slice(0, 10);
}

function parseSeats(csv) {
  return csv ? csv.split(",").filter(Boolean) : [];
}

function buildShowtimeRows() {
  const rows = [];
  const today = new Date();

  for (const movie of movieSeed) {
    for (let dateIndex = 0; dateIndex < 5; dateIndex += 1) {
      const date = new Date(
        Date.UTC(
          today.getUTCFullYear(),
          today.getUTCMonth(),
          today.getUTCDate() + dateIndex,
        ),
      );
      const dateStr = isoDate(date);
      const dateLabel = formatDateLabel(date);

      for (let timeIndex = 0; timeIndex < TIMES.length; timeIndex += 1) {
        const hallIndex =
          (Number.parseInt(movie.id, 10) + dateIndex + timeIndex) % 3;
        rows.push([
          `${movie.id}-${dateIndex}-${timeIndex}`,
          movie.id,
          dateStr,
          dateLabel,
          TIMES[timeIndex],
          HALLS[hallIndex],
          movie.ticketPrice,
        ]);
      }
    }
  }

  return rows;
}

async function bootstrapDatabase() {
  const admin = await mysql.createConnection({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    multipleStatements: true,
  });
  await admin.query(`CREATE DATABASE IF NOT EXISTS \`${MYSQL_DATABASE}\``);
  await admin.end();

  pool = mysql.createPool({
    host: MYSQL_HOST,
    port: Number(MYSQL_PORT),
    user: MYSQL_USER,
    password: MYSQL_PASSWORD,
    database: MYSQL_DATABASE,
    connectionLimit: 10,
  });

  await pool.query(`
    CREATE TABLE IF NOT EXISTS movies (
      id VARCHAR(32) PRIMARY KEY,
      title VARCHAR(255) NOT NULL,
      genre VARCHAR(100) NOT NULL,
      duration INT NOT NULL,
      rating DECIMAL(3,1) NOT NULL,
      description TEXT NOT NULL,
      language VARCHAR(64) NOT NULL,
      poster_color VARCHAR(16) NOT NULL,
      poster_image TEXT NOT NULL,
      ticket_price DECIMAL(10,2) NOT NULL
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS showtimes (
      id VARCHAR(64) PRIMARY KEY,
      movie_id VARCHAR(32) NOT NULL,
      show_date DATE NOT NULL,
      date_label VARCHAR(64) NOT NULL,
      time_label VARCHAR(32) NOT NULL,
      hall VARCHAR(64) NOT NULL,
      price DECIMAL(10,2) NOT NULL,
      FOREIGN KEY (movie_id) REFERENCES movies(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS bookings (
      id VARCHAR(64) PRIMARY KEY,
      movie_id VARCHAR(32) NOT NULL,
      showtime_id VARCHAR(64) NOT NULL,
      total_price DECIMAL(10,2) NOT NULL,
      status ENUM('confirmed','cancelled') NOT NULL DEFAULT 'confirmed',
      created_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (movie_id) REFERENCES movies(id),
      FOREIGN KEY (showtime_id) REFERENCES showtimes(id)
    )
  `);

  await pool.query(`
    CREATE TABLE IF NOT EXISTS booking_seats (
      id BIGINT NOT NULL AUTO_INCREMENT PRIMARY KEY,
      booking_id VARCHAR(64) NOT NULL,
      seat_code VARCHAR(8) NOT NULL,
      FOREIGN KEY (booking_id) REFERENCES bookings(id),
      UNIQUE KEY uniq_booking_seat (booking_id, seat_code)
    )
  `);

  for (const movie of movieSeed) {
    await pool.query(
      `
      INSERT INTO movies
        (id, title, genre, duration, rating, description, language, poster_color, poster_image, ticket_price)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        title = VALUES(title),
        genre = VALUES(genre),
        duration = VALUES(duration),
        rating = VALUES(rating),
        description = VALUES(description),
        language = VALUES(language),
        poster_color = VALUES(poster_color),
        poster_image = VALUES(poster_image),
        ticket_price = VALUES(ticket_price)
      `,
      [
        movie.id,
        movie.title,
        movie.genre,
        movie.duration,
        movie.rating,
        movie.description,
        movie.language,
        movie.posterColor,
        movie.posterImage,
        movie.ticketPrice,
      ],
    );
  }

  const showtimeRows = buildShowtimeRows();
  for (const row of showtimeRows) {
    await pool.query(
      `
      INSERT INTO showtimes
        (id, movie_id, show_date, date_label, time_label, hall, price)
      VALUES (?, ?, ?, ?, ?, ?, ?)
      ON DUPLICATE KEY UPDATE
        movie_id = VALUES(movie_id),
        show_date = VALUES(show_date),
        date_label = VALUES(date_label),
        time_label = VALUES(time_label),
        hall = VALUES(hall),
        price = VALUES(price)
      `,
      row,
    );
  }
}

async function queryBookings(whereClause = "", params = []) {
  const [rows] = await pool.query(
    `
    SELECT
      b.id,
      b.movie_id AS movieId,
      m.title AS movieTitle,
      b.showtime_id AS showtimeId,
      DATE_FORMAT(s.show_date, '%Y-%m-%d') AS date,
      s.date_label AS dateLabel,
      s.time_label AS time,
      s.hall,
      CAST(b.total_price AS DECIMAL(10,2)) AS totalPrice,
      UNIX_TIMESTAMP(b.created_at) * 1000 AS timestamp,
      b.status,
      m.poster_image AS moviePosterImage,
      GROUP_CONCAT(bs.seat_code ORDER BY bs.seat_code SEPARATOR ',') AS seats
    FROM bookings b
    JOIN movies m ON m.id = b.movie_id
    JOIN showtimes s ON s.id = b.showtime_id
    LEFT JOIN booking_seats bs ON bs.booking_id = b.id
    ${whereClause}
    GROUP BY b.id
    ORDER BY b.created_at DESC
    `,
    params,
  );

  return rows.map((row) => ({
    ...row,
    totalPrice: Number(row.totalPrice),
    seats: parseSeats(row.seats),
  }));
}

app.get("/api/health", async (_req, res) => {
  const [rows] = await pool.query("SELECT 1 AS ok");
  res.json({ ok: rows[0].ok === 1 });
});

app.get("/api/movies", async (req, res) => {
  const search = `${req.query.search ?? ""}`.trim().toLowerCase();
  let sql = `
    SELECT
      id,
      title,
      genre,
      duration,
      rating,
      description,
      language,
      poster_color AS posterColor,
      poster_image AS posterImage,
      CAST(ticket_price AS DECIMAL(10,2)) AS ticketPrice
    FROM movies
  `;
  const params = [];

  if (search) {
    sql += " WHERE LOWER(title) LIKE ? OR LOWER(genre) LIKE ? ";
    params.push(`%${search}%`, `%${search}%`);
  }

  sql += " ORDER BY rating DESC, title ASC";
  const [rows] = await pool.query(sql, params);
  res.json(rows.map((row) => ({ ...row, ticketPrice: Number(row.ticketPrice) })));
});

app.get("/api/movies/:id", async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      title,
      genre,
      duration,
      rating,
      description,
      language,
      poster_color AS posterColor,
      poster_image AS posterImage,
      CAST(ticket_price AS DECIMAL(10,2)) AS ticketPrice
    FROM movies
    WHERE id = ?
    `,
    [req.params.id],
  );

  if (rows.length === 0) {
    res.status(404).json({ message: "Movie not found" });
    return;
  }

  res.json({ ...rows[0], ticketPrice: Number(rows[0].ticketPrice) });
});

app.get("/api/movies/:id/showtimes", async (req, res) => {
  const [rows] = await pool.query(
    `
    SELECT
      id,
      movie_id AS movieId,
      DATE_FORMAT(show_date, '%Y-%m-%d') AS date,
      date_label AS dateLabel,
      time_label AS time,
      hall,
      CAST(price AS DECIMAL(10,2)) AS price
    FROM showtimes
    WHERE movie_id = ?
    ORDER BY show_date ASC, FIELD(time_label, '10:30 AM', '2:00 PM', '7:30 PM')
    `,
    [req.params.id],
  );

  res.json(rows.map((row) => ({ ...row, price: Number(row.price) })));
});

app.get("/api/showtimes/:id", async (req, res) => {
  const [[row]] = await pool.query(
    `
    SELECT
      s.id,
      s.movie_id AS movieId,
      DATE_FORMAT(s.show_date, '%Y-%m-%d') AS date,
      s.date_label AS dateLabel,
      s.time_label AS time,
      s.hall,
      CAST(s.price AS DECIMAL(10,2)) AS price,
      m.title,
      m.genre,
      m.duration,
      m.rating,
      m.description,
      m.language,
      m.poster_color AS posterColor,
      m.poster_image AS posterImage,
      CAST(m.ticket_price AS DECIMAL(10,2)) AS ticketPrice
    FROM showtimes s
    JOIN movies m ON m.id = s.movie_id
    WHERE s.id = ?
    `,
    [req.params.id],
  );

  if (!row) {
    res.status(404).json({ message: "Showtime not found" });
    return;
  }

  const [seatRows] = await pool.query(
    `
    SELECT bs.seat_code AS seatCode
    FROM booking_seats bs
    JOIN bookings b ON b.id = bs.booking_id
    WHERE b.showtime_id = ? AND b.status = 'confirmed'
    ORDER BY bs.seat_code
    `,
    [req.params.id],
  );

  res.json({
    showtime: {
      id: row.id,
      movieId: row.movieId,
      date: row.date,
      dateLabel: row.dateLabel,
      time: row.time,
      hall: row.hall,
      price: Number(row.price),
    },
    movie: {
      id: row.movieId,
      title: row.title,
      genre: row.genre,
      duration: row.duration,
      rating: row.rating,
      description: row.description,
      language: row.language,
      posterColor: row.posterColor,
      posterImage: row.posterImage,
      ticketPrice: Number(row.ticketPrice),
    },
    bookedSeats: seatRows.map((seat) => seat.seatCode),
  });
});

app.get("/api/bookings", async (_req, res) => {
  const bookings = await queryBookings();
  res.json(bookings);
});

app.get("/api/bookings/:id", async (req, res) => {
  const bookings = await queryBookings("WHERE b.id = ?", [req.params.id]);
  if (bookings.length === 0) {
    res.status(404).json({ message: "Booking not found" });
    return;
  }
  res.json(bookings[0]);
});

app.post("/api/bookings", async (req, res) => {
  const { showtimeId, seats } = req.body ?? {};

  if (!showtimeId || !Array.isArray(seats) || seats.length === 0) {
    res.status(400).json({ message: "showtimeId and seats are required" });
    return;
  }

  const normalizedSeats = [...new Set(seats.map((seat) => `${seat}`.trim()).filter(Boolean))].sort();
  const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();

    const [[showtime]] = await connection.query(
      `
      SELECT s.id, s.movie_id AS movieId, CAST(s.price AS DECIMAL(10,2)) AS price
      FROM showtimes s
      WHERE s.id = ?
      FOR UPDATE
      `,
      [showtimeId],
    );

    if (!showtime) {
      await connection.rollback();
      res.status(404).json({ message: "Showtime not found" });
      return;
    }

    const [takenRows] = await connection.query(
      `
      SELECT bs.seat_code AS seatCode
      FROM booking_seats bs
      JOIN bookings b ON b.id = bs.booking_id
      WHERE b.showtime_id = ? AND b.status = 'confirmed' AND bs.seat_code IN (?)
      FOR UPDATE
      `,
      [showtimeId, normalizedSeats],
    );

    if (takenRows.length > 0) {
      await connection.rollback();
      res.status(409).json({
        message: "Some seats are already booked",
        conflictingSeats: takenRows.map((row) => row.seatCode),
      });
      return;
    }

    const bookingId = createBookingId();
    const totalPrice = Number(showtime.price) * normalizedSeats.length;

    await connection.query(
      `
      INSERT INTO bookings (id, movie_id, showtime_id, total_price, status)
      VALUES (?, ?, ?, ?, 'confirmed')
      `,
      [bookingId, showtime.movieId, showtimeId, totalPrice],
    );

    await connection.query(
      `
      INSERT INTO booking_seats (booking_id, seat_code)
      VALUES ?
      `,
      [normalizedSeats.map((seat) => [bookingId, seat])],
    );

    await connection.commit();

    const [booking] = await queryBookings("WHERE b.id = ?", [bookingId]);
    res.status(201).json(booking);
  } catch (error) {
    await connection.rollback();
    res.status(500).json({ message: error.message || "Booking failed" });
  } finally {
    connection.release();
  }
});

app.patch("/api/bookings/:id/cancel", async (req, res) => {
  const [result] = await pool.query(
    `
    UPDATE bookings
    SET status = 'cancelled'
    WHERE id = ? AND status = 'confirmed'
    `,
    [req.params.id],
  );

  if (result.affectedRows === 0) {
    res.status(404).json({ message: "Active booking not found" });
    return;
  }

  const [booking] = await queryBookings("WHERE b.id = ?", [req.params.id]);
  res.json(booking);
});

async function start() {
  await bootstrapDatabase();
  app.listen(Number(PORT), () => {
    console.log(`Cinebook MySQL API running on http://localhost:${PORT}`);
  });
}

start().catch((error) => {
  console.error("Failed to start server", error);
  process.exit(1);
});
