export const TOAST_MSGS = {
  LOGIN_SUCCESS: "You have successfully logged in.",
  SIGNUP_SUCCESS: "Your account has been created successfully.",
  LOGOUT_SUCCESS: "You have successfully logged out.",
  GENERIC_ERROR: "An unexpected error occurred. Please try again.",
  REQUIRED_FIELD: "This field is required.",
  INVALID_EMAIL: "Please enter a valid email address.",
  PASSWORD_LENGTH: "Your password must be at least 6 characters long.",
  PASSWORD_MISMATCH: "The passwords you entered do not match.",
  OTP_SENT: "A one-time password has been sent to your email address.",
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
