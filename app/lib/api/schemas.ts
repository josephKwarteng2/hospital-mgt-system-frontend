import { z } from "zod";
import { TOAST_MSGS, VALIDATION_ERRORS } from "../../constants/constants";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, VALIDATION_ERRORS.REQUIRED_FIELD)
    .email(VALIDATION_ERRORS.INVALID_EMAIL)
    .max(100, VALIDATION_ERRORS.EMAIL_MAX_LENGTH),
  password: z
    .string()
    .min(6, TOAST_MSGS.PASSWORD_LENGTH)
    .regex(/[A-Z]/, VALIDATION_ERRORS.PASSWORD_UPPERCASE)
    .regex(/[0-9]/, VALIDATION_ERRORS.PASSWORD_NUMBER),
  rememberMe: z.boolean().optional(),
});

export const signupSchema = z
  .object({
    email: z.string().email(VALIDATION_ERRORS.INVALID_EMAIL),
    password: z.string().min(6, TOAST_MSGS.PASSWORD_LENGTH),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: TOAST_MSGS.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });

export const forgotPasswordSchema = z.object({
  email: z.string().email(VALIDATION_ERRORS.INVALID_EMAIL),
});

export const otpSchema = z.object({
  otp: z.string().length(6, VALIDATION_ERRORS.INVALID_OTP),
});

export const ErrorResponseSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
