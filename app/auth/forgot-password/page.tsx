"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Spinner } from "@/components/ui/spinner";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";
import { APIError } from "@/app/lib/api/errors";
import { forgotPasswordSchema } from "@/app/lib/api/schemas";
import api, { ToastVariant } from "@/app/lib/api";
import { TOAST_MSGS } from "@/app/constants/constants";
import Link from "next/link";
import { EmailIcon } from "@/components/icons/icons";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPassword() {
  const router = useRouter();
  const [toast, setToast] = useState<{
    message: string;
    variant: ToastVariant;
    open: boolean;
  } | null>(null);
  const [submitDisabled, setSubmitDisabled] = useState(false);

  const { mutate, status } = useMutation<
    void,
    APIError,
    ForgotPasswordFormData
  >({
    mutationFn: (data) => api.post<void>("/auth/forgot", data),
    onSuccess: (_, formData) => {
      setToast({
        message: TOAST_MSGS.OTP_SENT,
        variant: "default",
        open: true,
      });
      router.push(`/auth/otp?email=${encodeURIComponent(formData.email)}`);
    },
    onError: (error) => {
      setToast({
        message: error.message || TOAST_MSGS.GENERIC_ERROR,
        variant: "destructive",
        open: true,
      });
      setSubmitDisabled(true);
      setTimeout(() => setSubmitDisabled(false), 1000);
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
  });

  const onSubmit = (data: ForgotPasswordFormData) => mutate(data);

  const closeToast = () => setToast(null);

  return (
    <div className="space-y-6">
      <header>
        <h1 className="text-3xl font-semibold mb-0.5">Forgot Password</h1>
        <p className="text-sm text-muted-foreground">
          Enter your email to receive a password reset OTP
        </p>
      </header>

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-2">
          <label
            htmlFor="email"
            className="text-sm font-semibold text-[#464646]"
          >
            Email Address
          </label>
          <div className="relative">
            <Input
              type="email"
              placeholder="Enter your email Address"
              {...register("email", {
                onBlur: () => trigger("email"),
              })}
              className="pl-10"
            />

            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <EmailIcon />
            </div>
          </div>
          <div className="h-1">
            {errors.email?.message && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <Button
          type="submit"
          disabled={status === "pending" || submitDisabled}
          className="w-full bg-[#018969] hover:bg-[#017857] text-white"
        >
          {status === "pending" ? <Spinner /> : "Send Reset Link"}
        </Button>
      </form>

      <div className="text-center text-sm">
        <Link
          href="/auth/login"
          className="text-[#018969] hover:underline"
          aria-label="Back to login page"
        >
          Back to Login
        </Link>
      </div>

      {toast?.open && (
        <Toast
          variant={toast.variant}
          role="alert"
          aria-live={toast.variant === "destructive" ? "assertive" : "polite"}
        >
          <div className="grid gap-1">
            <ToastTitle>
              {toast.variant === "default" ? "Success" : "Error"}
            </ToastTitle>
            <ToastDescription>{toast.message}</ToastDescription>
          </div>
          <ToastClose onClick={closeToast} aria-label="Close notification" />
        </Toast>
      )}
    </div>
  );
}
