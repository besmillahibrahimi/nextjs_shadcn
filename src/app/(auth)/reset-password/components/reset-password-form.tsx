"use client";

import { FormBuilder } from "@/components/form/form-builder";
import type { FormSchema } from "@/components/form/types";
import Link from "next/link";
import * as React from "react";

const resetPasswordSchema: FormSchema = {
  fields: [
    {
      name: "password",
      label: "New Password",
      type: "password",
      placeholder: "Enter your new password",
    },
    {
      name: "confirmPassword",
      label: "Confirm New Password",
      type: "password",
      placeholder: "Confirm your new password",
    },
  ],
  submitButtonText: "Reset Password",
  showReset: false,
};

interface ResetPasswordFormProps {
  token: string;
}

export function ResetPasswordForm({ token }: ResetPasswordFormProps) {
  const [isLoading, setIsLoading] = React.useState<boolean>(false);

  async function onSubmit(values: Record<string, unknown>) {
    setIsLoading(true);

    // TODO: Implement reset password logic here
    console.log({ ...values, token });

    setIsLoading(false);
  }

  return (
    <div className="grid gap-6">
      <FormBuilder schema={resetPasswordSchema} onSubmit={onSubmit} />
      <div className="text-center text-sm">
        Remember your password?{" "}
        <Link href="/login" className="text-primary hover:underline">
          Sign in
        </Link>
      </div>
    </div>
  );
}
