"use client";

import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import { Spinner } from "@/components/ui/spinner";
import { loginSchema } from "@/app/lib/api/schemas";
import api, { APIError, Role, ToastVariant } from "@/app/lib/api";
import { TOAST_MSGS } from "@/app/constants/constants";
import { useState } from "react";
import {
  Toast,
  ToastTitle,
  ToastDescription,
  ToastClose,
} from "@/components/ui/toast";
import { EmailIcon, PasswordIcon } from "@/components/icons/icons";
import Link from "next/link";

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  token: string;
  user: { role: Role };
}

export default function Login() {
  const router = useRouter();
  const [toast, setToast] = useState<{
    message: string;
    variant: ToastVariant;
    open: boolean;
  }>({
    message: "",
    variant: "default",
    open: false,
  });

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate, status } = useMutation<
    LoginResponse,
    APIError,
    LoginFormValues
  >({
    mutationFn: async (data) => api.post("/auth/login", data),
    onSuccess: (data) => {
      localStorage.setItem("token", data.token);
      localStorage.setItem("role", data.user.role);

      switch (data.user.role) {
        case Role.Admin:
          router.push("/admin-dashboard");
          break;
        case Role.Doctor:
          router.push("/doctor-dashboard");
          break;
        case Role.Patient:
          router.push("/patient-dashboard");
          break;
        default:
          router.push("/");
      }

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

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  const closeToast = () => setToast({ ...toast, open: false });

  return (
    <div>
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem className="relative space-y-0.1">
                <FormLabel>Email Address</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      placeholder="Enter your email address"
                      className={`pl-10 ${
                        form.formState.errors.email
                          ? "border-red-500 placeholder-red-500"
                          : ""
                      }`}
                      onBlur={() => form.trigger("email")}
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <EmailIcon
                      className={
                        form.formState.errors.email
                          ? "stroke-red-500"
                          : "stroke-[#5B5F5D]"
                      }
                    />
                  </div>
                </div>
                <div className="h-0.5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem className="relative space-y-0.1">
                <FormLabel>Password</FormLabel>
                <div className="relative">
                  <FormControl>
                    <Input
                      {...field}
                      type="password"
                      placeholder="Enter your password"
                      className={`pl-10 ${
                        form.formState.errors.password
                          ? "border-red-500 placeholder-red-500"
                          : ""
                      }`}
                      onBlur={() => form.trigger("password")}
                    />
                  </FormControl>
                  <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                    <PasswordIcon
                      className={
                        form.formState.errors.password
                          ? "stroke-red-500"
                          : "stroke-[#5B5F5D]"
                      }
                    />
                  </div>
                </div>
                <div className="h-0.5">
                  <FormMessage />
                </div>
              </FormItem>
            )}
          />

          <div className="flex items-center justify-between">
            <label className="flex items-center cursor-pointer">
              <input type="checkbox" className="mr-2 cursor-pointer" />
              <span className="text-sm font-normal text-[#7C817D]">
                Remember Me
              </span>
            </label>
            <Link
              href="/auth/forgot-password"
              className="text-sm text-blue-600 hover:underline"
            >
              <span className="text-[#018969]">Forgot Password?</span>
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
      </Form>

      {toast.open && (
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
