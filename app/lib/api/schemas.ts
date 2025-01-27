import { z } from "zod";
import { TOAST_MSGS } from "../../constants/constants";

export const loginSchema = z.object({
  email: z.string().email(TOAST_MSGS.INVALID_EMAIL),
  password: z.string().min(6, TOAST_MSGS.PASSWORD_LENGTH),
  // rememberMe: z.boolean(),
});

export const signupSchema = z
  .object({
    email: z.string().email(TOAST_MSGS.INVALID_EMAIL),
    password: z.string().min(6, TOAST_MSGS.PASSWORD_LENGTH),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: TOAST_MSGS.PASSWORD_MISMATCH,
    path: ["confirmPassword"],
  });

export const ErrorResponseSchema = z.object({
  message: z.string().optional(),
  error: z.string().optional(),
});

export type ErrorResponse = z.infer<typeof ErrorResponseSchema>;
