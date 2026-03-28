# CineBook - Movie Ticket Booking

## Current State
New project with empty Motoko backend and default React frontend.

## Requested Changes (Diff)

### Add
- Movie listings with title, poster, genre, description, rating
- Showtimes for each movie (date, time, hall)
- Seat map with seat selection (rows A-J, 10 seats per row)
- Booking flow: select movie → select showtime → select seats → confirm booking
- Booking record stored with user session ID, movie, showtime, seats, total price
- Admin seed data: 6 sample movies with multiple showtimes
- Homepage with hero banner (featured movie) and movie grid
- Movie detail page with showtimes
- Seat selection page
- Booking confirmation page
- My Bookings page (by session)

### Modify
- Nothing (new project)

### Remove
- Nothing

## Implementation Plan
1. Backend: Movies, Showtimes, Seats, Bookings actors in Motoko
2. APIs: getMovies, getMovie, getShowtimes, getSeatsForShowtime, bookSeats, getBookingsBySession, cancelBooking
3. Seed data: 6 movies with genres, ratings, showtimes across next 7 days
4. Frontend: dark cinematic theme, hero, movie grid, detail page, seat picker, confirmation
