export type HttpMethod = "GET" | "POST" | "PUT" | "DELETE" | "PATCH";

export interface APIClientConfig {
  baseURL: string;
  defaultHeaders?: HeadersInit;
}

export interface LoginResponse {
  email: string;
  password: string;
  token: string;
}

export type ToastVariant = "default" | "destructive";
