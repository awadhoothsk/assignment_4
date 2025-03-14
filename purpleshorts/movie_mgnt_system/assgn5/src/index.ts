import { Hono } from "hono";
import { serve } from "@hono/node-server";

// Define Movie Type
interface Movie {
  id: string;
  title: string;
  director: string;
  releaseYear: number;
  genre: string;
  ratings: number[];
}

// In-memory database
const movies: Movie[] = [];

const app = new Hono();

// Add a New Movie
app.post("/movies", async (c) => {
  const body: Movie = await c.req.json();
  if (!body.id || !body.title || !body.director || !body.releaseYear || !body.genre) {
    return c.json({ error: "Missing required fields" }, 400);
  }
  body.ratings = [];
  movies.push(body);
  return c.json(body, 201);
});

// Update a Movie
app.patch("/movies/:id", async (c) => {
  const id = c.req.param("id");
  const updates = await c.req.json();
  const movie = movies.find(m => m.id === id);
  if (!movie) return c.json({ error: "Not Found" }, 404);
  Object.assign(movie, updates);
  return c.json(movie);
});

// Get a Movie by ID
app.get("/movies/:id", (c) => {
  const movie = movies.find(m => m.id === c.req.param("id"));
  return movie ? c.json(movie) : c.json({ error: "Not Found" }, 404);
});

// Delete a Movie
app.delete("/movies/:id", (c) => {
  const index = movies.findIndex(m => m.id === c.req.param("id"));
  if (index === -1) return c.json({ error: "Not Found" }, 404);
  return c.json(movies.splice(index, 1)[0]);
});

// Rate a Movie
app.post("/movies/:id/rating", async (c) => {
  const id = c.req.param("id");
  const { rating } = await c.req.json();
  if (rating < 1 || rating > 5) return c.json({ error: "Rating must be between 1 and 5" }, 400);
  const movie = movies.find(m => m.id === id);
  if (!movie) return c.json({ error: "Not Found" }, 404);
  movie.ratings.push(rating);
  return c.json({ message: "Rating added", movie });
});

// Get Average Rating of a Movie
app.get("/movies/:id/rating", (c) => {
  const movie = movies.find(m => m.id === c.req.param("id"));
  if (!movie) return c.json({ error: "Not Found" }, 404);
  if (movie.ratings.length === 0) return c.json({}, 203);
  const avgRating = movie.ratings.reduce((a, b) => a + b, 0) / movie.ratings.length;
  return c.json({ averageRating: avgRating });
});

// Get Top-Rated Movies
app.get("/movies/top-rated", (c) => {
  const topRatedMovies = movies.filter(m => m.ratings.length > 0);
  topRatedMovies.sort((a, b) => {
    const avgRatingA = a.ratings.reduce((x, y) => x + y, 0) / a.ratings.length;
    const avgRatingB = b.ratings.reduce((x, y) => x + y, 0) / b.ratings.length;
    return avgRatingB - avgRatingA;
  });
  return topRatedMovies.length > 0 ? c.json(topRatedMovies) : c.json({ error: "No movies found" }, 404);
});


// Get Movies by Genre
app.get("/movies/genre/:genre", (c) => {
  const genreMovies = movies.filter(m => m.genre.toLowerCase() === c.req.param("genre").toLowerCase());
  return genreMovies.length > 0 ? c.json(genreMovies) : c.json({ error: "No movies found" }, 404);
});

// Get Movies by Director
app.get("/movies/director/:director", (c) => {
  const directorMovies = movies.filter(m => m.director.toLowerCase() === c.req.param("director").toLowerCase());
  return directorMovies.length > 0 ? c.json(directorMovies) : c.json({ error: "No movies found" }, 404);
});

// Search Movies by Title
app.get("/movies/search/:title", (c) => {
  const searchResults = movies.filter(m => m.title.toLowerCase().includes(c.req.param("title").toLowerCase()));
  return searchResults.length > 0 ? c.json(searchResults) : c.json({ error: "No movies found" }, 404);
});

// Get All Movies
app.get("/movies", (c) => {
  return c.json(movies);
});

// Start the Server
const port = 3000;
console.log(`🚀 Server running on http://localhost:${port}`);
serve({ fetch: app.fetch, port });
