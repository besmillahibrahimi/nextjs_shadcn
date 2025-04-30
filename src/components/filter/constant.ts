// MongoDB operators
export type Operator =
  | "$eq" // Equal
  | "$ne" // Not Equal
  | "$gt" // Greater Than
  | "$gte" // Greater Than or Equal
  | "$lt" // Less Than
  | "$lte" // Less Than or Equal
  | "$in" // In Array
  | "$nin" // Not In Array
  | "$exists" // Field Exists
  | "$regex" // Regular Expression
  | "$startsWith" // Starts With (special case using $regex)
  | "$endsWith" // Ends With (special case using $regex)
  | "$contains"; // Contains (special case using $regex)

// Input Field Types
export type FieldType =
  | "text"
  | "number"
  | "date"
  | "datetime"
  | "checkbox"
  | "radio"
  | "select"
  | "multiselect"
  | "boolean";
// Maps field types to their compatible operators
export const FIELD_TYPE_OPERATORS: Record<FieldType, Operator[]> = {
  text: ["$eq", "$ne", "$regex", "$startsWith", "$endsWith", "$contains"],
  number: ["$eq", "$ne", "$gt", "$gte", "$lt", "$lte"],
  date: ["$eq", "$ne", "$gt", "$gte", "$lt", "$lte"],
  datetime: ["$eq", "$ne", "$gt", "$gte", "$lt", "$lte"],
  checkbox: ["$eq"],
  radio: ["$eq", "$ne"],
  select: ["$eq", "$ne"],
  multiselect: ["$in", "$nin"],
  boolean: ["$eq"],
};

// Maps operators to their human-readable labels
export const OPERATOR_LABELS: Record<Operator, string> = {
  $eq: "Equals",
  $ne: "Not Equal",
  $gt: "Greater Than",
  $gte: "Greater Than or Equal",
  $lt: "Less Than",
  $lte: "Less Than or Equal",
  $in: "Includes Any",
  $nin: "Excludes All",
  $exists: "Exists",
  $regex: "Matches Pattern",
  $startsWith: "Starts With",
  $endsWith: "Ends With",
  $contains: "Contains",
};
