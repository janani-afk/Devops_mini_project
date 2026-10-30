import { z } from "zod";
import { CATEGORIES } from "./types";

const date = z.string().regex(/^\d{4}-\d{2}-\d{2}$/, "Enter a valid date");

export const medicineSchema = z
  .object({
    name: z.string().trim().min(1, "Medicine name is required").max(100),
    category: z.enum(CATEGORIES, { errorMap: () => ({ message: "Select a category" }) }),
    batchNumber: z.string().trim().min(1, "Batch number is required").max(40),
    quantity: z.coerce.number({ invalid_type_error: "Enter a number" }).int("Whole numbers only").min(0, "Quantity cannot be negative"),
    minStock: z.coerce.number({ invalid_type_error: "Enter a number" }).int("Whole numbers only").min(0, "Threshold cannot be negative"),
    manufacturingDate: date,
    expiryDate: date,
    supplier: z.string().trim().min(1, "Supplier is required").max(100),
  })
  .refine((v) => v.expiryDate > v.manufacturingDate, {
    path: ["expiryDate"],
    message: "Expiry date must be after manufacturing date",
  })
  .refine((v) => v.manufacturingDate <= new Date().toISOString().slice(0, 10), {
    path: ["manufacturingDate"],
    message: "Manufacturing date cannot be in the future",
  });

export type MedicineFormValues = z.infer<typeof medicineSchema>;
