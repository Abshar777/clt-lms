import nodemailer from "nodemailer";
import { env } from "../config/env";

const transporter = nodemailer.createTransport({
  host: env.mailHost,
  port: env.mailPort,
  secure: false,
  auth: {
    user: env.mailUser,
    pass: env.mailPass,
  },
});

export const sendEmail = async (to: string, subject: string, html: string): Promise<void> => {
  await transporter.sendMail({
    from: env.mailFrom,
    to,
    subject,
    html,
  });
};
