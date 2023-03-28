/* eslint-disable @typescript-eslint/no-unsafe-return */
import { apiPath, apiKey } from 'Constants';

const BASE = apiPath;
const KEY = apiKey;

export const getMovies = (category?: string) => {
  return fetch(`${BASE}/movie/${category}?api_key=${KEY}`).then((response) =>
    response.json()
  );
};

export const getTvs = (category?: string) => {
  return fetch(`${BASE}/tv/${category}?api_key=${KEY}`).then((response) =>
    response.json()
  );
};

export const getSearch = (category?: string, keyword?: string) => {
  return fetch(
    `${BASE}/search/${category}?api_key=${KEY}?query=${encodeURI(keyword)}`
  ).then((response) => response.json());
};
