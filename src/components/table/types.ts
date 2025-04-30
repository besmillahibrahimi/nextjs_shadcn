/**
 * Sort direction type
 */
export type SortDirection = "asc" | "desc" | null;

/**
 * Column definition for the dynamic table
 * @template T - The type of data being displayed
 */
export interface ColumnDef<T> {
  /**
   * Unique identifier for the column
   */
  id: string;

  /**
   * Display text for the column header
   */
  header: string;

  /**
   * Key to access data directly from row object
   * Alternative to accessorFn
   */
  accessorKey?: keyof T;

  /**
   * Function to access data from row object
   * Alternative to accessorKey
   */

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  accessorFn?: (row: T) => any;

  /**
   * Custom cell renderer
   * @param props - Object containing row data and cell value
   */

  // biome-ignore lint/suspicious/noExplicitAny: <explanation>
  cell?: (props: { row: T; value: any }) => React.ReactNode;

  /**
   * Whether this column can be sorted
   * @default true when enableSorting is true in table props
   */
  enableSorting?: boolean;

  /**
   * Custom sort function
   * @param a - First row to compare
   * @param b - Second row to compare
   * @param direction - Sort direction ('asc' | 'desc' | null)
   */
  sortFn?: (a: T, b: T, direction: SortDirection) => number;

  /**
   * Minimum width for the column (in pixels)
   */
  minWidth?: number;

  /**
   * Maximum width for the column (in pixels)
   */
  maxWidth?: number;

  /**
   * Whether this column can be filtered
   * @default true when enableFiltering is true in table props
   */
  enableFilter?: boolean;

  /**
   * Custom filter function
   * @param row - Row to check
   * @param filterValue - Value to filter by
   */
  filterFn?: (row: T, filterValue: string) => boolean;
}

/**
 * Props for the DynamicTable component
 * @template T - The type of data being displayed
 */
export interface TableProps<T> {
  /**
   * Data to display in the table
   */
  data: T[];

  /**
   * Column definitions
   */
  columns: ColumnDef<T>[];

  /**
   * Whether to enable pagination
   * @default true
   */
  enablePagination?: boolean;

  /**
   * Number of rows to display per page
   * @default 10
   */
  pageSize?: number;

  /**
   * Whether to enable row selection
   * @default false
   */
  enableRowSelection?: boolean;

  /**
   * Callback when a row is clicked
   * @param row - The clicked row data
   */
  onRowClick?: (row: T) => void;

  /**
   * Whether to enable filtering
   * @default true
   */
  enableFiltering?: boolean;

  /**
   * Whether to enable global search filter
   * @default true
   */
  enableGlobalFilter?: boolean;

  /**
   * Additional CSS class names
   */
  className?: string;

  /**
   * Message to display when there's no data
   * @default "No data available"
   */
  noDataMessage?: string;

  /**
   * Whether to enable sorting
   * @default true
   */
  enableSorting?: boolean;

  /**
   * Initial column to sort by
   */
  initialSortColumn?: string;

  /**
   * Initial sort direction
   * @default null
   */
  initialSortDirection?: SortDirection;

  /**
   * Callback when page changes
   * @param page - New page number
   */
  onPageChange?: (page: number) => void;

  /**
   * Callback when sort changes
   * @param columnId - Column ID being sorted
   * @param direction - New sort direction
   */
  onSortChange?: (columnId: string, direction: SortDirection) => void;

  /**
   * Whether pagination is handled externally (e.g., server-side)
   * @default false
   */
  manualPagination?: boolean;

  /**
   * Whether sorting is handled externally (e.g., server-side)
   * @default false
   */
  manualSorting?: boolean;

  /**
   * Total number of items (for manual pagination)
   */
  totalItems?: number;
}
