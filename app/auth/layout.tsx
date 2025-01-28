import React, { ReactNode } from "react";

type AuthLayoutProps = {
  title: string;
  children: ReactNode;
};

const AuthLayout = ({ title, children }: AuthLayoutProps) => {
  return (
    <div className="relative min-h-screen bg-gray-100">
      <div className="flex items-center justify-center w-full h-screen">
        <div className="flex w-full h-full overflow-hidden">
          <div className="hidden md:block w-1/2 bg-[#018969]">
            <div className="flex items-center justify-center w-full h-full bg-cover bg-center">
              <img
                src="/Doctor.svg"
                alt="Auth background"
                className="w-1/2 h-1/2 object-cover"
              />
            </div>
          </div>

          <div className="w-full md:w-1/2 p-6 flex justify-center items-center bg-gray-50">
            <div className="w-full max-w-md">
              <h1 className="text-xl font-semibold mb-4 text-center">
                {title}
              </h1>
              {children}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
