import promptSync from 'prompt-sync';

const prompt = promptSync();

function generateMovieId(): string {
    return Math.floor(100000 + Math.random() * 900000).toString();
}

class Movie {
    id: string;
    title: string;
    director: string;
    releaseYear: number;
    genre: string;
    ratings: number[];

    constructor(title: string, director: string, releaseYear: number, genre: string) {
        this.id = generateMovieId();
        this.title = title;
        this.director = director;
        this.releaseYear = releaseYear;
        this.genre = genre;
        this.ratings = [];
    }

    addRating(rating: number): void {
        if (rating >= 1 && rating <= 5) {
            this.ratings.push(rating);
        } else {
            throw new Error("Rating must be between 1 and 5.");
        }
    }

    getAverageRating(): number | undefined {
        if (this.ratings.length === 0) return undefined;
        return this.ratings.reduce((sum, r) => sum + r, 0) / this.ratings.length;
    }
}

class MovieManager {
    private movies: Map<string, Movie>;

    constructor() {
        this.movies = new Map();
    }

    addMovie(title: string, director: string, releaseYear: number, genre: string): void {
        const movie = new Movie(title, director, releaseYear, genre);
        this.movies.set(movie.id, movie);
        console.log(`Movie added successfully! ID: ${movie.id}`);
    }

    rateMovie(id: string, rating: number): void {
        const movie = this.movies.get(id);
        if (!movie) {
            throw new Error("Movie not found.");
        }
        movie.addRating(rating);
    }

    getAverageRating(id: string): number | undefined {
        const movie = this.movies.get(id);
        return movie ? movie.getAverageRating() : undefined;
    }

    getTopRatedMovies(): Movie[] {
        return Array.from(this.movies.values())
            .filter(movie => movie.ratings.length > 0)
            .sort((a, b) => (b.getAverageRating() ?? 0) - (a.getAverageRating() ?? 0));
    }

    getMoviesByGenre(genre: string): Movie[] {
        return Array.from(this.movies.values()).filter(movie => movie.genre.toLowerCase() === genre.toLowerCase());
    }

    getMoviesByDirector(director: string): Movie[] {
        return Array.from(this.movies.values()).filter(movie => movie.director.toLowerCase() === director.toLowerCase());
    }

    searchMoviesBasedOnKeyword(keyword: string): Movie[] {
        return Array.from(this.movies.values()).filter(movie => movie.title.toLowerCase().includes(keyword.toLowerCase()));
    }

    getMovie(id: string): Movie | undefined {
        return this.movies.get(id);
    }

    removeMovie(id: string): void {
        if (!this.movies.delete(id)) {
            throw new Error("Movie not found.");
        }
    }
}

const movieManager = new MovieManager();

while (true) {
    console.log("\nMovie Management System");
    console.log("1. Add Movie");
    console.log("2. Rate Movie");
    console.log("3. Get Average Rating");
    console.log("4. Get Top Rated Movies");
    console.log("5. Get Movies By Genre");
    console.log("6. Get Movies By Director");
    console.log("7. Search Movies By Keyword");
    console.log("8. Get Movie Details");
    console.log("9. Remove Movie");
    console.log("10. Exit");

    const choice = prompt("Enter your choice: ");
    switch (choice) {
        case "1": {
            const title = prompt("Enter Title: ");
            const director = prompt("Enter Director: ");
            const releaseYear = parseInt(prompt("Enter Release Year: "));
            const genre = prompt("Enter Genre: ");
            movieManager.addMovie(title, director, releaseYear, genre);
            break;
        }
        case "2": {
            const id = prompt("Enter Movie ID: ");
            const rating = parseInt(prompt("Enter Rating (1-5): "));
            movieManager.rateMovie(id, rating);
            console.log("Rating added successfully!");
            break;
        }
        case "3": {
            const id = prompt("Enter Movie ID: ");
            console.log("Average Rating: ", movieManager.getAverageRating(id));
            break;
        }
        case "4": {
            console.log("Top Rated Movies: ", movieManager.getTopRatedMovies());
            break;
        }
        case "5": {
            const genre = prompt("Enter Genre: ");
            console.log("Movies in Genre: ", movieManager.getMoviesByGenre(genre));
            break;
        }
        case "6": {
            const director = prompt("Enter Director: ");
            console.log("Movies by Director: ", movieManager.getMoviesByDirector(director));
            break;
        }
        case "7": {
            const keyword = prompt("Enter Keyword: ");
            console.log("Movies Found: ", movieManager.searchMoviesBasedOnKeyword(keyword));
            break;
        }
        case "8": {
            const id = prompt("Enter Movie ID: ");
            console.log("Movie Details: ", movieManager.getMovie(id));
            break;
        }
        case "9": {
            const id = prompt("Enter Movie ID: ");
            movieManager.removeMovie(id);
            console.log("Movie removed successfully!");
            break;
        }
        case "10": {
            console.log("Exiting...");
            process.exit(0);
        }
        default:
            console.log("Invalid choice. Please try again.");
    }
}
