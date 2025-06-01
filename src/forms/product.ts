import { z } from "zod";

export const productFormSchema = z.object({
  name: z
    .string()
    .min(3, {
      message: "Name Product must be at least 3 characters",
    })
    .max(50, {
      message: "Name Product must be less than 50 characters",
    }),
  price: z.coerce.number().min(1000),
  categoryId: z.string().min(1),
  imageUrl: z.string().optional(),
});

export type ProductFormSchema = z.infer<typeof productFormSchema>;
