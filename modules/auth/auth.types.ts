export type Role = "ADMIN" | "PAKAR" | "PETANI";

export type SessionUser = {
  id: string;
  email: string;
  name: string;
  role: Role;
};

// State Server Action untuk useActionState.
export type AuthFormState = { error?: string } | undefined;
