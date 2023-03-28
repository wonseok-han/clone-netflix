export interface GenresProps {
  id: number;
  name: string;
}

export interface MovieProps {
  id: number;
  backdrop_path: string;
  poster_path: string;
  title: string;
  overview: string;
  release_date: string;
  vote_average: string;
  genres: Array<GenresProps>;
}

export interface GetMoviesProps {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Array<MovieProps>;
  total_pages: number;
  total_results: number;
  status: string;
  status_message: string;
}

export interface TvProps {
  id: number;
  backdrop_path: string;
  poster_path: string;
  name: string;
  overview: string;
  first_air_date: string;
  vote_average: string;
  genres: Array<GenresProps>;
}

export interface GetTvsProps {
  dates: {
    maximum: string;
    minimum: string;
  };
  page: number;
  results: Array<TvProps>;
  total_pages: number;
  total_results: number;
  status: string;
  status_message: string;
}
