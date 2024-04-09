import { env } from "@/env";
import { Resend } from "resend";
import logger from "./logger";

const resend = new Resend(env.RESEND_API_KEY);

type SendMailProps = { to: string[] | string; subject: string; html: string };

export async function sendMail({ to, subject, html }: SendMailProps) {
  const { data, error } = await resend.emails.send({
    from: env.RESEND_FROM_EMAIL, // "Acme <onboarding@resend.dev>"
    to,
    subject,
    html,
  });

  if (error) {
    return logger.error(error);
  }

  logger.info("Email sent successfully to ", to, data);
}
