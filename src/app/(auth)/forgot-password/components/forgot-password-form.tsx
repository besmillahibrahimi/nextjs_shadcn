"use client";

import { FormBuilder } from "@/components/form/form-builder";
import type { FormSchema } from "@/components/form/types";
import Link from "next/link";
import * as React from "react";

const forgotPasswordSchema: FormSchema = {
  fields: [
    {
      name: "email",
      label: "Email",
      type: "email",
      placeholder: "name@example.com",
    },
  ],
  submitButtonText: "Send Reset Link",
  showReset: false,
};

export function ForgotPasswordForm() {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(values: Record<string, unknown>) {
    setIsLoading(true);

    // TODO: Implement forgot password logic here
    console.log(values);

    setIsLoading(false);
  }

  return (
    <div className="grid gap-6">
      <FormBuilder schema={forgotPasswordSchema} onSubmit={onSubmit} />
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
