"use client";

import Link from "next/link";
import ForgotPasswordForm from "./ForgotPassworForm";

export default function ForgotPassword() {
  return (
    <div>
      <header className="pb-6">
        <h1 className="text-3xl font-semibold mb-0.5 text-center">
          Forgot Password
        </h1>
        <p className="text-sm text-muted-foreground text-center">
          Don’t worry, enter your email address below. We will send you OTP to
          reset your password
        </p>
      </header>
      <ForgotPasswordForm />

      <div className="text-center text-sm pt-3">
        <Link
          href="/auth/login"
          className="text-[#018969] hover:underline"
          aria-label="Back to login page"
        >
          Back to Login
        </Link>
      </div>
    </div>
  );
}
