type ValidationRule = {
  type: "required" | "min" | "max" | "pattern" | "custom";
  message: string;
  value?: any;
  validator?: (value: any) => boolean;
};

type BaseFieldSchema = {
  name: string;
  label: string;
  description?: string;
  placeholder?: string;
  defaultValue?: any;
  disabled?: boolean;
  hidden?: boolean;
  validation?: ValidationRule[];
  className?: string;
  style?: React.CSSProperties;
  attributes?: Record<string, any>;
};

type TextFieldSchema = BaseFieldSchema & {
  type: "text" | "email" | "password" | "url" | "tel";
};

type NumberFieldSchema = BaseFieldSchema & {
  type: "number";
  min?: number;
  max?: number;
  step?: number;
};

type DateFieldSchema = BaseFieldSchema & {
  type: "date";
  min?: string;
  max?: string;
};

type SelectOption = {
  label: string;
  value: string | number;
  disabled?: boolean;
};

type SelectFieldSchema = BaseFieldSchema & {
  type: "select";
  options: SelectOption[];
  multiple?: boolean;
};

type RadioFieldSchema = BaseFieldSchema & {
  type: "radio";
  options: SelectOption[];
};

type CheckboxFieldSchema = BaseFieldSchema & {
  type: "checkbox";
  text?: string;
};

type ObjectFieldSchema = BaseFieldSchema & {
  type: "object";
  properties: FormFieldSchema[];
};

type ArrayFieldSchema = BaseFieldSchema & {
  type: "array";
  itemSchema: FormFieldSchema;
  minItems?: number;
  maxItems?: number;
};

type FormFieldSchema =
  | TextFieldSchema
  | NumberFieldSchema
  | DateFieldSchema
  | SelectFieldSchema
  | RadioFieldSchema
  | CheckboxFieldSchema
  | ObjectFieldSchema
  | ArrayFieldSchema;

type FormSchema = {
  title?: string;
  description?: string;
  fields: FormFieldSchema[];
  className?: string;
  style?: React.CSSProperties;
  onSubmit?: (values: Record<string, any>) => void;
};

// =================================================

// types/form-schema.ts

import { ReactNode } from "react";
import { z } from "zod";

// Base field interface that all field types will extend
export interface BaseFieldSchema {
  name: string;
  label?: string;
  description?: string;
  required?: boolean;
  disabled?: boolean;
  hidden?: boolean;
  className?: string;
  wrapperClassName?: string;
  labelClassName?: string;
  validation?: z.ZodTypeAny;
  defaultValue?: any;
  placeholder?: string;
}

// Text field types
export interface TextField extends BaseFieldSchema {
  type: "text" | "email" | "password" | "tel" | "url";
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
  min?: string; // ISO date string
  max?: string; // ISO date string
}

// Select field
export interface SelectField extends BaseFieldSchema {
  type: "select";
  options: Array<{ label: string; value: string | number; disabled?: boolean }>;
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

// Switch field
export interface SwitchField extends BaseFieldSchema {
  type: "switch";
  label: string;
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
  addButtonText?: string;
  removeButtonText?: string;
}

// Custom field for extension
export interface CustomField extends BaseFieldSchema {
  type: "custom";
  render: (props: any) => ReactNode;
}

// Union of all field types
export type FormFieldSchema =
  | TextField
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
  onSubmit?: (data: any) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  showReset?: boolean;
  resetButtonText?: string;
  className?: string;
  id?: string;
}
