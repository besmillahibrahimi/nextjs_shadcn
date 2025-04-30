"use client";

import { FormBuilder } from "@/components/form/form-builder";
import type { FormSchema } from "@/components/form/types";
import Link from "next/link";
import * as React from "react";
import { Icons } from "../../icons";

const loginSchema: FormSchema = {
  fields: [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "name@example.com",
    },
    {
      name: "password",
      label: "Password",
      type: "password",
      placeholder: "Enter your password",
    },
  ],
  submitButtonText: "Sign In",
  showReset: false,
};

export function LoginForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(values: Record<string, unknown>) {
    setIsLoading(true);

    // TODO: Implement login logic here
    console.log(values);

    setIsLoading(false);
  }

  return (
    <div className="grid gap-6">
      <FormBuilder schema={loginSchema} onSubmit={onSubmit} />
      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
        </div>
      </div>
      <div className="grid grid-cols-2 gap-6">
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          disabled={isLoading}
        >
          <Icons.gitHub className="mr-2 h-4 w-4" />
          Github
        </button>
        <button
          type="button"
          className="inline-flex items-center justify-center rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 border border-input bg-background hover:bg-accent hover:text-accent-foreground h-10 px-4 py-2"
          disabled={isLoading}
        >
          <Icons.google className="mr-2 h-4 w-4" />
          Google
        </button>
      </div>
      <div className="text-center text-sm">
        <Link href="/forgot-password" className="text-primary hover:underline">
          Forgot your password?
        </Link>
      </div>
      <div className="text-center text-sm">
        Don&apos;t have an account?{" "}
        <Link href="/register" className="text-primary hover:underline">
          Sign up
        </Link>
      </div>
    </div>
  );
}
