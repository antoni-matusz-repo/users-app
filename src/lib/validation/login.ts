import { z } from "zod";

export const loginSchema = z.object({
  email: z
    .string()
    .trim()
    .min(1, "Email jest wymagany.")
    .pipe(z.email("Nieprawidłowy format emaila.")),
  password: z.string().min(1, "Hasło jest wymagane."),
});

export type LoginFormValues = z.infer<typeof loginSchema>;

export type LoginActionState = {
  error?: string;
  fieldErrors?: {
    email?: string;
    password?: string;
  };
};
