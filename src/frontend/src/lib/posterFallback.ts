import type { Movie } from "../data/movies";

function escapeHtml(value: string) {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

export function getPosterFallback(movie: Pick<Movie, "title" | "genre" | "posterColor">) {
  const title = escapeHtml(movie.title);
  const genre = escapeHtml(movie.genre);
  const color = movie.posterColor || "#3a3a3a";
  const svg = `
    <svg xmlns="http://www.w3.org/2000/svg" width="600" height="900" viewBox="0 0 600 900">
      <defs>
        <linearGradient id="bg" x1="0" y1="0" x2="1" y2="1">
          <stop offset="0%" stop-color="${color}" />
          <stop offset="100%" stop-color="#111111" />
        </linearGradient>
      </defs>
      <rect width="600" height="900" fill="url(#bg)" />
      <circle cx="470" cy="150" r="120" fill="rgba(255,255,255,0.08)" />
      <circle cx="140" cy="720" r="160" fill="rgba(255,215,140,0.06)" />
      <text x="60" y="110" fill="#f4c56a" font-size="26" font-family="Arial, sans-serif" letter-spacing="5">
        ${genre.toUpperCase()}
      </text>
      <text x="60" y="720" fill="#ffffff" font-size="52" font-weight="700" font-family="Arial, sans-serif">
        ${title}
      </text>
      <text x="60" y="780" fill="#d7d7d7" font-size="24" font-family="Arial, sans-serif" letter-spacing="6">
        CINEBOOK
      </text>
    </svg>
  `;

  return `data:image/svg+xml;charset=UTF-8,${encodeURIComponent(svg)}`;
}
