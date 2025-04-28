import { z } from "zod";
import type { FormSchema, ValidationRule } from "./types";

export const createValidation = (fieldType: string, rules: ValidationRule[] = []) => {
  let schema: z.ZodTypeAny;

  // Base schema based on field type
  switch (fieldType) {
    case "number":
      schema = z.coerce.number();
      break;
    case "date":
      schema = z.date();
      break;
    case "boolean":
    case "checkbox":
    case "switch":
      schema = z.boolean();
      break;
    case "array":
      schema = z.array(z.any());
      break;
    case "object":
      schema = z.object({});
      break;
    case "email":
      schema = z.string().email("Invalid email address");
      break;
    case "url":
      schema = z.string().url("Invalid URL");
      break;
    default:
      schema = z.string();
  }

  // Apply rules
  for (const rule of rules) {
    switch (rule.type) {
      case "required":
        if (
          fieldType === "string" ||
          fieldType === "text" ||
          fieldType === "email" ||
          fieldType === "url" ||
          fieldType === "tel" ||
          fieldType === "password"
        ) {
          schema = (schema as z.ZodString).min(1, rule.message ?? "This field is required");
        }
        break;
      case "min":
        if (fieldType === "number") {
          schema = (schema as z.ZodNumber).min(rule.value, rule.message);
        } else if (fieldType === "date") {
          schema = (schema as z.ZodDate).min(new Date(rule.value), rule.message);
        } else if (fieldType === "array") {
          schema = (schema as z.ZodArray<any>).min(rule.value, rule.message);
        }
        break;
      case "max":
        if (fieldType === "number") {
          schema = (schema as z.ZodNumber).max(rule.value, rule.message);
        } else if (fieldType === "date") {
          schema = (schema as z.ZodDate).max(new Date(rule.value), rule.message);
        } else if (fieldType === "array") {
          schema = (schema as z.ZodArray<any>).max(rule.value, rule.message);
        }
        break;
      case "minLength":
        if (
          fieldType === "string" ||
          fieldType === "text" ||
          fieldType === "email" ||
          fieldType === "url" ||
          fieldType === "tel" ||
          fieldType === "password"
        ) {
          schema = (schema as z.ZodString).min(rule.value, rule.message);
        }
        break;
      case "maxLength":
        if (
          fieldType === "string" ||
          fieldType === "text" ||
          fieldType === "email" ||
          fieldType === "url" ||
          fieldType === "tel" ||
          fieldType === "password"
        ) {
          schema = (schema as z.ZodString).max(rule.value, rule.message);
        }
        break;
      case "email":
        if (fieldType === "string" || fieldType === "text" || fieldType === "email") {
          schema = (schema as z.ZodString).email(rule.message ?? "Invalid email address");
        }
        break;
      case "url":
        if (fieldType === "string" || fieldType === "text" || fieldType === "url") {
          schema = (schema as z.ZodString).url(rule.message ?? "Invalid URL");
        }
        break;
      case "pattern":
        if (
          fieldType === "string" ||
          fieldType === "text" ||
          fieldType === "email" ||
          fieldType === "url" ||
          fieldType === "tel" ||
          fieldType === "password"
        ) {
          schema = (schema as z.ZodString).regex(
            new RegExp(rule.value),
            rule.message ?? "Invalid format"
          );
        }
        break;
      case "oneOf":
        schema = z.enum(rule.value, { message: rule.message });
        break;
      case "custom":
        if (typeof rule.value === "function") {
          schema = schema.refine(rule.value, { message: rule.message });
        }
        break;
    }
  }

  return schema;
};

// Helper to build a Zod schema from our form schema
export function buildZodSchema(schema: FormSchema): z.ZodTypeAny {
  const shape: Record<string, z.ZodTypeAny> = {};

  for (const field of schema.fields) {
    if (field.hidden) continue;

    // Use custom validation if provided
    if (field.validation) {
      shape[field.name] = field.validation;
      continue;
    }

    // Build validation based on field type and attributes
    const fieldSchema = createValidation(field.type, field.rules);

    // Handle required fields
    shape[field.name] = field.required ? fieldSchema : fieldSchema.optional();
  }

  return z.object(shape);
}

// Helper to generate default values from schema
export function generateDefaultValues(schema: FormSchema): Record<string, any> {
  const defaultValues: Record<string, any> = {};

  for (const field of schema.fields) {
    if (field.defaultValue !== undefined) {
      defaultValues[field.name] = field.defaultValue;
    } else if (field.type === "object") {
      const nestedDefaultValues = {} as Record<string, any>;

      for (const [key, nestedField] of Object.entries(field.properties)) {
        if (nestedField.defaultValue !== undefined) {
          nestedDefaultValues[key] = nestedField.defaultValue;
        }
      }

      defaultValues[field.name] = nestedDefaultValues;
    } else if (field.type === "array") {
      defaultValues[field.name] = [];
    } else if (field.type === "checkbox" || field.type === "switch") {
      defaultValues[field.name] = false;
    } else if (field.type === "select" && field.multiple) {
      defaultValues[field.name] = [];
    }
  }

  return defaultValues;
}
