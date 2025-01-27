import { APIError } from "./errors";
import { APIClientConfig, HttpMethod } from "./types";
import { ErrorResponseSchema } from "./schemas";

export class APIClient {
  private baseURL: string;
  private defaultHeaders: HeadersInit;

  constructor(config: APIClientConfig) {
    this.baseURL = config.baseURL;
    this.defaultHeaders = {
      "Content-Type": "application/json",
      ...config.defaultHeaders,
    };
  }

  private getFullURL(path: string): string {
    return `${this.baseURL}${path.startsWith("/") ? path : `/${path}`}`;
  }

  private async handleResponse<T>(response: Response): Promise<T> {
    if (!response.ok) {
      let errorMessage = "An error occurred";
      let errorData: unknown;

      const contentType = response.headers.get("content-type");
      if (contentType?.includes("application/json")) {
        try {
          errorData = await response.json();
          const parsed = ErrorResponseSchema.safeParse(errorData);
          if (parsed.success) {
            errorMessage =
              parsed.data.message || parsed.data.error || errorMessage;
          }
        } catch {
          errorMessage = await response.text();
        }
      } else {
        errorMessage = await response.text();
      }

      throw new APIError(response.status, errorMessage, errorData);
    }

    return response.json();
  }

  private async request<T>(
    method: HttpMethod,
    path: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    const options: RequestInit = {
      method,
      headers: {
        ...this.defaultHeaders,
        ...headers,
      },
    };

    if (data !== undefined) {
      options.body = JSON.stringify(data);
    }

    try {
      const response = await fetch(this.getFullURL(path), options);
      return this.handleResponse<T>(response);
    } catch (error) {
      if (error instanceof APIError) {
        throw error;
      }
      throw new APIError(0, "Network error", error);
    }
  }

  async get<T>(path: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>("GET", path, undefined, headers);
  }

  async post<T>(
    path: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    return this.request<T>("POST", path, data, headers);
  }

  async put<T>(
    path: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    return this.request<T>("PUT", path, data, headers);
  }

  async patch<T>(
    path: string,
    data?: unknown,
    headers?: HeadersInit
  ): Promise<T> {
    return this.request<T>("PATCH", path, data, headers);
  }

  async delete<T>(path: string, headers?: HeadersInit): Promise<T> {
    return this.request<T>("DELETE", path, undefined, headers);
  }
}
