// src/utils/watchlist.js
export const getLocalWatchlist = () =>
  JSON.parse(localStorage.getItem("watchlist")) || [];

export const setLocalWatchlist = (list) =>
  localStorage.setItem("watchlist", JSON.stringify(list));
