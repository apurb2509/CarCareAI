/**
 * Central API Configuration
 * 
 * In development, this points to http://localhost:5002.
 * In production (Vercel), you must set the VITE_API_URL environment variable 
 * to your Render backend URL (e.g., https://your-app.onrender.com).
 */

export const API_BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:5002";

// Utility to clean up URLs and prevent double slashes
export const getApiUrl = (endpoint) => {
  const base = API_BASE_URL.replace(/\/$/, "");
  const path = endpoint.replace(/^\//, "");
  return `${base}/${path}`;
};
