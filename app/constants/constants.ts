import { Role } from "../lib/api";
import { useRouter } from "next/navigation";

export const TOAST_MSGS = {
  LOGIN_SUCCESS: "You have successfully logged in.",
  SIGNUP_SUCCESS: "Your account has been created successfully.",
  LOGOUT_SUCCESS: "You have successfully logged out.",
  GENERIC_ERROR: "An unexpected error occurred. Please try again.",
  PASSWORD_LENGTH: "Your password must be at least 6 characters long.",
  PASSWORD_MISMATCH: "The passwords you entered do not match.",
  OTP_SENT: "A one-time password has been sent to your email address.",
  OTP_VERIFIED: "Your one-time password has been verified.",
};

export const VALIDATION_ERRORS = {
  REQUIRED_FIELD: "This field is required.",
  INVALID_EMAIL: "Please enter a valid email address.",
  PASSWORD_LENGTH: "Your password must be at least 6 characters long.",
  PASSWORD_UPPERCASE:
    "Your password must contain at least one uppercase letter.",
  PASSWORD_NUMBER: "Your password must contain at least one number.",
  PASSWORD_MISMATCH: "The passwords you entered do not match.",
  INVALID_OTP: "Please enter a valid 6-digit one-time password.",
  EMAIL_MAX_LENGTH: "Email address must be less than 100 characters.",
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

export const handleRedirection = (
  role: Role,
  router: ReturnType<typeof useRouter>
) => {
  const rolePaths: Record<Role, string> = {
    [Role.Admin]: "/admin/dashboard",
    [Role.Doctor]: "/doctor/dashboard",
    [Role.Patient]: "/patient/dashboard",
  };
  router.push(rolePaths[role] || "/");
};
