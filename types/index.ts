// Tipe shared generik. Tipe per domain tetap di modules/<domain>/*.types.ts.
export type ApiResponse<T> = { data: T } | { error: { code: string; message: string } };

export type Pagination = { page: number; pageSize: number; total: number };
