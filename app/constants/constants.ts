export const TOAST_MSGS = {
  LOGIN_SUCCESS: "Login successful",
  LOGIN_ERROR: "Invalid email or password",
  SIGNUP_SUCCESS: "Account created successfully",
  SIGNUP_ERROR: "An error occurred while creating your account",
  LOGOUT_SUCCESS: "Logout successful",
  LOGOUT_ERROR: "An error occurred while logging out",
  UNAUTHORIZED: "You are not authorized to view this page",
  GENERIC_ERROR: "An error occurred",
  INVALID_EMAIL: "Invalid email address",
  PASSWORD_LENGTH: "Password must be at least 6 characters long",
  PASSWORD_MISMATCH: "Passwords don't match",
};

export const HTTP_STATUS = {
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  INTERNAL_SERVER_ERROR: 500,
} as const;

export const ERROR_MESSAGES = {
  [HTTP_STATUS.BAD_REQUEST]: "Bad Request",
  [HTTP_STATUS.UNAUTHORIZED]: "Unauthorized",
  [HTTP_STATUS.FORBIDDEN]: "Forbidden",
  [HTTP_STATUS.NOT_FOUND]: "Not Found",
  [HTTP_STATUS.INTERNAL_SERVER_ERROR]: "Internal Server Error",
  DEFAULT: "An error occurred",
} as const;
