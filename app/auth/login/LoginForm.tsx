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
import api, { APIError, Role } from "@/app/lib/api";
import { TOAST_MSGS } from "@/app/constants/constants";
import { EmailIcon, PasswordIcon } from "@/components/icons/icons";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";

type LoginFormValues = z.infer<typeof loginSchema>;

interface LoginResponse {
  token: string;
  user: { role: Role };
}

export default function Login() {
  const router = useRouter();
  const { toast } = useToast();

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
          router.push("/admin/dashboard");
          break;
        case Role.Doctor:
          router.push("/doctor/dashboard");
          break;
        case Role.Patient:
          router.push("/patient/dashboard");
          break;
        default:
          router.push("/");
      }

      toast({
        title: "Success",
        description: TOAST_MSGS.LOGIN_SUCCESS,
        variant: "default",
      });
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: LoginFormValues) => {
    mutate(data);
  };

  return (
    <div className="mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              const isTouched = form.formState.touchedFields.email;
              const hasError = form.formState.errors.email;

              return (
                <FormItem className="relative space-y-0.1">
                  <FormLabel>Email Address</FormLabel>
                  <div className="relative group">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Enter your email address"
                        className={`pl-10 bg-gray-200 transition-all duration-300 focus:ring-2 focus:ring-[#018969] focus:border-[#018969] focus:outline-none ${
                          hasError
                            ? `border-red-500 placeholder-red-500 focus:ring-red-500 ${
                                isTouched ? "animate-shake" : ""
                              }`
                            : "focus:ring-[#018969] focus:border-[#018969]"
                        }`}
                        onBlur={() => form.trigger("email")}
                      />
                    </FormControl>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <EmailIcon
                        className={`transition-colors duration-300 ${
                          hasError
                            ? "stroke-red-500"
                            : "stroke-[#5B5F5D] group-focus-within:stroke-[#018969]"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="h-0.5">
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => {
              const isTouched = form.formState.touchedFields.password;
              const hasError = form.formState.errors.password;

              return (
                <FormItem className="relative space-y-0.1">
                  <FormLabel>Password</FormLabel>
                  <div className="relative group">
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        placeholder="Enter your password"
                        className={`pl-10 bg-gray-200 transition-all duration-300 focus:ring-2 focus:ring-[#018969] focus:border-[#018969] focus:outline-none ${
                          hasError
                            ? `border-red-500 placeholder-red-500 focus:ring-red-500 ${
                                isTouched ? "animate-shake" : ""
                              }`
                            : "focus:ring-[#018969] focus:border-[#018969]"
                        }`}
                        onBlur={() => form.trigger("password")}
                      />
                    </FormControl>
                    <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                      <PasswordIcon
                        className={`transition-colors duration-300 ${
                          hasError
                            ? "stroke-red-500"
                            : "stroke-[#5B5F5D] group-focus-within:stroke-[#018969]"
                        }`}
                      />
                    </div>
                  </div>
                  <div className="h-0.5">
                    <FormMessage />
                  </div>
                </FormItem>
              );
            }}
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
              className="text-sm text-[#018969] hover:underline hover:underline"
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
    </div>
  );
}
