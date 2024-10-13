import * as dotenv from "dotenv";

dotenv.config();

const requiredEnvVars = [
  "RABBITMQ_QUEUE",
  "RABBITMQ_USER",
  "RABBITMQ_PASS",
  "RABBITMQ_HOST",
  "RABBITMQ_PORT",
  "EMAIL_HOST",
  "EMAIL_PORT",
  "EMAIL_USER",
  "EMAIL_PASS",
];

export const getEnvVariables = () => {
  for (const envVar of requiredEnvVars) {
    if (!process.env[envVar]) {
      console.error(`Brak wymaganej zmiennej środowiskowej: ${envVar}`);
      process.exit(1);
    }
  }

  const { RABBITMQ_USER, RABBITMQ_PASS, RABBITMQ_HOST, RABBITMQ_PORT, RABBITMQ_QUEUE } = process.env;
  const { EMAIL_HOST, EMAIL_PORT, EMAIL_USER, EMAIL_PASS } = process.env;

  return {
    RABBITMQ_URL: `amqp://${RABBITMQ_USER}:${RABBITMQ_PASS}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`,
    EMAIL_HOST: EMAIL_HOST!,
    EMAIL_PORT: parseInt(EMAIL_PORT!),
    EMAIL_USER: EMAIL_USER!,
    EMAIL_PASS: EMAIL_PASS!,
    RABBITMQ_QUEUE: RABBITMQ_QUEUE!,
  };
};
