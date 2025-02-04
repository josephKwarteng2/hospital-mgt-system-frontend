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
import { forgotPasswordSchema } from "@/app/lib/api/schemas";
import api, { APIError } from "@/app/lib/api";
import { TOAST_MSGS } from "@/app/constants/constants";
import { EmailIcon } from "@/components/icons/icons";
import { useToast } from "@/hooks/use-toast";

type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;

export default function ForgotPasswordForm() {
  const router = useRouter();
  const { toast } = useToast();

  const form = useForm<ForgotPasswordFormData>({
    resolver: zodResolver(forgotPasswordSchema),
    defaultValues: {
      email: "",
    },
  });

  const { mutate, status } = useMutation<
    void,
    APIError,
    ForgotPasswordFormData
  >({
    mutationFn: (data) => api.post<void>("/auth/forgot", data),
    onSuccess: (_, formData) => {
      toast({
        title: "Success",
        description: TOAST_MSGS.OTP_SENT,
        variant: "default",
      });
      router.push(`/auth/otp?email=${encodeURIComponent(formData.email)}`);
    },
    onError: (error) => {
      toast({
        title: "Error",
        description: error.message || TOAST_MSGS.GENERIC_ERROR,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: ForgotPasswordFormData) => mutate(data);

  return (
    <div>
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
                        className={`pl-10 bg-gray-200 transition-all duration-300 focus:ring-2 ${
                          hasError
                            ? `border-red-500 placeholder-red-500 focus:ring-red-500 ${
                                isTouched ? "animate-shake" : ""
                              }`
                            : "focus:ring-[#018969] focus:border-transparent"
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
          <Button
            type="submit"
            disabled={status === "pending"}
            className="w-full bg-[#018969] hover:bg-[#017857] text-white"
          >
            {status === "pending" ? <Spinner /> : "Send Reset Link"}
          </Button>
        </form>
      </Form>
    </div>
  );
}
