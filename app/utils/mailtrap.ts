import { MailtrapClient } from "mailtrap";

export const client = new MailtrapClient({
  token: process.env.MAILTRAP_TOCKEN!,
});
