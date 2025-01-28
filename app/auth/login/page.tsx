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
import { loginSchema } from "@/app/lib/api/schemas";
import { LoginResponse, ToastVariant } from "@/app/lib/api/types";
import api from "@/app/lib/api";
import { TOAST_MSGS } from "@/app/constants/constants";
import Link from "next/link";
import { EmailIcon, PasswordIcon } from "@/components/icons/icons";

type LoginFormData = z.infer<typeof loginSchema>;

export default function Login() {
  const router = useRouter();
  const [toast, setToast] = useState<{
    message: string;
    variant: ToastVariant;
    open: boolean;
  } | null>(null);

  const { mutate, status } = useMutation<
    LoginResponse,
    APIError,
    LoginFormData
  >({
    mutationFn: (data) => api.post<LoginResponse>("/auth/login", data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      router.push("/dashboard");
      setToast({
        message: TOAST_MSGS.LOGIN_SUCCESS,
        variant: "default",
        open: true,
      });
    },
    onError: (error) => {
      setToast({
        message: error.message,
        variant: "destructive",
        open: true,
      });
    },
  });

  const {
    register,
    handleSubmit,
    trigger,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = (data: LoginFormData) => mutate(data);

  const closeToast = () => setToast(null);

  return (
    <div className="space-y-2">
      <header>
        <h1 className="text-3xl font-semibold mb-0.5 p-6">Login</h1>
      </header>
      <form onSubmit={handleSubmit(onSubmit)} className="p-6">
        <div className="-mt-10 space-y-2">
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
          <div className="h-3">
            {errors.email?.message && (
              <p className="text-xs text-red-600">{errors.email.message}</p>
            )}
          </div>
        </div>

        <div className="space-y-2">
          <label
            htmlFor="password"
            className="text-sm font-semibold text-[#464646]"
          >
            Password
          </label>
          <div className="relative">
            <Input
              type="password"
              placeholder="Enter your password"
              {...register("password", {
                onBlur: () => trigger("password"),
              })}
              className="pl-10"
            />

            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <PasswordIcon />
            </div>
          </div>
          <div className="h-5">
            {errors.password?.message && (
              <p className="text-xs text-red-600">{errors.password.message}</p>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between">
          <label className="flex items-center cursor-pointer">
            <input type="checkbox" className="mr-2 cursor-pointer" />
            <span className="text-sm font-normal text-[#7C817D]">
              {" "}
              Remember Me
            </span>
          </label>
          <Link
            href="/auth/forgot-password"
            className="text-sm text-blue-600 hover:underline"
          >
            <span className=" text-[#018969]"> Forgot Password?</span>
          </Link>
        </div>

        <Button
          type="submit"
          disabled={status === "pending"}
          className="w-full bg-[#018969] hover:bg-[#017857] text-white mt-4"
        >
          {status === "pending" ? <Spinner /> : "Login"}
        </Button>
      </form>

      {toast?.open && (
        <Toast variant={toast.variant}>
          <ToastTitle>
            {toast.variant === "default" ? "Success" : "Error"}
          </ToastTitle>
          <ToastDescription>{toast.message}</ToastDescription>
          <ToastClose onClick={closeToast} />
        </Toast>
      )}
    </div>
  );
}
