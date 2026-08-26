import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email jest wymagany.")
    .pipe(z.email("Nieprawidłowy format emaila.")),
  name: z.string().trim().min(1, "Nazwa jest wymagana."),
});

export type UserFormValues = z.infer<typeof userSchema>;

export type ActionState = {
  error?: string;
  fieldErrors?: {
    email?: string;
    name?: string;
  };
};
