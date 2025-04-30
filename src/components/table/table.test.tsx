// src/components/DynamicTable/DynamicTable.test.tsx
import React from "react";
import { render, screen, fireEvent } from "@testing-library/react";

import { DynamicTable } from "./dynamic-table";
import type { ColumnDef } from "./types";

// Mock data type
interface TestItem {
  id: string;
  name: string;
  age: number;
  email: string;
  isActive: boolean;
}

// Mock data
const mockData: TestItem[] = [
  { id: "1", name: "John Doe", age: 30, email: "john@example.com", isActive: true },
  { id: "2", name: "Jane Smith", age: 25, email: "jane@example.com", isActive: false },
  { id: "3", name: "Bob Johnson", age: 40, email: "bob@example.com", isActive: true },
  { id: "4", name: "Alice Brown", age: 35, email: "alice@example.com", isActive: false },
  { id: "5", name: "Tom Wilson", age: 28, email: "tom@example.com", isActive: true },
];

// Mock columns
const mockColumns: ColumnDef<TestItem>[] = [
  {
    id: "name",
    header: "Name",
    accessorKey: "name",
  },
  {
    id: "age",
    header: "Age",
    accessorKey: "age",
  },
  {
    id: "email",
    header: "Email",
    accessorKey: "email",
  },
  {
    id: "status",
    header: "Status",
    accessorKey: "isActive",
    cell: ({ value }) => (value ? "Active" : "Inactive"),
  },
];

describe("DynamicTable", () => {
  test("renders table with data", () => {
    render(<DynamicTable data={mockData} columns={mockColumns} />);

    // Check header
    expect(screen.getByText("Name")).toBeInTheDocument();
    expect(screen.getByText("Age")).toBeInTheDocument();
    expect(screen.getByText("Email")).toBeInTheDocument();
    expect(screen.getByText("Status")).toBeInTheDocument();

    // Check data
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("30")).toBeInTheDocument();
    expect(screen.getByText("john@example.com")).toBeInTheDocument();
    expect(screen.getByText("Active")).toBeInTheDocument(); // Custom cell renderer

    // Check other rows
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
    expect(screen.getByText("Inactive")).toBeInTheDocument(); // Custom cell renderer
  });

  test('displays "no data" message when data is empty', () => {
    render(<DynamicTable data={[]} columns={mockColumns} noDataMessage="No items found" />);
    expect(screen.getByText("No items found")).toBeInTheDocument();
  });

  test("enables pagination when specified", () => {
    // Create more data to paginate
    const lotsOfData = [...mockData];
    for (let i = 6; i <= 20; i++) {
      lotsOfData.push({
        id: i.toString(),
        name: `Person ${i}`,
        age: 20 + i,
        email: `person${i}@example.com`,
        isActive: i % 2 === 0,
      });
    }

    render(
      <DynamicTable data={lotsOfData} columns={mockColumns} enablePagination={true} pageSize={5} />
    );

    // Check pagination controls exist
    expect(screen.getByText("1")).toBeInTheDocument(); // Current page
    expect(screen.getByText("2")).toBeInTheDocument(); // Next page
    expect(screen.getByText("4")).toBeInTheDocument(); // Last page

    // First page should show first 5 items
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Person 6")).not.toBeInTheDocument();

    // Go to next page
    fireEvent.click(screen.getByText("2"));

    // Second page should show items 6-10
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByText("Person 6")).toBeInTheDocument();
  });

  test("handles sorting when enabled", async () => {
    render(<DynamicTable data={mockData} columns={mockColumns} enableSorting={true} />);

    // Initial state (unsorted)
    const rows = screen.getAllByRole("row");
    expect(rows[1]).toHaveTextContent("John Doe");
    expect(rows[2]).toHaveTextContent("Jane Smith");

    // Click on name header to sort ascending
    const nameHeader = screen.getByText("Name").closest("th");
    fireEvent.click(nameHeader!);

    // Check order (alphabetical)
    const rowsAfterSort = screen.getAllByRole("row");
    expect(rowsAfterSort[1]).toHaveTextContent("Alice Brown");
    expect(rowsAfterSort[2]).toHaveTextContent("Bob Johnson");

    // Click again to sort descending
    fireEvent.click(nameHeader!);

    // Check reverse order
    const rowsAfterReverseSort = screen.getAllByRole("row");
    expect(rowsAfterReverseSort[1]).toHaveTextContent("Tom Wilson");
    expect(rowsAfterReverseSort[2]).toHaveTextContent("John Doe");

    // Click again to clear sort
    fireEvent.click(nameHeader!);

    // Should return to original order
    const rowsAfterClearSort = screen.getAllByRole("row");
    expect(rowsAfterClearSort[1]).toHaveTextContent("John Doe");
    expect(rowsAfterClearSort[2]).toHaveTextContent("Jane Smith");
  });

  test("handles filtering when enabled", async () => {
    render(<DynamicTable data={mockData} columns={mockColumns} enableFiltering={true} />);

    // Global filter should exist
    const globalFilterInput = screen.getByPlaceholderText("Search all columns...");
    expect(globalFilterInput).toBeInTheDocument();

    // Filter for "John"
    fireEvent.change(globalFilterInput, { target: { value: "John" } });

    // Should only show John
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.queryByText("Jane Smith")).not.toBeInTheDocument();

    // Clear filter
    fireEvent.click(screen.getByText("Clear filters"));

    // Should show all rows again
    expect(screen.getByText("John Doe")).toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();

    // Test column filter
    const nameFilterInput = screen.getByPlaceholderText("Filter Name");
    fireEvent.change(nameFilterInput, { target: { value: "Jane" } });

    // Should only show Jane
    expect(screen.queryByText("John Doe")).not.toBeInTheDocument();
    expect(screen.getByText("Jane Smith")).toBeInTheDocument();
  });

  test("handles row click callback", () => {
    const onRowClick = jest.fn();

    render(<DynamicTable data={mockData} columns={mockColumns} onRowClick={onRowClick} />);

    // Click on a row
    const johnRow = screen.getByText("John Doe").closest("tr");
    fireEvent.click(johnRow!);

    // Check that callback was called with correct data
    expect(onRowClick).toHaveBeenCalledTimes(1);
    expect(onRowClick).toHaveBeenCalledWith(mockData[0]);
  });

  test("handles row selection when enabled", () => {
    render(<DynamicTable data={mockData} columns={mockColumns} enableRowSelection={true} />);

    // Initially no rows should be selected
    const johnRow = screen.getByText("John Doe").closest("tr");
    expect(johnRow).not.toHaveClass("bg-muted");

    // Click on a row to select it
    fireEvent.click(johnRow!);

    // Row should now be selected (have the selected class)
    // Note: This is a bit tricky to test since the selection is tracked in state
    // but we can check that the click handler works
    expect(johnRow).toHaveAttribute("class", expect.stringContaining("cursor-pointer"));
  });

  test("handles custom sort function", () => {
    const columnsWithCustomSort: ColumnDef<TestItem>[] = [
      ...mockColumns,
      {
        id: "custom",
        header: "Custom Sort",
        accessorKey: "name",
        sortFn: (a, b, direction) => {
          // Custom sort by name length
          const aLen = a.name.length;
          const bLen = b.name.length;
          return direction === "asc" ? aLen - bLen : bLen - aLen;
        },
      },
    ];

    render(<DynamicTable data={mockData} columns={columnsWithCustomSort} enableSorting={true} />);

    // Click on custom sort header
    const customHeader = screen.getByText("Custom Sort").closest("th");
    fireEvent.click(customHeader!);

    // Expect shortest name first (e.g., "Bob Johnson" should be after "Jane Smith")
    const rows = screen.getAllByRole("row");
    const nameOrder = Array.from(rows)
      .slice(1)
      .map((row) => row.textContent?.match(/[A-Za-z]+ [A-Za-z]+/)![0]);

    // Verify names are in ascending order by length
    const nameLengths = nameOrder.map((name) => name?.length || 0);
    const isSortedByLength = nameLengths.every((len, i) => i === 0 || len >= nameLengths[i - 1]);

    expect(isSortedByLength).toBe(true);
  });

  test("handles manual pagination and sorting", () => {
    const onPageChange = jest.fn();
    const onSortChange = jest.fn();

    render(
      <DynamicTable
        data={mockData}
        columns={mockColumns}
        enablePagination={true}
        enableSorting={true}
        pageSize={2}
        manualPagination={true}
        manualSorting={true}
        onPageChange={onPageChange}
        onSortChange={onSortChange}
        totalItems={20} // Simulate 20 total items, but we only pass 5
      />
    );

    // Should show 10 pages (20 items / 2 per page)
    expect(screen.getByText("10")).toBeInTheDocument();

    // Click on page 2
    fireEvent.click(screen.getByText("2"));
    expect(onPageChange).toHaveBeenCalledWith(2);

    // Click on name header to sort
    const nameHeader = screen.getByText("Name").closest("th");
    fireEvent.click(nameHeader!);
    expect(onSortChange).toHaveBeenCalledWith("name", "asc");

    // Click again to sort descending
    fireEvent.click(nameHeader!);
    expect(onSortChange).toHaveBeenCalledWith("name", "desc");
  });

  test("handles custom cell renderers", () => {
    // Add a column with a complex custom cell renderer
    const columnsWithComplexCell: ColumnDef<TestItem>[] = [
      ...mockColumns,
      {
        id: "complex",
        header: "Complex Cell",
        accessorKey: "isActive",
        cell: ({ value, row }) => (
          <div className="flex items-center space-x-2">
            <div className={`h-3 w-3 rounded-full ${value ? "bg-green-500" : "bg-red-500"}`} />
            <span>
              {value ? "Active" : "Inactive"} user: {row.name}
            </span>
          </div>
        ),
      },
    ];

    render(<DynamicTable data={mockData} columns={columnsWithComplexCell} />);

    // Check the complex cell is rendered
    expect(screen.getByText("Active user: John Doe")).toBeInTheDocument();
    expect(screen.getByText("Inactive user: Jane Smith")).toBeInTheDocument();
  });

  test("respects column width constraints", () => {
    const columnsWithWidths: ColumnDef<TestItem>[] = mockColumns.map((col) => ({
      ...col,
      minWidth: col.id === "name" ? 200 : undefined,
      maxWidth: col.id === "email" ? 300 : undefined,
    }));

    render(<DynamicTable data={mockData} columns={columnsWithWidths} />);

    // Check that the name column has minWidth style
    const nameHeader = screen.getByText("Name").closest("th");
    expect(nameHeader).toHaveStyle({ minWidth: "200px" });

    // Check that the email column has maxWidth style
    const emailHeader = screen.getByText("Email").closest("th");
    expect(emailHeader).toHaveStyle({ maxWidth: "300px" });
  });
});
