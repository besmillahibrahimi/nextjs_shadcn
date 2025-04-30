"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import { FilterField } from "./filter-field";
import { FilterProvider, useFilter } from "./filter-provider";
import type { FilterBuilderProps, FilterState } from "./types";

export function FilterBuilder({
  schema,
  initialValues,
  onFilterChange,
  onSubmit,
  className = "",
  showSubmitButton = true,
  submitButtonText = "Apply Filters",
  showResetButton = true,
  resetButtonText = "Reset",
  layout = "grid",
  gridColumns = 3,
}: Readonly<FilterBuilderProps>) {
  const [currentFilters, setCurrentFilters] = useState<FilterState>(initialValues || {});

  const handleFilterChange = (filters: FilterState) => {
    setCurrentFilters(filters);
    if (onFilterChange) {
      onFilterChange(filters);
    }
  };

  const handleSubmit = () => {
    if (onSubmit) {
      onSubmit(currentFilters);
    }
  };

  // Layout class based on the layout prop
  const layoutClass =
    layout === "vertical"
      ? "flex flex-col space-y-4"
      : layout === "horizontal"
        ? "flex flex-wrap gap-4"
        : `grid grid-cols-1 md:grid-cols-2 lg:grid-cols-${gridColumns} gap-4`;

  return (
    <FilterProvider schema={schema} initialFilters={initialValues} onChange={handleFilterChange}>
      <Card className={`${className} p-4`}>
        <CardContent>
          <div className={layoutClass}>
            {Object.entries(schema).map(([fieldName, fieldDef]) => (
              <FilterField
                key={fieldName}
                name={fieldName}
                definition={fieldDef}
                value={currentFilters[fieldName]?.value}
                operator={currentFilters[fieldName]?.operator}
              />
            ))}
          </div>

          {(showSubmitButton || showResetButton) && (
            <div className="flex justify-end mt-6 space-x-2">
              {showResetButton && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => {
                    const filter = useFilter();
                    filter.resetFilters();
                  }}
                >
                  {resetButtonText}
                </Button>
              )}

              {showSubmitButton && (
                <Button type="button" onClick={handleSubmit}>
                  {submitButtonText}
                </Button>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </FilterProvider>
  );
}
