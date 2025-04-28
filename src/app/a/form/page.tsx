// app/form-builder-demo/page.tsx

"use client";

import React from "react";
import { FormBuilder } from "@/components/form/form-builder";
import type { FormSchema } from "@/components/form/types";
import { z } from "zod";
import { toast } from "sonner";

const exampleSchema: FormSchema = {
  fields: [
    {
      name: "personalInfo",
      label: "Personal Information",
      type: "object",
      properties: {
        firstName: {
          name: "firstName",
          label: "First Name",
          type: "text",
          required: true,
          validation: z.string().min(2, "First name must be at least 2 characters"),
          placeholder: "Enter your first name",
        },
        lastName: {
          name: "lastName",
          label: "Last Name",
          type: "text",
          required: true,
          validation: z.string().min(2, "Last name must be at least 2 characters"),
          placeholder: "Enter your last name",
        },
        email: {
          name: "email",
          label: "Email Address",
          type: "email",
          required: true,
          validation: z.string().email("Invalid email address"),
          placeholder: "email@example.com",
        },
        phone: {
          name: "phone",
          label: "Phone Number",
          type: "tel",
          placeholder: "(123) 456-7890",
          pattern: "^\\(\\d{3}\\) \\d{3}-\\d{4}$",
          description: "Format: (123) 456-7890",
        },
      },
    },
    {
      name: "addressInfo",
      label: "Address",
      type: "object",
      properties: {
        street: {
          name: "street",
          label: "Street Address",
          type: "text",
          required: true,
          placeholder: "Enter street address",
        },
        city: {
          name: "city",
          label: "City",
          type: "text",
          required: true,
          placeholder: "Enter city",
        },
        state: {
          name: "state",
          label: "State",
          type: "select",
          required: true,
          options: [
            { label: "California", value: "CA" },
            { label: "New York", value: "NY" },
            { label: "Texas", value: "TX" },
            { label: "Florida", value: "FL" },
          ],
          placeholder: "Select a state",
        },
        zip: {
          name: "zip",
          label: "ZIP Code",
          type: "text",
          required: true,
          validation: z.string().regex(/^\d{5}(-\d{4})?$/, "Invalid ZIP code format"),
          placeholder: "12345 or 12345-6789",
        },
      },
    },
    {
      name: "employmentHistory",
      label: "Employment History",
      type: "array",
      itemField: {
        name: "employment",
        type: "object",
        properties: {
          employer: {
            name: "employer",
            label: "Employer",
            type: "text",
            required: true,
            placeholder: "Company name",
          },
          position: {
            name: "position",
            label: "Position",
            type: "text",
            required: true,
            placeholder: "Job title",
          },
          startDate: {
            name: "startDate",
            label: "Start Date",
            type: "date",
            required: true,
          },
          endDate: {
            name: "endDate",
            label: "End Date",
            type: "date",
          },
          current: {
            name: "current",
            label: "Current Employer",
            type: "checkbox",
            defaultValue: false,
          },
        },
      },
      addButtonText: "Add Employment History",
      removeButtonText: "Remove",
      minItems: 1,
      maxItems: 5,
    },
    {
      name: "skills",
      label: "Skills",
      type: "array",
      itemField: {
        name: "skill",
        type: "text",
        required: true,
        placeholder: "Enter a skill",
      },
      addButtonText: "Add Skill",
      description: "List your professional skills",
    },
    {
      name: "interests",
      label: "Interests",
      type: "select",
      options: [
        { label: "Reading", value: "reading" },
        { label: "Sports", value: "sports" },
        { label: "Music", value: "music" },
        { label: "Travel", value: "travel" },
        { label: "Cooking", value: "cooking" },
      ],
      multiple: true,
      placeholder: "Select your interests",
    },
    {
      name: "preferredContact",
      label: "Preferred Contact Method",
      type: "radio",
      options: [
        { label: "Email", value: "email" },
        { label: "Phone", value: "phone" },
        { label: "Text", value: "text" },
      ],
      layout: "vertical",
      required: true,
    },
    {
      name: "receiveUpdates",
      label: "Receive updates about new opportunities",
      type: "switch",
      defaultValue: true,
    },
    {
      name: "notes",
      label: "Additional Notes",
      type: "custom",
      render: ({ value, onChange }) => (
        <textarea
          value={value || ""}
          onChange={(e) => onChange?.(e as any)}
          rows={5}
          className="w-full p-2 border rounded-md"
          placeholder="Additional information you'd like to share..."
        />
      ),
    },
  ],
  submitButtonText: "Submit Application",
  cancelButtonText: "Cancel",
  showReset: true,
  resetButtonText: "Clear Form",
  className: "max-w-3xl mx-auto p-6 bg-white rounded-lg shadow",
};

export default function FormBuilderDemo() {
  const handleSubmit = (data: any) => {
    console.log("Form data:", data);
    toast("Form Submitted", {
      description: "Your application has been successfully submitted.",
    });
  };

  const handleCancel = () => {
    toast("Form Cancelled", {
      description: "Your application has been cancelled.",
    });
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Job Application Form</h1>
      <FormBuilder schema={exampleSchema} onSubmit={handleSubmit} onCancel={handleCancel} />
    </div>
  );
}
