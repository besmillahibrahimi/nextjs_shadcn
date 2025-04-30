"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  type ReactNode,
  useMemo,
  useCallback,
} from "react";
import type { FilterValue, FilterSchema, FilterState } from "./types";
import { FIELD_TYPE_OPERATORS, type Operator } from "./constant";

interface FilterContextProps {
  schema: FilterSchema;
  filters: FilterState;
  updateFilter: (field: string, value: FilterValue, operator: Operator) => void;
  resetFilters: () => void;
  getInitialFilterState: (schema: FilterSchema) => FilterState;
}

const FilterContext = createContext<FilterContextProps | undefined>(undefined);

interface FilterProviderProps {
  children: ReactNode;
  schema: FilterSchema;
  initialFilters?: FilterState;
  onChange?: (filters: FilterState) => void;
}

export function FilterProvider({
  children,
  schema,
  initialFilters,
  onChange,
}: Readonly<FilterProviderProps>) {
  // Create initial filter state from schema or use provided initialFilters
  const getInitialFilterState = useCallback((schema: FilterSchema): FilterState => {
    const initialState: FilterState = {};

    for (const [fieldName, fieldDef] of Object.entries(schema)) {
      initialState[fieldName] = {
        value:
          fieldDef.defaultValue !== undefined
            ? fieldDef.defaultValue
            : fieldDef.type === "multiselect"
              ? []
              : fieldDef.type === "boolean"
                ? false
                : fieldDef.type === "number"
                  ? 0
                  : "",
        operator: fieldDef.defaultOperator || FIELD_TYPE_OPERATORS[fieldDef.type][0],
      };
    }

    return initialState;
  }, []);

  const [filters, setFilters] = useState<FilterState>(
    initialFilters || getInitialFilterState(schema)
  );

  useEffect(() => {
    if (onChange) {
      onChange(filters);
    }
  }, [filters, onChange]);

  const updateFilter = useCallback((field: string, value: FilterValue, operator: Operator) => {
    setFilters((prev) => ({
      ...prev,
      [field]: {
        value,
        operator,
      },
    }));
  }, []);

  const resetFilters = useCallback(() => {
    setFilters(getInitialFilterState(schema));
  }, [getInitialFilterState, schema]);

  const value = useMemo(
    () => ({
      schema,
      filters,
      updateFilter,
      resetFilters,
      getInitialFilterState,
    }),
    [filters, resetFilters, getInitialFilterState, schema, updateFilter]
  );

  return <FilterContext.Provider value={value}>{children}</FilterContext.Provider>;
}

export function useFilter() {
  const context = useContext(FilterContext);
  if (context === undefined) {
    throw new Error("useFilter must be used within a FilterProvider");
  }
  return context;
}
