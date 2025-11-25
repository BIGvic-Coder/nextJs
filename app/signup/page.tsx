"use client"; // must be first line

import dynamic from "next/dynamic";

// Dynamically import SignupForm so it only renders on the client
const SignupForm = dynamic(() => import("@/app/ui/signup-form"), {
  ssr: false,
});

export default function SignupPage() {
  return (
    <main className="flex items-center justify-center min-h-screen bg-gray-100">
      <SignupForm />
    </main>
  );
}
