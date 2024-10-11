import nodemailer from "nodemailer";

interface EmailDetails {
  to: string;
  subject: string;
  text: string;
}

// Funkcja do wysyłania e-maili
export const sendEmail = async (emailDetails: EmailDetails): Promise<void> => {
  const { to, subject, text } = emailDetails;

  // Konfiguracja Nodemailer z danymi z pliku .env
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL_USER,
    to,
    subject,
    text,
  };

  try {
    await transporter.sendMail(mailOptions);
    console.log(`Email wysłany do: ${to}`);
  } catch (error) {
    console.error("Błąd przy wysyłaniu maila:", error);
  }
};
