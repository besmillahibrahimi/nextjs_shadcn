import type { Operator } from "./constant";
import type { FilterSchema, FilterState, FilterValue } from "./types";

/**
 * Converts the filter state to a MongoDB-compatible query object
 */
export function toMongoQuery(filterState: FilterState): Record<string, unknown> {
  const query: Record<string, unknown> = {};

  for (const [field, { value, operator }] of Object.entries(filterState)) {
    // Skip empty values
    if (
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0) ||
      value === ""
    ) {
      continue;
    }

    // Process based on operator
    switch (operator) {
      case "$eq":
        query[field] = value;
        break;
      case "$ne":
      case "$gt":
      case "$gte":
      case "$lt":
      case "$lte":
        query[field] = { [operator]: value };
        break;
      case "$in":
      case "$nin":
        query[field] = { [operator]: Array.isArray(value) ? value : [value] };
        break;
      case "$exists":
        query[field] = { $exists: Boolean(value) };
        break;
      case "$regex":
        query[field] = { $regex: value, $options: "i" };
        break;
      case "$startsWith":
        query[field] = { $regex: `^${escapeRegex(value as string)}`, $options: "i" };
        break;
      case "$endsWith":
        query[field] = { $regex: `${escapeRegex(value as string)}$`, $options: "i" };
        break;
      case "$contains":
        query[field] = { $regex: escapeRegex(value as string), $options: "i" };
        break;
      default:
        // Fallback for unsupported operators
        query[field] = value;
    }
  }

  return query;
}

/**
 * Escape special regex characters
 */
function escapeRegex(str: string): string {
  return str.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/**
 * Validates a filter state against a schema
 */
export function validateFilterState(
  filterState: FilterState,
  schema: FilterSchema
): { isValid: boolean; errors: Record<string, string> } {
  const errors: Record<string, string> = {};

  for (const [fieldName, fieldDef] of Object.entries(schema)) {
    const filterItem = filterState[fieldName];

    // Skip if field is not required and has no value
    if (
      !fieldDef.required &&
      (!filterItem ||
        filterItem.value === undefined ||
        filterItem.value === null ||
        filterItem.value === "" ||
        (Array.isArray(filterItem.value) && filterItem.value.length === 0))
    ) {
      continue;
    }

    // Check if required field is present
    if (
      fieldDef.required &&
      (!filterItem ||
        filterItem.value === undefined ||
        filterItem.value === null ||
        filterItem.value === "" ||
        (Array.isArray(filterItem.value) && filterItem.value.length === 0))
    ) {
      errors[fieldName] = `${fieldDef.label} is required`;
      continue;
    }

    // Check if value matches validation rules
    if (fieldDef.validation) {
      const { min, max, pattern } = fieldDef.validation;

      if (typeof filterItem.value === "number") {
        if (min !== undefined && filterItem.value < min) {
          errors[fieldName] = `${fieldDef.label} must be at least ${min}`;
        }
        if (max !== undefined && filterItem.value > max) {
          errors[fieldName] = `${fieldDef.label} must be at most ${max}`;
        }
      } else if (typeof filterItem.value === "string" && pattern) {
        const regex = new RegExp(pattern);
        if (!regex.test(filterItem.value)) {
          errors[fieldName] = fieldDef.validation.errorMessage || `${fieldDef.label} is invalid`;
        }
      }
    }

    // Check if operator is valid for this field type
    if (
      fieldDef.availableOperators &&
      !fieldDef.availableOperators.includes(filterItem.operator as Operator)
    ) {
      errors[fieldName] = `Invalid operator for ${fieldDef.label}`;
    }
  }

  return {
    isValid: Object.keys(errors).length === 0,
    errors,
  };
}

/**
 * Serializes filter state to URL parameters
 */
export function filterStateToUrlParams(filterState: FilterState): URLSearchParams {
  const params = new URLSearchParams();

  for (const [field, { value, operator }] of Object.entries(filterState)) {
    // Skip empty values
    if (
      value === undefined ||
      value === null ||
      (Array.isArray(value) && value.length === 0) ||
      value === ""
    ) {
      continue;
    }

    // Add operator parameter
    params.append(`${field}_op`, operator);

    // Add value parameter(s)
    if (Array.isArray(value)) {
      for (const v of value) params.append(`${field}[]`, v.toString());
    } else if (value instanceof Date) {
      params.append(field, value.toISOString());
    } else {
      params.append(field, value.toString());
    }
  }

  return params;
}

/**
 * Parses URL parameters to filter state
 */
export function urlParamsToFilterState(params: URLSearchParams, schema: FilterSchema): FilterState {
  const filterState: FilterState = {};

  for (const [fieldName, fieldDef] of Object.entries(schema)) {
    const operator = params.get(`${fieldName}_op`) as Operator;

    if (!operator) {
      continue;
    }

    let value: FilterValue | null;

    // Handle array values
    if (params.getAll(`${fieldName}[]`).length > 0) {
      value = params.getAll(`${fieldName}[]`);

      // Convert to appropriate types
      if (fieldDef.type === "number") {
        value = value.map((v) => Number.parseFloat(v as string));
      }
    }
    // Handle single values
    else {
      value = params.get(fieldName);

      if (value !== null) {
        // Convert to appropriate types
        switch (fieldDef.type) {
          case "number":
            value = Number.parseFloat(value);
            break;
          case "boolean":
            value = value === "true";
            break;
          case "date":
          case "datetime":
            try {
              value = new Date(value).toISOString();
            } catch (e) {
              value = null;
            }
            break;
        }
      }
    }

    if (value !== null) {
      filterState[fieldName] = { value, operator };
    }
  }

  return filterState;
}
