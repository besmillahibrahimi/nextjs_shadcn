// src/components/DynamicTable/DynamicTable.tsx
import { useState, useEffect, useCallback } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from "@/components/ui/pagination";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { ChevronDown, ChevronUp, Search, X } from "lucide-react";
import type { SortDirection, TableProps } from "./types";

export function DynamicTable<T>({
  data,
  columns,
  enablePagination = true,
  pageSize = 10,
  enableRowSelection = false,
  onRowClick,
  enableFiltering = true,
  enableGlobalFilter = true,
  className = "",
  noDataMessage = "No data available",
  enableSorting = true,
  initialSortColumn,
  initialSortDirection = null,
  onPageChange,
  onSortChange,
  manualPagination = false,
  manualSorting = false,
  totalItems,
}: Readonly<TableProps<T>>) {
  const [currentPage, setCurrentPage] = useState(1);
  const [sortColumn, setSortColumn] = useState<string | undefined>(initialSortColumn);
  const [sortDirection, setSortDirection] = useState<SortDirection>(initialSortDirection);
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});
  const [globalFilter, setGlobalFilter] = useState("");
  const [selectedRows, setSelectedRows] = useState<Record<string, boolean>>({});

  // Calculate pagination values
  const totalPages =
    manualPagination && totalItems
      ? Math.ceil(totalItems / pageSize)
      : Math.ceil(data.length / pageSize);

  // Handle sort toggle
  const handleSort = useCallback(
    (columnId: string) => {
      if (!enableSorting) return;

      let newDirection: SortDirection = "asc";
      if (sortColumn === columnId) {
        if (sortDirection === "asc") newDirection = "desc";
        else if (sortDirection === "desc") newDirection = null;
        else newDirection = "asc";
      }

      setSortColumn(newDirection === null ? undefined : columnId);
      setSortDirection(newDirection);

      if (onSortChange) {
        onSortChange(columnId, newDirection);
      }
    },
    [enableSorting, sortColumn, sortDirection, onSortChange]
  );

  // Apply sorting to data (if not manual)
  const sortedData = useCallback(() => {
    if (manualSorting || !sortColumn || sortDirection === null) {
      return [...data];
    }

    const column = columns.find((col) => col.id === sortColumn);
    if (!column) return [...data];

    return [...data].sort((a, b) => {
      // Use custom sort function if provided
      if (column.sortFn) {
        return column.sortFn(a, b, sortDirection);
      }

      // Get values to compare
      const aValue = column.accessorFn
        ? column.accessorFn(a)
        : column.accessorKey
          ? a[column.accessorKey]
          : null;

      const bValue = column.accessorFn
        ? column.accessorFn(b)
        : column.accessorKey
          ? b[column.accessorKey]
          : null;

      // Standard comparison
      if (aValue === bValue) return 0;

      // Handle null/undefined
      if (aValue === null || aValue === undefined) return sortDirection === "asc" ? -1 : 1;
      if (bValue === null || bValue === undefined) return sortDirection === "asc" ? 1 : -1;

      // String comparison
      if (typeof aValue === "string" && typeof bValue === "string") {
        return sortDirection === "asc"
          ? aValue.localeCompare(bValue)
          : bValue.localeCompare(aValue);
      }

      // Number or date comparison
      return sortDirection === "asc" ? (aValue < bValue ? -1 : 1) : aValue < bValue ? 1 : -1;
    });
  }, [data, columns, sortColumn, sortDirection, manualSorting]);

  // Apply filtering
  const filteredData = useCallback(() => {
    let result = sortedData();

    if (enableFiltering) {
      // Apply column-specific filters
      for (const [columnId, filterValue] of Object.entries(filterValues)) {
        if (!filterValue) return;

        const column = columns.find((col) => col.id === columnId);
        if (!column) return;

        result = result.filter((row) => {
          // Use custom filter function if provided
          if (column.filterFn) {
            return column.filterFn(row, filterValue);
          }

          // Get value to filter
          const value = column.accessorFn
            ? column.accessorFn(row)
            : column.accessorKey
              ? row[column.accessorKey]
              : null;

          if (value === null || value === undefined) return false;

          return String(value).toLowerCase().includes(filterValue.toLowerCase());
        });
      }

      // Apply global filter
      if (enableGlobalFilter && globalFilter) {
        result = result.filter((row) => {
          return columns.some((column) => {
            // Get value to filter
            const value = column.accessorFn
              ? column.accessorFn(row)
              : column.accessorKey
                ? row[column.accessorKey]
                : null;

            if (value === null || value === undefined) return false;

            return String(value).toLowerCase().includes(globalFilter.toLowerCase());
          });
        });
      }
    }

    return result;
  }, [sortedData, enableFiltering, filterValues, columns, enableGlobalFilter, globalFilter]);

  // Paginate data
  const paginatedData = useCallback(() => {
    if (!enablePagination) return filteredData();
    if (manualPagination) return filteredData(); // When using server-side pagination

    const start = (currentPage - 1) * pageSize;
    const end = start + pageSize;
    return filteredData?.()?.slice(start, end);
  }, [filteredData, enablePagination, currentPage, pageSize, manualPagination]);

  // Handle page change
  const handlePageChange = useCallback(
    (page: number) => {
      setCurrentPage(page);
      if (onPageChange) {
        onPageChange(page);
      }
    },
    [onPageChange]
  );

  // Handle filter change
  const handleFilterChange = useCallback(
    (columnId: string, value: string) => {
      setFilterValues((prev) => ({
        ...prev,
        [columnId]: value,
      }));
      // Reset to first page when filter changes
      setCurrentPage(1);
      if (onPageChange) {
        onPageChange(1);
      }
    },
    [onPageChange]
  );

  // Handle global filter change
  const handleGlobalFilterChange = useCallback(
    (value: string) => {
      setGlobalFilter(value);
      // Reset to first page when filter changes
      setCurrentPage(1);
      if (onPageChange) {
        onPageChange(1);
      }
    },
    [onPageChange]
  );

  // Generate page numbers for pagination
  const getPageNumbers = useCallback(() => {
    if (totalPages <= 7) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    const leftSide = currentPage - 2;
    const rightSide = currentPage + 2;

    if (leftSide <= 1 && rightSide >= totalPages) {
      return Array.from({ length: totalPages }, (_, i) => i + 1);
    }

    if (leftSide <= 1) {
      return [1, 2, 3, 4, 5, "...", totalPages];
    }

    if (rightSide >= totalPages) {
      return [1, "...", totalPages - 4, totalPages - 3, totalPages - 2, totalPages - 1, totalPages];
    }

    return [1, "...", currentPage - 1, currentPage, currentPage + 1, "...", totalPages];
  }, [currentPage, totalPages]);

  // Reset page when data changes
  // biome-ignore lint/correctness/useExhaustiveDependencies: <explanation>
  useEffect(() => {
    if (currentPage > totalPages && totalPages > 0) {
      setCurrentPage(1);
      if (onPageChange) {
        onPageChange(1);
      }
    }
  }, [data.length, currentPage, totalPages, onPageChange]);

  // Handle row selection
  const handleRowSelection = useCallback(
    (rowId: string) => {
      if (!enableRowSelection) return;

      setSelectedRows((prev) => ({
        ...prev,
        [rowId]: !prev[rowId],
      }));
    },
    [enableRowSelection]
  );

  // Handle row click
  const handleRowClick = useCallback(
    (row: T) => {
      if (onRowClick) {
        onRowClick(row);
      }
    },
    [onRowClick]
  );

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setFilterValues({});
    setGlobalFilter("");
  }, []);

  // Data to display
  const displayData = paginatedData();

  return (
    <div className={`w-full space-y-4 ${className}`}>
      {/* Global filter */}
      {enableFiltering && enableGlobalFilter && (
        <div className="flex items-center space-x-2">
          <div className="relative flex-1">
            <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search all columns..."
              value={globalFilter}
              onChange={(e) => handleGlobalFilterChange(e.target.value)}
              className="pl-8"
            />
          </div>
          {(globalFilter || Object.values(filterValues).some(Boolean)) && (
            <Button variant="outline" size="sm" onClick={clearAllFilters} className="h-10">
              Clear filters
              <X className="ml-2 h-4 w-4" />
            </Button>
          )}
        </div>
      )}

      {/* Table */}
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              {columns.map((column) => (
                <TableHead
                  key={column.id}
                  style={{
                    minWidth: column.minWidth,
                    maxWidth: column.maxWidth,
                  }}
                  className={
                    column.enableSorting !== false && enableSorting
                      ? "cursor-pointer select-none"
                      : ""
                  }
                  onClick={() => {
                    if (column.enableSorting !== false && enableSorting) {
                      handleSort(column.id);
                    }
                  }}
                >
                  <div className="flex items-center space-x-1">
                    <span>{column.header}</span>
                    {column.enableSorting !== false && enableSorting && (
                      <div className="flex flex-col">
                        {sortColumn === column.id && sortDirection === "asc" ? (
                          <ChevronUp className="h-4 w-4" />
                        ) : sortColumn === column.id && sortDirection === "desc" ? (
                          <ChevronDown className="h-4 w-4" />
                        ) : (
                          <div className="h-4 w-4" />
                        )}
                      </div>
                    )}
                  </div>
                  {column.enableFilter !== false && enableFiltering && (
                    <div className="mt-2">
                      <Input
                        placeholder={`Filter ${column.header}`}
                        value={filterValues[column.id] || ""}
                        onChange={(e) => handleFilterChange(column.id, e.target.value)}
                        onClick={(e) => e.stopPropagation()}
                        className="h-8 w-full text-xs"
                      />
                    </div>
                  )}
                </TableHead>
              ))}
            </TableRow>
          </TableHeader>
          <TableBody>
            {(displayData?.length ?? 0) > 0 ? (
              displayData?.map((row, rowIndex) => {
                // Generate a unique key for the row
                const rowKey = `row-${rowIndex}`;

                return (
                  <TableRow
                    key={rowKey}
                    className={
                      onRowClick
                        ? "cursor-pointer hover:bg-muted"
                        : enableRowSelection && selectedRows[rowKey]
                          ? "bg-muted"
                          : ""
                    }
                    onClick={() => {
                      if (enableRowSelection) {
                        handleRowSelection(rowKey);
                      }
                      if (onRowClick) {
                        handleRowClick(row);
                      }
                    }}
                  >
                    {columns.map((column) => {
                      // Get the cell value
                      const value = column.accessorFn
                        ? column.accessorFn(row)
                        : column.accessorKey
                          ? row[column.accessorKey]
                          : null;

                      return (
                        <TableCell key={column.id}>
                          {column.cell
                            ? column.cell({ row, value })
                            : value !== null && value !== undefined
                              ? String(value)
                              : ""}
                        </TableCell>
                      );
                    })}
                  </TableRow>
                );
              })
            ) : (
              <TableRow>
                <TableCell colSpan={columns.length} className="h-24 text-center">
                  {noDataMessage}
                </TableCell>
              </TableRow>
            )}
          </TableBody>
        </Table>
      </div>

      {/* Pagination */}
      {enablePagination && totalPages > 1 && (
        <Pagination className="justify-end">
          <PaginationContent>
            <PaginationItem>
              <PaginationPrevious
                onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                className={currentPage === 1 ? "pointer-events-none opacity-50" : "cursor-pointer"}
              />
            </PaginationItem>

            {getPageNumbers().map((page, index) =>
              page === "..." ? (
                <PaginationItem key={`ellipsis-${page + index}`}>
                  <PaginationEllipsis />
                </PaginationItem>
              ) : (
                <PaginationItem key={`page-${page}`}>
                  <PaginationLink
                    className={
                      currentPage === page ? "bg-primary text-primary-foreground" : "cursor-pointer"
                    }
                    onClick={() => handlePageChange(Number(page))}
                  >
                    {page}
                  </PaginationLink>
                </PaginationItem>
              )
            )}

            <PaginationItem>
              <PaginationNext
                onClick={() => handlePageChange(Math.min(totalPages, currentPage + 1))}
                className={
                  currentPage === totalPages ? "pointer-events-none opacity-50" : "cursor-pointer"
                }
              />
            </PaginationItem>
          </PaginationContent>
        </Pagination>
      )}
    </div>
  );
}
