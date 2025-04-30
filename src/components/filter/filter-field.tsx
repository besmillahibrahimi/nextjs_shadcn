"use client";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Switch } from "@/components/ui/switch";
import { format } from "date-fns";
import { CalendarIcon } from "lucide-react";
import { FIELD_TYPE_OPERATORS, OPERATOR_LABELS, type Operator } from "./constant";
import { useFilter } from "./filter-provider";
import type { FilterFieldProps, FilterValue, OperatorOption } from "./types";

export function FilterField({ name, definition, value, operator }: Readonly<FilterFieldProps>) {
  const { updateFilter } = useFilter();

  // Get available operators for this field type
  const availableOperators: OperatorOption[] = (
    definition.availableOperators ||
    FIELD_TYPE_OPERATORS[definition.type] ||
    []
  ).map((op) => ({ value: op, label: OPERATOR_LABELS[op] }));

  // Handle change for the field value
  const handleValueChange = (newValue: FilterValue) => {
    updateFilter(name, newValue, operator);
  };

  // Handle change for the operator
  const handleOperatorChange = (newOperator: Operator) => {
    updateFilter(name, value, newOperator);
  };

  // Render field based on type
  const renderFieldInput = () => {
    switch (definition.type) {
      case "text":
        return (
          <Input
            type="text"
            placeholder={definition.placeholder || `Enter ${definition.label}`}
            value={(value as string) || ""}
            onChange={(e) => handleValueChange(e.target.value)}
            className="mt-1"
          />
        );

      case "number":
        return (
          <Input
            type="number"
            placeholder={definition.placeholder || `Enter ${definition.label}`}
            value={(value as number) || 0}
            onChange={(e) => handleValueChange(Number.parseFloat(e.target.value))}
            min={definition.validation?.min}
            max={definition.validation?.max}
            className="mt-1"
          />
        );

      case "date":
        return (
          <div className="flex w-full max-w-sm items-center space-x-2">
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal mt-1"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {value ? format(new Date(value as string), "PPP") : <span>Pick a date</span>}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={value ? new Date(value as string) : undefined}
                  onSelect={(date) => handleValueChange(date ? date.toISOString() : null)}
                />
              </PopoverContent>
            </Popover>
          </div>
        );

      case "checkbox":
        return (
          <div className="mt-2">
            <Checkbox checked={(value as boolean) || false} onCheckedChange={handleValueChange} />
          </div>
        );

      case "boolean":
        return (
          <div className="flex items-center space-x-2 mt-2">
            <Switch checked={(value as boolean) || false} onCheckedChange={handleValueChange} />
            <span>{value ? "Yes" : "No"}</span>
          </div>
        );

      case "select":
        return (
          <Select value={value as string} onValueChange={handleValueChange}>
            <SelectTrigger className="mt-1">
              <SelectValue placeholder={definition.placeholder || `Select ${definition.label}`} />
            </SelectTrigger>
            <SelectContent>
              {definition.options?.map((option) => (
                <SelectItem key={option.value.toString()} value={option.value.toString()}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        );

      case "multiselect":
        // In a more complete implementation, we'd use a multiselect component
        // For now, we'll use a simplified version
        return (
          <div className="mt-2 space-y-2">
            {definition.options?.map((option) => (
              <div key={option.value.toString()} className="flex items-center space-x-2">
                <Checkbox
                  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                  checked={(value as any[])?.includes(option.value)}
                  onCheckedChange={(checked) => {
                    // biome-ignore lint/suspicious/noExplicitAny: <explanation>
                    const currentValues = [...((value as any[]) || [])];
                    if (checked) {
                      if (!currentValues.includes(option.value)) {
                        currentValues.push(option.value);
                      }
                    } else {
                      const index = currentValues.indexOf(option.value);
                      if (index !== -1) {
                        currentValues.splice(index, 1);
                      }
                    }
                    handleValueChange(currentValues);
                  }}
                />
                <span>{option.label}</span>
              </div>
            ))}
          </div>
        );

      case "radio":
        return (
          <RadioGroup value={value as string} onValueChange={handleValueChange} className="mt-2">
            {definition.options?.map((option) => (
              <div key={option.value.toString()} className="flex items-center space-x-2">
                <RadioGroupItem value={option.value.toString()} id={`${name}-${option.value}`} />
                <Label htmlFor={`${name}-${option.value}`}>{option.label}</Label>
              </div>
            ))}
          </RadioGroup>
        );

      default:
        return <div>Unsupported field type: {definition.type}</div>;
    }
  };

  return (
    <div className={`filter-field ${definition.className || ""}`}>
      <div className="mb-1">
        <Label>{definition.label}</Label>
      </div>
      {/* Field input based on type */}
      {renderFieldInput()}
    </div>
  );
}
