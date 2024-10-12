import nodemailer, { Transporter } from "nodemailer";
import { getEnvVariables } from "./getEnvVariables";
import { EmailDetails } from "./contracts";

const env = getEnvVariables();

const createTransporter = (): Transporter => {
  return nodemailer.createTransport({
    host: env.EMAIL_HOST,
    port: env.EMAIL_PORT,
    secure: true,
    auth: {
      user: env.EMAIL_USER,
      pass: env.EMAIL_PASS,
    },
  });
};

export const sendEmail = async ({ to, subject, text }: EmailDetails): Promise<number> => {
  const transporter = createTransporter();

  const mailOptions = {
    from: env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email wysłany do: ${to}`);
    return 0;
  } catch (error) {
    console.error("Błąd przy wysyłaniu maila:", error);
    return 1;
  } finally {
    transporter.close();
  }
};
