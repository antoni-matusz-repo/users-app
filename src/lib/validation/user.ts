import { z } from "zod";

export const userSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email jest wymagany.")
    .pipe(z.email("Nieprawidłowy format emaila.")),
  firstName: z.string().trim().min(1, "Imię jest wymagane."),
  lastName: z.string().trim().min(1, "Nazwisko jest wymagane."),
});

export type UserFormValues = z.infer<typeof userSchema>;

export type ActionState = {
  error?: string;
  fieldErrors?: {
    email?: string;
    firstName?: string;
    lastName?: string;
  };
};
