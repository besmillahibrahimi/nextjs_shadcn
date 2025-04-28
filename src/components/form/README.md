# Dynamic Form Builder for Next.js

A flexible, schema-driven form builder for Next.js applications. This library allows developers to create complex forms with validation using a simple schema definition.

## Features

- **Schema-driven**: Define forms using a JSON schema
- **Flexible validation**: Supports complex validation rules using Zod
- **Multiple field types**: Text, Email, Password, Number, Date, Select, Radio, Checkbox, Switch, and more
- **Nested fields**: Support for object and array fields
- **Styling**: Works with Tailwind CSS and shadcn/ui components
- **Customizable**: Easily extend with custom field types
- **Form state management**: Built-in form state management using react-hook-form

## Installation

```bash
npm install next-dynamic-form-builder
# or
yarn add next-dynamic-form-builder
```

## Basic Usage

```tsx
import { FormBuilder } from '@/components/form-builder/FormBuilder';
import { FormSchema } from '@/types/form-schema';
import { z } from 'zod';

// Define your form schema
const myFormSchema: FormSchema = {
  fields: [
    {
      name: 'name',
      label: 'Full Name',
      type: 'text',
      required: true,
      validation: z.string().min(2, 'Name must be at least 2 characters'),
      placeholder: 'Enter your name',
    },
    {
      name: 'email',
      label: 'Email Address',
      type: 'email',
      required: true,
      placeholder: 'email@example.com',
    },
    // Add more fields...
  ],
  submitButtonText: 'Submit',
  showReset: true,
};

// Use the form builder in your component
export default function MyForm() {
  const handleSubmit = (data: any) => {
    console.log('Form data:', data);
    // Handle form submission
  };

  return (
    <div className="container mx-auto py-8">
      <h1 className="text-3xl font-bold mb-8">My Form</h1>
      <FormBuilder schema={myFormSchema} onSubmit={handleSubmit} />
    </div>
  );
}
```

## Schema Definition

### Form Schema

The `FormSchema` interface defines the structure of your form:

```typescript
interface FormSchema {
  fields: FormFieldSchema[];
  onSubmit?: (data: any) => void;
  submitButtonText?: string;
  cancelButtonText?: string;
  showReset?: boolean;
  resetButtonText?: string;
  className?: string;
  id?: string;
}
```

### Field Types

The library supports various field types, each with their own configuration options:

1. **Text Fields**: text, email, password, tel, url
2. **Number Fields**: number
3. **Date Fields**: date
4. **Select Fields**: select (dropdown)
5. **Radio Fields**: radio buttons
6. **Checkbox Fields**: single checkbox
7. **Switch Fields**: toggle switch
8. **Object Fields**: nested form
9. **Array Fields**: list of items
10. **Custom Fields**: custom rendering

### Field Properties

All field types extend the `BaseFieldSchema`:

```typescript
interface BaseFieldSchema {
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
```

## Advanced Usage

### Validation

You can define validation rules using Zod:

```typescript
// Field with validation
{
  name: 'password',
  label: 'Password',
  type: 'password',
  required: true,
  validation: z.string()
    .min(8, 'Password must be at least 8 characters')
    .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
    .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
    .regex(/[0-9]/, 'Password must contain at least one number'),
  placeholder: 'Enter your password',
}

// Or use the validation factory
import { createValidation } from '@/lib/validation-factory';

const passwordValidation = createValidation('password', [
  { type: 'required', message: 'Password is required' },
  { type: 'minLength', value: 8, message: 'Password must be at least 8 characters' },
  { type: 'pattern', value: /[A-Z]/, message: 'Password must contain at least one uppercase letter' },
  { type: 'pattern', value: /[a-z]/, message: 'Password must contain at least one lowercase letter' },
  { type: 'pattern', value: /[0-9]/, message: 'Password must contain at least one number' },
]);
```

### Nested Objects

You can create nested forms using the `object` field type:

```typescript
{
  name: 'address',
  label: 'Address',
  type: 'object',
  properties: {
    street: {
      name: 'street',
      label: 'Street Address',
      type: 'text',
      required: true,
    },
    city: {
      name: 'city',
      label: 'City',
      type: 'text',
      required: true,
    },
    // Add more nested fields...
  }
}
```

### Array Fields

Create repeatable sections using the `array` field type:

```typescript
{
  name: 'phoneNumbers',
  label: 'Phone Numbers',
  type: 'array',
  itemField: {
    name: 'phoneNumber',
    label: 'Phone Number',
    type: 'tel',
    required: true,
  },
  addButtonText: 'Add Phone Number',
  minItems: 1,
  maxItems: 5,
}
```

### Custom Fields

You can create custom field renderers:

```typescript
{
  name: 'richText',
  label: 'Description',
  type: 'custom',
  render: ({ value, onChange }) => (
    <div>
      <MyRichTextEditor value={value} onChange={onChange} />
    </div>
  ),
}
```

## Form Schema Builder

The package also includes a visual form schema builder that lets you create forms without writing code:

```tsx
import { FormSchemaBuilder } from '@/components/form-builder/FormSchemaBuilder';

export default function SchemaBuilderPage() {
  return (
    <div className="container mx-auto py-8">
      <FormSchemaBuilder />
    </div>
  );
}
```

## Dependencies

- React
- Next.js
- react-hook-form
- zod
- @hookform/resolvers/zod
- Tailwind CSS
- shadcn/ui components

## License

MIT