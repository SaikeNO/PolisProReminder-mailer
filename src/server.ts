import * as amqp from "amqplib/callback_api";
import { sendEmailWithRetry } from "./emailService";
import { getEnvVariables } from "./getEnvVariables";
import { getEmailDetailsKeys, parseToEmailDetails } from "./contracts";

const env = getEnvVariables();

// Połączenie z RabbitMQ
amqp.connect(env.RABBITMQ_URL, (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    channel.assertQueue(env.RABBITMQ_QUEUE, { durable: true });
    console.log(`Oczekiwanie na wiadomości w kolejce: ${env.RABBITMQ_QUEUE}`);

    // Nasłuchiwanie wiadomości
    channel.consume(
      env.RABBITMQ_QUEUE,
      async (msg) => {
        if (msg === null) return;

        const emailDetails = parseToEmailDetails(msg.content.toString());

        if (emailDetails) {
          const result = await sendEmailWithRetry(emailDetails);
          if (result) {
            channel.ack(msg);
          } else {
            console.error("Nie udało się wysłać e-maila po maksymalnej liczbie prób.");
          }
        } else {
          console.error(`EmailDetails musi zawierać wszystkie składowe: ${getEmailDetailsKeys().join(", ")}`);
          channel.ack(msg);
        }
      },
      { noAck: false }
    );
  });
});
