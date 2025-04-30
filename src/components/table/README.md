# Dynamic Table Component for Next.js

A flexible and powerful dynamic table component for Next.js applications using Tailwind CSS and shadcn/ui. This component allows developers to create customizable tables with advanced features based on a schema definition.

## Features

- **Schema-driven**: Define columns with access paths, custom rendering, and sorting
- **Sorting**: Enable/disable sorting globally or per column with custom sort functions
- **Filtering**: Global search and column-specific filtering
- **Pagination**: Client-side or server-side pagination with customizable page size
- **Row Selection & Click Handling**: Select rows or handle row clicks with callbacks
- **Custom Cell Rendering**: Render custom components for each cell
- **Responsive Design**: Built with Tailwind CSS for a responsive layout
- **Accessibility**: Built with proper HTML semantics and keyboard navigation
- **TypeScript Support**: Fully typed for better developer experience

## Installation

First, make sure you have the required dependencies:

```bash
npm install @/components/ui
```

Ensure you have set up [shadcn/ui](https://ui.shadcn.com/) components in your Next.js project.

## Basic Usage

```tsx
import { DynamicTable, ColumnDef } from '@/components/DynamicTable/DynamicTable';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

const users = [
  { id: '1', name: 'John Doe', email: 'john@example.com', role: 'Admin' },
  { id: '2', name: 'Jane Smith', email: 'jane@example.com', role: 'User' },
];

const columns: ColumnDef<User>[] = [
  {
    id: 'name',
    header: 'Name',
    accessorKey: 'name',
  },
  {
    id: 'email',
    header: 'Email',
    accessorKey: 'email',
  },
  {
    id: 'role',
    header: 'Role',
    accessorKey: 'role',
  },
];

function UsersTable() {
  return (
    <DynamicTable
      data={users}
      columns={columns}
    />
  );
}
```

## API Reference

### DynamicTable Props

| Prop | Type | Default | Description |
|------|------|---------|-------------|
| `data` | `T[]` | - | The data to display in the table |
| `columns` | `ColumnDef<T>[]` | - | The columns definition |
| `enablePagination` | `boolean` | `true` | Whether to enable pagination |
| `pageSize` | `number` | `10` | Number of rows per page |
| `enableRowSelection` | `boolean` | `false` | Whether to enable row selection |
| `onRowClick` | `(row: T) => void` | - | Callback when a row is clicked |
| `enableFiltering` | `boolean` | `true` | Whether to enable filtering |
| `enableGlobalFilter` | `boolean` | `true` | Whether to enable global search |
| `className` | `string` | `''` | Additional CSS classes |
| `noDataMessage` | `string` | `'No data available'` | Message to display when there's no data |
| `enableSorting` | `boolean` | `true` | Whether to enable sorting |
| `initialSortColumn` | `string` | - | Initial column to sort by |
| `initialSortDirection` | `'asc' \| 'desc' \| null` | `null` | Initial sort direction |
| `onPageChange` | `(page: number) => void` | - | Callback when page changes |
| `onSortChange` | `(columnId: string, direction: SortDirection) => void` | - | Callback when sort changes |
| `manualPagination` | `boolean` | `false` | Whether pagination is handled externally |
| `manualSorting` | `boolean` | `false` | Whether sorting is handled externally |
| `totalItems` | `number` | - | Total number of items (for manual pagination) |

### ColumnDef Properties

| Property | Type | Description |
|----------|------|-------------|
| `id` | `string` | Unique identifier for the column |
| `header` | `string` | Column header text |
| `accessorKey` | `keyof T` | Key to access the data |
| `accessorFn` | `(row: T) => any` | Function to access the data |
| `cell` | `(props: { row: T; value: any }) => React.ReactNode` | Custom cell renderer |
| `enableSorting` | `boolean` | Whether this column can be sorted |
| `sortFn` | `(a: T, b: T, direction: SortDirection) => number` | Custom sort function |
| `minWidth` | `number` | Minimum width of the column |
| `maxWidth` | `number` | Maximum width of the column |
| `enableFilter` | `boolean` | Whether this column can be filtered |
| `filterFn` | `(row: T, filterValue: string) => boolean` | Custom filter function |

## Advanced Examples

### Custom Cell Rendering

```tsx
const columns: ColumnDef<User>[] = [
  // ... other columns
  {
    id: 'status',
    header: 'Status',
    accessorKey: 'status',
    cell: ({ value }) => (
      <Badge className={value === 'active' ? 'bg-green-100' : 'bg-red-100'}>
        {value}
      </Badge>
    ),
  },
];
```

### Custom Sorting

```tsx
const columns: ColumnDef<User>[] = [
  // ... other columns
  {
    id: 'role',
    header: 'Role',
    accessorKey: 'role',
    sortFn: (a, b, direction) => {
      const order = { Admin: 1, Editor: 2, User: 3 };
      const aValue = order[a.role as keyof typeof order] || 999;
      const bValue = order[b.role as keyof typeof order] || 999;
      return direction === 'asc' 
        ? aValue - bValue 
        : bValue - aValue;
    },
  },
];
```

### Server-side Pagination & Sorting

```tsx
function ServerSideTable() {
  const [data, setData] = useState<User[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string>('name');
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc');
  
  useEffect(() => {
    // Fetch data from API
    fetchData(currentPage, sortColumn, sortDirection);
  }, [currentPage, sortColumn, sortDirection]);
  
  const fetchData = async (page: number, column?: string, direction?: SortDirection) => {
    const response = await api.fetchUsers({
      page,
      sort: column,
      order: direction,
      limit: 10
    });
    setData(response.data);
  };
  
  return (
    <DynamicTable
      data={data}
      columns={columns}
      enablePagination={true}
      pageSize={10}
      onPageChange={(page) => setCurrentPage(page)}
      onSortChange={(columnId, direction) => {
        setSortColumn(columnId);
        setSortDirection(direction);
      }}
      manualPagination={true}
      manualSorting={true}
      totalItems={100} // Total count from API
    />
  );
}
```

## Testing

The DynamicTable component comes with comprehensive tests. To run the tests:

```bash
npm test
```

## Dependencies

- React
- Next.js
- Tailwind CSS
- shadcn/ui (Table, Pagination, Input, Button)
- lucide-react (icons)

## License

MIT