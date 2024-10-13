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

export const sendEmailWithRetry = async (emailDetails: EmailDetails, retries = 10, delay = 5000) => {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const result = await sendEmail(emailDetails);
      if (result) {
        console.log(`Wysłanie e-maila zakończone sukcesem przy próbie ${attempt}`);
        return true;
      } else {
        console.warn(`Próba ${attempt} nie powiodła się. Próba ponowienia...`);
      }
    } catch (error) {
      console.error(`Błąd podczas wysyłania e-maila przy próbie ${attempt}:`, error);
    }

    // Czekaj przed kolejną próbą (w milisekundach)
    await new Promise((resolve) => setTimeout(resolve, delay));
  }

  console.error("Wysłanie e-maila nie powiodło się po 10 próbach.");
  return false;
};
