// components/form-builder/FormBuilder.tsx

import { useForm, FormProvider, useFieldArray, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Switch } from "@/components/ui/switch";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { format } from "date-fns";
import { cn } from "@/lib/utils";
import { CalendarIcon, Plus, Trash2 } from "lucide-react";
import {
  FormField,
  FormItem,
  FormLabel,
  FormControl,
  FormDescription,
  FormMessage,
} from "@/components/ui/form";
import type { FormSchema, FormFieldSchema } from "@/components/form/types";
import { buildZodSchema, generateDefaultValues } from "./utils";

// Field renderer component
const FieldRenderer: React.FC<{
  field: FormFieldSchema;
  form: any;
  parentPath?: string;
}> = ({ field, form, parentPath = "" }) => {
  const fieldName = parentPath ? `${parentPath}.${field.name}` : field.name;

  switch (field.type) {
    case "text":
    case "email":
    case "password":
    case "tel":
    case "url":
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field: formField }) => (
            <FormItem className={field.wrapperClassName}>
              {field.label && <FormLabel className={field.labelClassName}>{field.label}</FormLabel>}
              <FormControl>
                <Input
                  {...formField}
                  type={field.type}
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  className={field.className}
                />
              </FormControl>
              {field.description && <FormDescription>{field.description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "number":
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field: formField }) => (
            <FormItem className={field.wrapperClassName}>
              {field.label && <FormLabel className={field.labelClassName}>{field.label}</FormLabel>}
              <FormControl>
                <Input
                  {...formField}
                  type="number"
                  placeholder={field.placeholder}
                  disabled={field.disabled}
                  min={field.min}
                  max={field.max}
                  step={field.step}
                  className={field.className}
                  onChange={(e) => formField.onChange(Number(e.target.value))}
                />
              </FormControl>
              {field.description && <FormDescription>{field.description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "date":
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field: formField }) => (
            <FormItem className={field.wrapperClassName}>
              {field.label && <FormLabel className={field.labelClassName}>{field.label}</FormLabel>}
              <Popover>
                <PopoverTrigger asChild>
                  <FormControl>
                    <Button
                      variant={"outline"}
                      className={cn(
                        "w-full pl-3 text-left font-normal",
                        !formField.value && "text-muted-foreground",
                        field.className
                      )}
                      disabled={field.disabled}
                    >
                      {formField.value ? (
                        format(formField.value, "PPP")
                      ) : (
                        <span>{field.placeholder || "Pick a date"}</span>
                      )}
                      <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                    </Button>
                  </FormControl>
                </PopoverTrigger>
                <PopoverContent className="w-auto p-0" align="start">
                  <Calendar
                    mode="single"
                    selected={formField.value}
                    onSelect={formField.onChange}
                    disabled={(date) => {
                      if (field.min && new Date(date) < new Date(field.min)) return true;
                      if (field.max && new Date(date) > new Date(field.max)) return true;
                      return false;
                    }}
                  />
                </PopoverContent>
              </Popover>
              {field.description && <FormDescription>{field.description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "select":
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field: formField }) => (
            <FormItem className={field.wrapperClassName}>
              {field.label && <FormLabel className={field.labelClassName}>{field.label}</FormLabel>}
              <Select
                onValueChange={formField.onChange}
                defaultValue={formField.value}
                disabled={field.disabled}
              >
                <FormControl>
                  <SelectTrigger className={field.className}>
                    <SelectValue placeholder={field.placeholder || "Select an option"} />
                  </SelectTrigger>
                </FormControl>
                <SelectContent>
                  {field.options.map((option) => (
                    <SelectItem
                      key={String(option.value)}
                      value={String(option.value)}
                      disabled={option.disabled}
                    >
                      {option.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {field.description && <FormDescription>{field.description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "radio":
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field: formField }) => (
            <FormItem className={field.wrapperClassName}>
              {field.label && <FormLabel className={field.labelClassName}>{field.label}</FormLabel>}
              <FormControl>
                <RadioGroup
                  onValueChange={formField.onChange}
                  value={formField.value}
                  className={cn(
                    field.layout === "horizontal"
                      ? "flex flex-row space-x-2"
                      : "flex flex-col space-y-2",
                    field.className
                  )}
                  disabled={field.disabled}
                >
                  {field.options.map((option) => (
                    <div key={String(option.value)} className="flex items-center space-x-2">
                      <RadioGroupItem
                        value={String(option.value)}
                        id={`${fieldName}-${option.value}`}
                        disabled={option.disabled}
                      />
                      <label htmlFor={`${fieldName}-${option.value}`}>{option.label}</label>
                    </div>
                  ))}
                </RadioGroup>
              </FormControl>
              {field.description && <FormDescription>{field.description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "checkbox":
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field: formField }) => (
            <FormItem
              className={cn(
                "flex flex-row items-start space-x-3 space-y-0",
                field.wrapperClassName
              )}
            >
              <FormControl>
                <Checkbox
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                  disabled={field.disabled}
                  className={field.className}
                />
              </FormControl>
              {field.label && (
                <div className="space-y-1 leading-none">
                  <FormLabel className={field.labelClassName}>{field.label}</FormLabel>
                  {field.description && <FormDescription>{field.description}</FormDescription>}
                </div>
              )}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "switch":
      return (
        <FormField
          control={form.control}
          name={fieldName}
          render={({ field: formField }) => (
            <FormItem
              className={cn(
                "flex flex-row items-center justify-between space-y-0",
                field.wrapperClassName
              )}
            >
              {field.label && <FormLabel className={field.labelClassName}>{field.label}</FormLabel>}
              <FormControl>
                <Switch
                  checked={formField.value}
                  onCheckedChange={formField.onChange}
                  disabled={field.disabled}
                  className={field.className}
                />
              </FormControl>
              {field.description && <FormDescription>{field.description}</FormDescription>}
              <FormMessage />
            </FormItem>
          )}
        />
      );

    case "object":
      return (
        <div className={cn("space-y-4", field.wrapperClassName)}>
          {field.label && (
            <h3 className={cn("text-lg font-medium", field.labelClassName)}>{field.label}</h3>
          )}
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
          <div className="space-y-4 border p-4 rounded-md">
            {Object.entries(field.properties).map(([key, nestedField]) => (
              <FieldRenderer
                key={key}
                field={{ ...nestedField, name: key }}
                form={form}
                parentPath={fieldName}
              />
            ))}
          </div>
        </div>
      );

    case "array":
      return (
        <div className={cn("space-y-4", field.wrapperClassName)}>
          {field.label && (
            <h3 className={cn("text-lg font-medium", field.labelClassName)}>{field.label}</h3>
          )}
          {field.description && (
            <p className="text-sm text-muted-foreground">{field.description}</p>
          )}
          <Controller
            control={form.control}
            name={fieldName}
            render={({ field: formField }) => {
              const { fields, append, remove } = useFieldArray({
                name: fieldName,
                control: form.control,
              });

              return (
                <div className="space-y-4">
                  {fields.map((item, index) => (
                    <div key={item.id} className="relative border p-4 rounded-md">
                      <Button
                        type="button"
                        variant="ghost"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={() => remove(index)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                      <FieldRenderer
                        field={{ ...field.itemField, name: `${index}` }}
                        form={form}
                        parentPath={fieldName}
                      />
                    </div>
                  ))}
                  {(!field.maxItems || fields.length < field.maxItems) && (
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="mt-2"
                      onClick={() => {
                        append(field.itemField.defaultValue || "");
                      }}
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      {field.addButtonText || "Add Item"}
                    </Button>
                  )}
                </div>
              );
            }}
          />
        </div>
      );

    case "custom":
      return (
        <Controller
          control={form.control}
          name={fieldName}
          render={({ field: formField }) => (
            <div className={field.wrapperClassName}>
              {field.label && <FormLabel className={field.labelClassName}>{field.label}</FormLabel>}
              {field.render({
                ...formField,
                disabled: field.disabled,
              })}
              {field.description && <FormDescription>{field.description}</FormDescription>}
            </div>
          )}
        />
      );

    default:
      return null;
  }
};

export interface FormBuilderProps {
  schema: FormSchema;
  onSubmit?: (data: any) => void;
  onCancel?: () => void;
}

export const FormBuilder: React.FC<FormBuilderProps> = ({ schema, onSubmit, onCancel }) => {
  const zodSchema = buildZodSchema(schema);
  const defaultValues = generateDefaultValues(schema);

  const form = useForm({
    resolver: zodResolver(zodSchema),
    defaultValues,
    mode: "onBlur",
  });

  const handleSubmit = (data: any) => {
    if (schema.onSubmit) {
      schema.onSubmit(data);
    }

    if (onSubmit) {
      onSubmit(data);
    }
  };

  return (
    <FormProvider {...form}>
      <form
        onSubmit={form.handleSubmit(handleSubmit)}
        className={cn("space-y-6", schema.className)}
        id={schema.id}
      >
        {schema.fields
          .filter((field) => !field.hidden)
          .map((field) => (
            <FieldRenderer key={field.name} field={field} form={form} />
          ))}

        <div className="flex justify-end space-x-2">
          {schema.showReset && (
            <Button type="button" variant="outline" onClick={() => form.reset()}>
              {schema.resetButtonText ?? "Reset"}
            </Button>
          )}

          {onCancel && (
            <Button type="button" variant="outline" onClick={onCancel}>
              {schema.cancelButtonText ?? "Cancel"}
            </Button>
          )}

          <Button type="submit">{schema.submitButtonText ?? "Submit"}</Button>
        </div>
      </form>
    </FormProvider>
  );
};
