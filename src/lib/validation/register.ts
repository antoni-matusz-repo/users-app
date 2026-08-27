import { z } from "zod";

export const registerSchema = z.object({
  firstName: z.string().trim().min(1, "Imię jest wymagane."),
  lastName: z.string().trim().min(1, "Nazwisko jest wymagane."),
  email: z
    .string()
    .trim()
    .min(1, "Email jest wymagany.")
    .pipe(z.email("Nieprawidłowy format emaila.")),
  password: z.string().min(8, "Hasło musi mieć co najmniej 8 znaków."),
});

export type RegisterFormValues = z.infer<typeof registerSchema>;

export type RegisterActionState = {
  success?: boolean;
  error?: string;
  fieldErrors?: {
    firstName?: string;
    lastName?: string;
    email?: string;
    password?: string;
  };
};
