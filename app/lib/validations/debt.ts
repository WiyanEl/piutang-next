import { z } from "zod";

export const debtTypeSchema = z.enum([
  "owed_to_me",
  "i_owe",
]);

export const createDebtSchema = z.object({
  type: debtTypeSchema,

  counterpart_name: z
    .string()
    .trim()
    .min(1, "Nama pihak lain wajib diisi")
    .max(100, "Nama pihak lain maksimal 100 karakter"),

  amount: z
    .number()
    .int("Jumlah harus berupa bilangan bulat")
    .positive("Jumlah harus lebih dari 0"),

  note: z
    .string()
    .trim()
    .max(500, "Catatan maksimal 500 karakter")
    .nullable()
    .optional(),

  due_date: z
    .string()
    .date("Format tanggal tidak valid")
    .nullable()
    .optional(),

  note: z
    .string()
    .trim()
    .max(200, "Catatan maksimal 200 karakter")
    .nullable()
    .optional(),
});

export const updateDebtSchema = createDebtSchema
  .extend({
    settled_at: z
      .string()
      .datetime()
      .nullable()
      .optional(),
  })
  .partial();

export const debtQuerySchema = z.object({
  status: z
    .enum(["settled", "unsettled"])
    .optional(),

  type: debtTypeSchema.optional(),
});