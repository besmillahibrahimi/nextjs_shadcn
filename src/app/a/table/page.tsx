// src/app/examples/table/page.tsx
"use client";

import { DynamicTable } from "@/components/table/dynamic-table";
import type { ColumnDef, SortDirection } from "@/components/table/types";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { ArrowUpDown, Check, X } from "lucide-react";
import { useState } from "react";

// Example data type
interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  status: "active" | "inactive" | "pending";
  joined: string;
  avatar?: string;
  lastActive: Date;
}

// Sample data
const users: User[] = [
  {
    id: "1",
    name: "John Doe",
    email: "john@example.com",
    role: "Admin",
    status: "active",
    joined: "2021-01-10",
    avatar: "/avatars/john.png",
    lastActive: new Date("2023-04-20T14:30:00"),
  },
  {
    id: "2",
    name: "Jane Smith",
    email: "jane@example.com",
    role: "User",
    status: "active",
    joined: "2021-03-15",
    avatar: "/avatars/jane.png",
    lastActive: new Date("2023-04-25T09:15:00"),
  },
  {
    id: "3",
    name: "Bob Johnson",
    email: "bob@example.com",
    role: "Editor",
    status: "inactive",
    joined: "2021-02-20",
    lastActive: new Date("2023-03-10T11:45:00"),
  },
  {
    id: "4",
    name: "Alice Brown",
    email: "alice@example.com",
    role: "User",
    status: "pending",
    joined: "2021-04-05",
    avatar: "/avatars/alice.png",
    lastActive: new Date("2023-04-28T16:20:00"),
  },
  {
    id: "5",
    name: "Tom Wilson",
    email: "tom@example.com",
    role: "Editor",
    status: "active",
    joined: "2021-01-25",
    lastActive: new Date("2023-04-15T10:30:00"),
  },
  // Add more sample data as needed
];

// Create more sample data for pagination example
const generateMoreUsers = (count: number): User[] => {
  const additionalUsers: User[] = [];

  for (let i = 0; i < count; i++) {
    const index = i + 6;
    const roles = ["Admin", "User", "Editor"];
    const statuses: Array<"active" | "inactive" | "pending"> = ["active", "inactive", "pending"];

    additionalUsers.push({
      id: index.toString(),
      name: `User ${index}`,
      email: `user${index}@example.com`,
      role: roles[Math.floor(Math.random() * roles.length)],
      status: statuses[Math.floor(Math.random() * statuses.length)],
      joined: `2021-${Math.floor(Math.random() * 12) + 1}-${Math.floor(Math.random() * 28) + 1}`,
      lastActive: new Date(Date.now() - Math.floor(Math.random() * 30) * 24 * 60 * 60 * 1000),
    });
  }

  return additionalUsers;
};

// Add more users for pagination example
const allUsers = [...users, ...generateMoreUsers(45)]; // Total 50 users

export default function TableExamplePage() {
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  // Define columns with custom renderers
  const columns: ColumnDef<User>[] = [
    {
      id: "avatar",
      header: "",
      enableSorting: false,
      enableFilter: false,
      cell: ({ row }) => (
        <Avatar className="h-8 w-8">
          <AvatarImage src={row.avatar || ""} alt={row.name} />
          <AvatarFallback>{row.name.charAt(0)}</AvatarFallback>
        </Avatar>
      ),
      minWidth: 50,
      maxWidth: 50,
    },
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
      cell: ({ value, row }) => <div className="font-medium">{value}</div>,
      minWidth: 150,
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
      // Custom sort function example
      sortFn: (a, b, direction) => {
        const order = { Admin: 1, Editor: 2, User: 3 };
        const aValue = order[a.role as keyof typeof order] || 999;
        const bValue = order[b.role as keyof typeof order] || 999;
        return direction === "asc" ? aValue - bValue : bValue - aValue;
      },
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ value }) => {
        const statusStyles = {
          active: "bg-green-100 text-green-800",
          inactive: "bg-red-100 text-red-800",
          pending: "bg-yellow-100 text-yellow-800",
        };

        return (
          <Badge className={statusStyles[value as keyof typeof statusStyles]}>
            {value.charAt(0).toUpperCase() + value.slice(1)}
          </Badge>
        );
      },
    },
    {
      id: "joined",
      header: "Joined",
      accessorKey: "joined",
      cell: ({ value }) => <span>{new Date(value).toLocaleDateString()}</span>,
    },
    {
      id: "lastActive",
      header: "Last Active",
      accessorKey: "lastActive",
      cell: ({ value }) => {
        // Format date to relative time (e.g., "2 days ago")
        const rtf = new Intl.RelativeTimeFormat("en", { numeric: "auto" });
        const daysDiff = Math.round(
          (value.getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)
        );

        return <span>{daysDiff === 0 ? "Today" : rtf.format(daysDiff, "day")}</span>;
      },
    },
    {
      id: "actions",
      header: "Actions",
      enableSorting: false,
      enableFilter: false,
      cell: ({ row }) => (
        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            Edit
          </Button>
          <Button variant="outline" size="sm" className="text-red-500">
            Delete
          </Button>
        </div>
      ),
    },
  ];

  // Example of client-side pagination and sorting
  return (
    <div className="container mx-auto py-10">
      <h1 className="text-2xl font-bold mb-6">Dynamic Table Example</h1>

      <div className="space-y-10">
        {/* Basic Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Basic Table</h2>
          <DynamicTable
            data={users}
            columns={columns.filter((c) => c.id !== "actions")}
            enablePagination={false}
            enableFiltering={false}
          />
        </div>

        {/* Full-featured Table */}
        <div>
          <h2 className="text-xl font-semibold mb-4">Full-featured Table</h2>
          <DynamicTable
            data={allUsers}
            columns={columns}
            enablePagination={true}
            pageSize={10}
            enableRowSelection={true}
            onRowClick={(row) => setSelectedUser(row)}
            enableFiltering={true}
            enableGlobalFilter={true}
            enableSorting={true}
            initialSortColumn="name"
            initialSortDirection="asc"
            className="mb-4"
          />

          {selectedUser && (
            <div className="p-4 border rounded-md bg-slate-50">
              <h3 className="font-medium mb-2">Selected User:</h3>
              <pre className="text-sm">{JSON.stringify(selectedUser, null, 2)}</pre>
            </div>
          )}
        </div>

        {/* Server-side pagination and sorting example */}
        <ServerSideTable />
      </div>
    </div>
  );
}

// Example of server-side pagination and sorting
function ServerSideTable() {
  const [data, setData] = useState<User[]>(allUsers.slice(0, 5));
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | undefined>("name");
  const [sortDirection, setSortDirection] = useState<SortDirection>("asc");
  const pageSize = 5;

  // Define columns with custom renderers
  const columns: ColumnDef<User>[] = [
    {
      id: "name",
      header: "Name",
      accessorKey: "name",
    },
    {
      id: "email",
      header: "Email",
      accessorKey: "email",
    },
    {
      id: "role",
      header: "Role",
      accessorKey: "role",
    },
    {
      id: "status",
      header: "Status",
      accessorKey: "status",
      cell: ({ value }) =>
        value === "active" ? (
          <Check className="text-green-500" />
        ) : value === "inactive" ? (
          <X className="text-red-500" />
        ) : (
          <ArrowUpDown className="text-yellow-500" />
        ),
    },
  ];

  // Simulate server-side data fetching
  const fetchData = (page: number, columnId?: string, direction?: SortDirection) => {
    // In a real app, this would be an API call
    console.log(`Fetching page ${page}, sortColumn: ${columnId}, direction: ${direction}`);

    // Sort data first (simulating server-side sorting)
    let sortedData = [...allUsers];
    if (columnId && direction) {
      sortedData = sortedData.sort((a, b) => {
        const aValue = a[columnId as keyof User];
        const bValue = b[columnId as keyof User];

        if (aValue === bValue) return 0;
        if (aValue === null || aValue === undefined) return direction === "asc" ? -1 : 1;
        if (bValue === null || bValue === undefined) return direction === "asc" ? 1 : -1;

        if (typeof aValue === "string" && typeof bValue === "string") {
          return direction === "asc" ? aValue.localeCompare(bValue) : bValue.localeCompare(aValue);
        }

        return direction === "asc" ? (aValue < bValue ? -1 : 1) : aValue < bValue ? 1 : -1;
      });
    }

    // Then paginate (simulating server-side pagination)
    const start = (page - 1) * pageSize;
    const paginatedData = sortedData.slice(start, start + pageSize);

    // Update state
    setData(paginatedData);
    setCurrentPage(page);
    setSortColumn(columnId);
    setSortDirection(direction ?? null);
  };

  // Handle page change
  const handlePageChange = (page: number) => {
    fetchData(page, sortColumn, sortDirection);
  };

  // Handle sort change
  const handleSortChange = (columnId: string, direction: SortDirection) => {
    fetchData(currentPage, columnId, direction);
  };

  return (
    <div>
      <h2 className="text-xl font-semibold mb-4">Server-side Pagination & Sorting</h2>
      <p className="text-sm text-slate-600 mb-4">
        This example demonstrates handling pagination and sorting on the server-side. In a real
        application, the fetchData function would make API calls.
      </p>

      <DynamicTable
        data={data}
        columns={columns}
        enablePagination={true}
        pageSize={pageSize}
        enableFiltering={false}
        enableSorting={true}
        initialSortColumn={sortColumn}
        initialSortDirection={sortDirection}
        onPageChange={handlePageChange}
        onSortChange={handleSortChange}
        manualPagination={true}
        manualSorting={true}
        totalItems={allUsers.length}
      />
    </div>
  );
}
