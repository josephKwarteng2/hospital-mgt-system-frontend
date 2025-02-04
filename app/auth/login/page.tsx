"use client";

import LoginForm from "./LoginForm";

export default function Login() {
  return (
    <div>
      <header className="">
        <h1 className="text-3xl font-semibold text-center mb-0.5 pb-6">
          Welcome Back
        </h1>
        <p className="text-[#7C817D] text-sm text-center -mt-5">
          Enter your email and password to access your account.{" "}
        </p>
      </header>
      <LoginForm />
    </div>
  );
}
