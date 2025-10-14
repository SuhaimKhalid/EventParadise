import axios from "axios";

const api = axios.create({
  baseURL: "https://api.themoviedb.org/3",
});

export const MovieSearch = async (query: string) => {
  try {
    const res = await api.get("/search/movie", {
      params: {
        api_key: "866034b6fc7b522ec8f49249ff452885",
        query: query,
      },
    });

    return res.data.results[0]; // return first movie found
  } catch (error) {
    console.error("Error fetching movie:", error);
    return null;
  }
};
