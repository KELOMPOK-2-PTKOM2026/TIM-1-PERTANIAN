import { z } from "zod";

export const loginSchema = z.object({
  email: z.string().trim().toLowerCase().pipe(z.email("Email tidak valid")),
  password: z.string().min(8, "Password minimal 8 karakter"),
});

export const registerSchema = z
  .object({
    name: z.string().trim().min(2, "Nama minimal 2 karakter"),
    email: z.string().trim().toLowerCase().pipe(z.email("Email tidak valid")),
    password: z.string().min(8, "Password minimal 8 karakter"),
    confirmPassword: z.string(),
    city: z.string().trim().optional(),
    whatsapp: z
      .string()
      .trim()
      .regex(/^(\+62|62|0)8\d{7,12}$/, "Nomor WhatsApp tidak valid")
      .optional()
      .or(z.literal("")),
  })
  .refine((d) => d.password === d.confirmPassword, {
    message: "Konfirmasi password tidak sama",
    path: ["confirmPassword"],
  });

export type LoginInput = z.infer<typeof loginSchema>;
export type RegisterInput = z.infer<typeof registerSchema>;
