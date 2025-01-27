import { APIClient } from "./client";
export { APIError } from "./errors";
export * from "./types";
export * from "./schemas";

const api = new APIClient({
  baseURL: process.env.NEXT_PUBLIC_API_URL ?? "",
});

export default api;
