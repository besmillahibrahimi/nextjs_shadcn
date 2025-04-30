"use client";

import { FilterBuilder } from "@/components/filter/filter-builder";
import type { FilterSchema, FieldDefinition } from "@/components/filter/types";
import type { FieldType, Operator } from "@/components/filter/constant";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useState } from "react";

const FIELD_TYPES: { label: string; value: FieldType }[] = [
  { label: "Text", value: "text" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Select", value: "select" },
  { label: "Multiselect", value: "multiselect" },
  { label: "Boolean", value: "boolean" },
];

const EmptyField: Partial<FieldDefinition> = {
  type: "text",
  label: "",
  defaultOperator: "$eq" as Operator,
};

export default function FilterBuilderPage() {
  const [filterSchema, setFilterSchema] = useState<FilterSchema>({});
  const [currentField, setCurrentField] = useState<Partial<FieldDefinition>>({ ...EmptyField });
  const [currentTab, setCurrentTab] = useState("builder");
  const [options, setOptions] = useState<string>("");
  const [schemaJson, setSchemaJson] = useState<string>("");

  const addField = () => {
    if (!currentField.label || !currentField.type) return;

    const fieldLabel = currentField.label;
    const newField: FieldDefinition = {
      type: currentField.type,
      label: fieldLabel,
      placeholder: currentField.placeholder,
      defaultOperator: currentField.defaultOperator || "$eq",
    };

    // Process options for select and multiselect fields
    if ((currentField.type === "select" || currentField.type === "multiselect") && options) {
      const parsedOptions = options.split("\n").map((opt) => {
        const [label, value] = opt.split(":");
        return { label: label.trim(), value: value?.trim() || label.trim() };
      });
      newField.options = parsedOptions;
    }

    setFilterSchema((prev) => ({
      ...prev,
      [fieldLabel]: newField,
    }));

    // Reset current field
    setCurrentField({ ...EmptyField });
    setOptions("");
  };

  const removeField = (fieldName: string) => {
    setFilterSchema((prev) => {
      const newSchema = { ...prev };
      delete newSchema[fieldName];
      return newSchema;
    });
  };

  const generateSchema = () => {
    setSchemaJson(JSON.stringify(filterSchema, null, 2));
    setCurrentTab("preview");
  };

  const handleTypeChange = (type: FieldType) => {
    setCurrentField((prev) => ({ ...prev, type }));
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Filter Schema Builder</h1>

      <Tabs value={currentTab} onValueChange={setCurrentTab}>
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="builder">Builder</TabsTrigger>
          <TabsTrigger value="preview">Preview</TabsTrigger>
          <TabsTrigger value="code">Schema Code</TabsTrigger>
        </TabsList>

        <TabsContent value="builder">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Add Field</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="fieldLabel">Field Label</Label>
                    <Input
                      id="fieldLabel"
                      value={currentField.label}
                      onChange={(e) =>
                        setCurrentField((prev) => ({ ...prev, label: e.target.value }))
                      }
                      placeholder="e.g. Name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fieldType">Field Type</Label>
                    <Select value={currentField.type} onValueChange={handleTypeChange}>
                      <SelectTrigger>
                        <SelectValue placeholder="Select field type" />
                      </SelectTrigger>
                      <SelectContent>
                        {FIELD_TYPES.map((type) => (
                          <SelectItem key={type.value} value={type.value}>
                            {type.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="fieldPlaceholder">Placeholder</Label>
                    <Input
                      id="fieldPlaceholder"
                      value={currentField.placeholder}
                      onChange={(e) =>
                        setCurrentField((prev) => ({ ...prev, placeholder: e.target.value }))
                      }
                      placeholder="e.g. Enter name"
                    />
                  </div>

                  {(currentField.type === "select" || currentField.type === "multiselect") && (
                    <div>
                      <Label htmlFor="fieldOptions">
                        Options (one per line, format: label:value)
                      </Label>
                      <textarea
                        id="fieldOptions"
                        value={options}
                        onChange={(e) => setOptions(e.target.value)}
                        placeholder="Option 1:value1&#10;Option 2:value2"
                        rows={4}
                        className="w-full p-2 border rounded-md"
                      />
                    </div>
                  )}

                  <Button onClick={addField} className="w-full">
                    Add Field
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Current Fields</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {Object.keys(filterSchema).length === 0 ? (
                    <p className="text-sm text-muted-foreground">No fields added yet</p>
                  ) : (
                    <ul className="space-y-2">
                      {Object.entries(filterSchema).map(([fieldName, field]) => (
                        <li
                          key={fieldName}
                          className="flex justify-between items-center p-2 bg-muted rounded-md"
                        >
                          <span>
                            <strong>{field.label}</strong> ({field.type})
                          </span>
                          <Button variant="ghost" size="sm" onClick={() => removeField(fieldName)}>
                            Remove
                          </Button>
                        </li>
                      ))}
                    </ul>
                  )}

                  <Button onClick={generateSchema} className="w-full mt-4">
                    Generate Filter
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Filter Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {Object.keys(filterSchema).length > 0 ? (
                <FilterBuilder
                  schema={filterSchema}
                  onSubmit={(filters) => console.log("Filters:", filters)}
                />
              ) : (
                <p className="text-center py-8 text-muted-foreground">
                  Add fields to see a preview
                </p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="code">
          <Card>
            <CardHeader>
              <CardTitle>Filter Schema Code</CardTitle>
            </CardHeader>
            <CardContent>
              <pre className="bg-muted p-4 rounded-md overflow-auto">
                <code>{schemaJson}</code>
              </pre>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => navigator.clipboard.writeText(schemaJson)}
              >
                Copy to Clipboard
              </Button>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
