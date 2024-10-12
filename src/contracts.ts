import { toCamelCaseKeys } from "./helpers";

export interface EmailDetails {
  to: string;
  subject: string;
  text: string;
}

export const getEmailDetailsKeys = (): (keyof EmailDetails)[] => ["to", "subject", "text"];

export const parseToEmailDetails = (message: string): EmailDetails | null => {
  try {
    const emailDetails = toCamelCaseKeys(JSON.parse(message)) as Partial<EmailDetails>;

    const { to, subject, text } = emailDetails;

    // Sprawdzenie, czy wszystkie wymagane pola istnieją i są poprawnego typu
    if (typeof to === "string" && typeof subject === "string" && typeof text === "string") {
      return { to, subject, text };
    }

    return null;
  } catch (error) {
    console.error("Błąd parsowania wiadomości do EmailDetails:", error);
    return null;
  }
};
