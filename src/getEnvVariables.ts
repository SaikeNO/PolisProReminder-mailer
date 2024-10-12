import * as dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = ["RABBITMQ_QUEUE", "RABBITMQ_URL", "EMAIL_HOST", "EMAIL_PORT", "EMAIL_USER", "EMAIL_PASS"];

export const getEnvVariables = () => {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Brak wymaganej zmiennej środowiskowej: ${envVar}`);
      process.exit(1);
    }
  }

  return {
    RABBITMQ_URL: process.env.RABBITMQ_URL!,
    EMAIL_HOST: process.env.EMAIL_HOST!,
    EMAIL_PORT: parseInt(process.env.EMAIL_PORT!),
    EMAIL_USER: process.env.EMAIL_USER!,
    EMAIL_PASS: process.env.EMAIL_PASS!,
    RABBITMQ_QUEUE: process.env.RABBITMQ_QUEUE!,
  };
};
