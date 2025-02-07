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
import { handleRedirection, TOAST_MSGS } from "@/app/constants/constants";
import { EmailIcon, PasswordIcon } from "@/components/icons/icons";
import Link from "next/link";
import { useToast } from "@/hooks/use-toast";
import { useCallback } from "react";

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

      handleRedirection(data.user.role, router);

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

  const onSubmit = useCallback(
    (data: LoginFormValues) => {
      mutate(data);
    },
    [mutate]
  );

  return (
    <div className="mt-10">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => {
              const hasError = form.formState.errors.email;
              const isFilled = form.getValues(field.name);

              return (
                <FormItem className="relative mt-6">
                  <div className="relative group">
                    <FormControl>
                      <Input
                        {...field}
                        className={`
                          pl-10
                          ${hasError ? "border-red-500" : "border-[#D0D1D0]"}
                          peer  
                        `}
                        onBlur={() => form.trigger("email")}
                      />
                    </FormControl>
                    <FormLabel
                      className={`
                        absolute left-10 text-[#464646] 
                        transition-all duration-300 
                        transform -translate-y-1/2
                        pointer-events-none
                        ${hasError ? "text-red-500" : "text-[#464646]"}
                        ${
                          isFilled || form.formState.touchedFields.email
                            ? "top-0 text-sm bg-white px-1"
                            : "top-1/2 text-base"
                        }  
                        peer-focus:top-0 peer-focus:text-sm peer-focus:bg-gray-200 peer-focus:px-1
                      `}
                    >
                      Email Address
                    </FormLabel>
                    <div className="absolute inset-y-0 left-3 flex items-center">
                      <EmailIcon
                        className={`
                          transition-colors duration-300
                          ${hasError ? "stroke-red-500" : "stroke-[#0ef]"}
                        `}
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
              const hasError = form.formState.errors.password;
              const isFilled = form.getValues(field.name);

              return (
                <FormItem className="relative mt-6">
                  <div className="relative group">
                    <FormControl>
                      <Input
                        {...field}
                        type="password"
                        className={`
                          pl-10 
                          ${hasError ? "border-red-500" : "border-[#464646]"}
                          peer
                        `}
                        onBlur={() => form.trigger("password")}
                      />
                    </FormControl>
                    <FormLabel
                      className={`
                        absolute left-10 text-[#464646]
                        transition-all duration-300 
                        transform -translate-y-1/2
                        pointer-events-none
                        ${hasError ? "text-red-500" : "text-[#464646]"}
                        ${
                          isFilled || form.formState.touchedFields.password
                            ? "top-0 text-sm bg-white px-1"
                            : "top-1/2 text-base"
                        }
                        peer-focus:top-0 peer-focus:text-sm peer-focus:bg-gray-200 peer-focus:px-1
                      `}
                    >
                      Password
                    </FormLabel>
                    <div className="absolute inset-y-0 left-3 flex items-center">
                      <PasswordIcon
                        className={`
                          transition-colors duration-300
                          ${hasError ? "stroke-red-500" : "stroke-[#464646]"}
                        `}
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
