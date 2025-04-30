// types.ts - Core filter types and interfaces

import type { FieldType, Operator } from "./constant";

// Supported value types
export type FilterValue =
  | string
  | number
  | boolean
  | Date
  | Array<string | number | boolean>
  | null;

// Generic filter item
export interface FilterItem {
  value: FilterValue;
  operator: Operator;
}

// The complete filter state object
export type FilterState = Record<string, FilterItem>;

// Field definition for the schema
export interface FieldDefinition {
  type: FieldType;
  label: string;
  placeholder?: string;
  defaultValue?: FilterValue;
  defaultOperator?: Operator;
  options?: { label: string; value: string | number | boolean }[];
  availableOperators?: Operator[];
  required?: boolean;
  className?: string;
  validation?: {
    min?: number;
    max?: number;
    pattern?: string;
    errorMessage?: string;
  };
}

// The complete filter schema
export type FilterSchema = Record<string, FieldDefinition>;

// Props for the FilterBuilder component
export interface FilterBuilderProps {
  schema: FilterSchema;
  initialValues?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  onSubmit?: (filters: FilterState) => void;
  className?: string;
  showSubmitButton?: boolean;
  submitButtonText?: string;
  showResetButton?: boolean;
  resetButtonText?: string;
  layout?: "vertical" | "horizontal" | "grid";
  gridColumns?: number;
}

// Props for individual filter field components
export interface FilterFieldProps {
  name: string;
  definition: FieldDefinition;
  value: FilterValue;
  operator: Operator;
  onChange?: (name: string, value: FilterValue, operator: Operator) => void;
}

// Helper type for operator options
export interface OperatorOption {
  value: Operator;
  label: string;
}
