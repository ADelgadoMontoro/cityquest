// Minimal structural Cloudflare runtime types for the D1 binding.
// This keeps the Worker contract explicit without forcing a broader
// Cloudflare types integration before the API actually performs queries.

export type D1Result<T = Record<string, unknown>> = {
  meta: Record<string, unknown>;
  results?: T[];
  success: boolean;
};

export type D1PreparedStatement = {
  all<T = Record<string, unknown>>(): Promise<D1Result<T>>;
  bind(...values: unknown[]): D1PreparedStatement;
  first<T = Record<string, unknown>>(columnName?: string): Promise<T | null>;
  raw<T = unknown[]>(options?: { columnNames?: boolean }): Promise<T[]>;
  run<T = Record<string, unknown>>(): Promise<D1Result<T>>;
};

export type D1Database = {
  batch<T = Record<string, unknown>>(
    statements: D1PreparedStatement[],
  ): Promise<Array<D1Result<T>>>;
  dump(): Promise<ArrayBuffer>;
  exec<T = Record<string, unknown>>(query: string): Promise<D1Result<T>>;
  prepare(query: string): D1PreparedStatement;
};
