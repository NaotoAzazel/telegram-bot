type MovieConfig = {
  baseImageUrl: string;
  notFoundImageUrl: string;
  language: "ru" | "uk" | "en";
  includeAdult: boolean;
}

export const movieConfig: MovieConfig = {
  baseImageUrl: "https://image.tmdb.org/t/p/w500/",
  notFoundImageUrl: "https://demofree.sirv.com/nope-not-here.jpg",
  language: "uk",
  includeAdult: false
};