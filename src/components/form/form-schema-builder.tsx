// components/form-builder/FormSchemaBuilder.tsx

"use client";

import type { FormFieldSchema, FormSchema } from "@/components/form/types";
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
import { Switch } from "@/components/ui/switch";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Textarea } from "@/components/ui/textarea";
import { useState } from "react";
import { FormBuilder } from "./form-builder";

const FIELD_TYPES = [
  { label: "Text", value: "text" },
  { label: "Text Area", value: "textarea" },
  { label: "Email", value: "email" },
  { label: "Password", value: "password" },
  { label: "Number", value: "number" },
  { label: "Date", value: "date" },
  { label: "Select", value: "select" },
  { label: "Radio", value: "radio" },
  { label: "Checkbox", value: "checkbox" },
  { label: "Switch", value: "switch" },
];

const EmptyField: FormFieldSchema = {
  name: "",
  label: "",
  type: "text",
};

export const FormSchemaBuilder: React.FC = () => {
  const [formSchema, setFormSchema] = useState<FormSchema>({
    fields: [],
    submitButtonText: "Submit",
    showReset: true,
    resetButtonText: "Reset",
  });

  const [currentField, setCurrentField] = useState<FormFieldSchema>({ ...EmptyField });
  const [currentTab, setCurrentTab] = useState("builder");
  const [options, setOptions] = useState<string>("");
  const [schemaJson, setSchemaJson] = useState<string>("");

  const addField = () => {
    if (!currentField.name) return;

    // Process options for select and radio fields
    if ((currentField.type === "select" || currentField.type === "radio") && options) {
      const parsedOptions = options.split("\n").map((opt) => {
        const [label, value] = opt.split(":");
        return { label: label.trim(), value: value?.trim() || label.trim() };
      });

      setFormSchema((prev) => ({
        ...prev,
        fields: [
          ...prev.fields,
          {
            ...currentField,
            options: parsedOptions,
          },
        ],
      }));
    } else {
      setFormSchema((prev) => ({
        ...prev,
        fields: [...prev.fields, { ...currentField }],
      }));
    }

    // Reset current field
    setCurrentField({ ...EmptyField });
    setOptions("");
  };

  const removeField = (index: number) => {
    setFormSchema((prev) => ({
      ...prev,
      fields: prev.fields.filter((_, i) => i !== index),
    }));
  };

  const generateSchema = () => {
    setSchemaJson(JSON.stringify(formSchema, null, 2));
    setCurrentTab("preview");
  };

  const handleTypeChange = (type: string) => {
    setCurrentField((prev) =>
      // biome-ignore lint/suspicious/noExplicitAny: <explanation>
      ({ ...prev, type: type as any })
    );
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8 text-center">Form Schema Builder</h1>

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
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="fieldName">Field Name</Label>
                      <Input
                        id="fieldName"
                        value={currentField.name}
                        onChange={(e) =>
                          setCurrentField((prev) => ({ ...prev, name: e.target.value }))
                        }
                        placeholder="e.g. firstName"
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
                  </div>

                  <div>
                    <Label htmlFor="fieldLabel">Label</Label>
                    <Input
                      id="fieldLabel"
                      value={currentField.label?.toString()}
                      onChange={(e) =>
                        setCurrentField((prev) => ({ ...prev, label: e.target.value }))
                      }
                      placeholder="e.g. First Name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fieldPlaceholder">Placeholder</Label>
                    <Input
                      id="fieldPlaceholder"
                      value={currentField.placeholder}
                      onChange={(e) =>
                        setCurrentField((prev) => ({ ...prev, placeholder: e.target.value }))
                      }
                      placeholder="e.g. Enter your first name"
                    />
                  </div>

                  <div>
                    <Label htmlFor="fieldDescription">Description (Optional)</Label>
                    <Input
                      id="fieldDescription"
                      value={currentField.description}
                      onChange={(e) =>
                        setCurrentField((prev) => ({ ...prev, description: e.target.value }))
                      }
                      placeholder="e.g. This will be used for contact purposes"
                    />
                  </div>

                  {(currentField.type === "select" || currentField.type === "radio") && (
                    <div>
                      <Label htmlFor="fieldOptions">
                        Options (one per line, format: label:value)
                      </Label>
                      <Textarea
                        id="fieldOptions"
                        value={options}
                        onChange={(e) => setOptions(e.target.value)}
                        placeholder="Option 1:value1&#10;Option 2:value2"
                        rows={4}
                      />
                    </div>
                  )}

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="fieldRequired"
                      checked={currentField.required || false}
                      onCheckedChange={(checked) =>
                        setCurrentField((prev) => ({ ...prev, required: checked }))
                      }
                    />
                    <Label htmlFor="fieldRequired">Required</Label>
                  </div>

                  <Button onClick={addField} className="w-full">
                    Add Field
                  </Button>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Form Settings</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="submitButtonText">Submit Button Text</Label>
                    <Input
                      id="submitButtonText"
                      value={formSchema.submitButtonText}
                      onChange={(e) =>
                        setFormSchema((prev) => ({ ...prev, submitButtonText: e.target.value }))
                      }
                    />
                  </div>

                  <div className="flex items-center space-x-2">
                    <Switch
                      id="showReset"
                      checked={formSchema.showReset || false}
                      onCheckedChange={(checked) =>
                        setFormSchema((prev) => ({ ...prev, showReset: checked }))
                      }
                    />
                    <Label htmlFor="showReset">Show Reset Button</Label>
                  </div>

                  {formSchema.showReset && (
                    <div>
                      <Label htmlFor="resetButtonText">Reset Button Text</Label>
                      <Input
                        id="resetButtonText"
                        value={formSchema.resetButtonText}
                        onChange={(e) =>
                          setFormSchema((prev) => ({ ...prev, resetButtonText: e.target.value }))
                        }
                      />
                    </div>
                  )}

                  <div className="pt-4">
                    <Label>Current Fields</Label>
                    {formSchema.fields.length === 0 ? (
                      <p className="text-sm text-muted-foreground mt-2">No fields added yet</p>
                    ) : (
                      <ul className="mt-2 space-y-2">
                        {formSchema.fields.map((field, index) => (
                          <li
                            key={field.name}
                            className="flex justify-between items-center p-2 bg-muted rounded-md"
                          >
                            <span>
                              <strong>{field.label || field.name}</strong> ({field.type})
                            </span>
                            <Button variant="ghost" size="sm" onClick={() => removeField(index)}>
                              Remove
                            </Button>
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  <Button onClick={generateSchema} className="w-full mt-4">
                    Generate Form
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="preview">
          <Card>
            <CardHeader>
              <CardTitle>Form Preview</CardTitle>
            </CardHeader>
            <CardContent>
              {formSchema.fields.length > 0 ? (
                <FormBuilder
                  schema={formSchema}
                  onSubmit={(data) => console.log("Form data:", data)}
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
              <CardTitle>Form Schema Code</CardTitle>
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
};
