import { Resend } from "resend";
import nodemailer from "nodemailer";

type SendEmailInput = {
  to: string;
  subject: string;
  html: string;
};

export async function sendEmail({ to, subject, html }: SendEmailInput) {
  if (process.env.NODE_ENV === "test") {
    // Testy nie powinny czekać na prawdziwe SMTP/HTTP ani zaśmiecać Mailpita.
    console.log(`[email:test] Pominięto wysyłkę do ${to}: ${subject}`);
    return;
  }

  const from = process.env.EMAIL_FROM ?? "Users App <onboarding@resend.dev>";

  if (process.env.RESEND_API_KEY) {
    const resend = new Resend(process.env.RESEND_API_KEY);
    const { error } = await resend.emails.send({ from, to, subject, html });
    if (error) {
      throw new Error(`Nie udało się wysłać emaila przez Resend: ${error.message}`);
    }
    return;
  }

  // Dev: lokalny SMTP -> Mailpit (docker/docker-compose.yml), nic realnie nie wychodzi.
  const transport = nodemailer.createTransport({
    host: process.env.SMTP_HOST ?? "localhost",
    port: Number(process.env.SMTP_PORT ?? 1025),
    secure: false,
  });
  await transport.sendMail({ from, to, subject, html });
}
