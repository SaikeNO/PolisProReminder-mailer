import * as amqp from "amqplib/callback_api";
import { sendEmail } from "./emailService";
import * as dotenv from "dotenv";

// Ładowanie zmiennych środowiskowych z pliku .env
dotenv.config();

const RABBITMQ_URL = process.env.RABBITMQ_URL;
if (!RABBITMQ_URL) {
  console.error("Brak zmiennej środowiskowej RABBITMQ_URL");
  process.exit(1);
}

// Połączenie z RabbitMQ
amqp.connect(RABBITMQ_URL, (error0, connection) => {
  if (error0) {
    throw error0;
  }

  connection.createChannel((error1, channel) => {
    if (error1) {
      throw error1;
    }

    const queue = "emailQueue";

    channel.assertQueue(queue, { durable: true });
    console.log(`Oczekiwanie na wiadomości w kolejce: ${queue}`);

    // Nasłuchiwanie wiadomości
    channel.consume(
      queue,
      (msg) => {
        if (msg !== null) {
          const emailDetails = JSON.parse(msg.content.toString());
          sendEmail(emailDetails);
          channel.ack(msg); // Potwierdzenie przetworzenia wiadomości
        }
      },
      { noAck: false }
    );
  });
});
