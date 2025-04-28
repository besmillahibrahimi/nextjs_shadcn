import type { ReactNode } from "react";
import type { z } from "zod";
import type { InputProps } from "../ui/input";

export type ValidationRule = {
  type:
    | "required"
    | "min"
    | "max"
    | "minLength"
    | "maxLength"
    | "email"
    | "url"
    | "pattern"
    | "oneOf"
    | "custom";
  value?: any;
  message?: string;
};

// Base field interface that all field types will extend
type BaseFieldSchema = {
  name: string;
  label?: ReactNode;
  description?: string;
  placeholder?: string;
  defaultValue?: unknown;
  disabled?: boolean;
  required?: boolean;
  hidden?: boolean;
  validation?: z.ZodTypeAny;
  rules?: ValidationRule[];
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  style?: React.CSSProperties;
};

// Text field types
export interface TextField extends BaseFieldSchema {
  type: "text" | "email" | "password" | "tel" | "url";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}
export interface TextAreaField extends BaseFieldSchema {
  type: "textarea";
  minLength?: number;
  maxLength?: number;
  pattern?: string;
}

// Number field
export interface NumberField extends BaseFieldSchema {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
}

// Date field
export interface DateField extends BaseFieldSchema {
  type: "date";
  min?: Date | string; // ISO date string
  max?: Date | string; // ISO date string
}

// Select field
export interface SelectField extends BaseFieldSchema {
  type: "select";
  options: Array<{ label: ReactNode; value: string | number; disabled?: boolean }>;
  multiple?: boolean;
}

// Radio field
export interface RadioField extends BaseFieldSchema {
  type: "radio";
  options: Array<{ label: string; value: string | number; disabled?: boolean }>;
  layout?: "horizontal" | "vertical";
}

// Checkbox field
export interface CheckboxField extends BaseFieldSchema {
  type: "checkbox";
  label: string;
}

export interface CheckboxGroupField extends BaseFieldSchema {
  type: "checkbox-group";
  label: string;
  layout?: "horizontal" | "vertical";
}

// Switch field
export interface SwitchField extends BaseFieldSchema {
  type: "switch";
  label: string;
}
export interface SwitchGroupField extends BaseFieldSchema {
  type: "switch-group";
  label: string;
  layout?: "horizontal" | "vertical";
}

// Object field (nested form)
export interface ObjectField extends BaseFieldSchema {
  type: "object";
  properties: Record<string, FormFieldSchema>;
}

// Array field (repeatable)
export interface ArrayField extends BaseFieldSchema {
  type: "array";
  itemField: FormFieldSchema;
  minItems?: number;
  maxItems?: number;
  addButtonText?: ReactNode;
  removeButtonText?: ReactNode;
}

// Custom field for extension
export interface CustomField extends BaseFieldSchema {
  type: "custom";
  render: (props: InputProps) => ReactNode;
}

// Union of all field types
export type FormFieldSchema =
  | TextField
  | TextAreaField
  | NumberField
  | DateField
  | SelectField
  | RadioField
  | CheckboxField
  | SwitchField
  | ObjectField
  | ArrayField
  | CustomField;

// Form schema type
export interface FormSchema {
  fields: FormFieldSchema[];
  onSubmit?: (data: Record<string, unknown>) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  showReset?: boolean;
  resetButtonText?: string;
  className?: string;
  id?: string;
}
