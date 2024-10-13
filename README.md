# PolisProReminder Mailer

## Description

The `PolisProReminder Mailer` is a Node.js service built in TypeScript that listens for messages from RabbitMQ and sends emails based on the received data. It uses the `nodemailer` library for email handling and `amqplib` for communication with RabbitMQ.

## Requirements

- Node.js v18+
- RabbitMQ
- Docker (optional, if you want to run RabbitMQ in a container)
- Installed dependencies (run `npm install`)

## Configuration

### `.env` File

To make the application work properly, create a `.env.dev` from `.env.example` and fill all the required environment variables:

```
EMAIL_HOST=smtp.example.com
EMAIL_USER=your_email@example.com
EMAIL_PASS=your_password
```

### Environment Variables

The application requires the following environment variables:

- `RABBITMQ_URL` - Address of RabbitMQ (e.g., `amqp://localhost`).
- `RABBITMQ_QUEUE` - The name of the RabbitMQ queue.
- `EMAIL_HOST` - SMTP host for sending emails.
- `EMAIL_PORT` - SMTP port.
- `EMAIL_USER` - SMTP user for authentication.
- `EMAIL_PASS` - Password for SMTP user.

## Getting Started

### Install Dependencies

Install the required dependencies by running:

```bash
npm install
```

### Install Dependencies

To start the server, run:

```bash
npm start
```

The application will listen for messages from the RabbitMQ queue and process them.

### Run RabbitMQ with Docker

The application requires running RabbitMQ.

```bash
docker-compose -f docker-compose.dev.yml up -d
```

RabbitMQ will be available on port 5672 (for communication) and 15672 (management panel).

## Project Structure

```
src/
|-- contracts.ts            # Interface definitions and functions for parsing messages
|-- emailService.ts         # Logic for sending emails using Nodemailer
|-- getEnvVariables.ts      # Fetching and validating environment variables
|-- helpers.ts              # Helper functions, e.g., converting object keys to camelCase
|-- server.ts               # Main server that listens to RabbitMQ messages
.env                        # Configuration file (do not include in the repository)
package.json                # Dependencies and run scripts
```

## File Descriptions

### `contracts.ts`

- Contains the `EmailDetails` interface, which defines the structure of email data.
- `getEmailDetailsKeys()` returns the required keys for an email.
- `parseToEmailDetails(message: string)` parses a JSON message into an `EmailDetails` object, validating its structure.
- Uses a helper function `toCamelCaseKeys` to convert keys to camelCase.

### `emailService.ts`

- Handles the creation and configuration of the `nodemailer` transporter.
- Contains the `sendEmail` function that sends an email using the provided `EmailDetails`.
- Uses environment variables for SMTP configuration and authentication.
- Includes error handling and logging to ensure proper email delivery.

### `getEnvVariables.ts`

- Loads environment variables using `dotenv` and ensures that all required variables are provided.
- Exits the process if any required environment variable is missing.
- Returns an object with the parsed environment variables.

### `helpers.ts`

- Contains utility functions for the project.
- `toCamelCaseKeys<T>` converts the first letter of each key in an object to lowercase to follow camelCase convention.

### `server.ts`

- Main entry point of the application.
- Connects to RabbitMQ using the `amqplib` library and listens to the queue defined in the environment variables.
- Processes messages from RabbitMQ by parsing them into `EmailDetails`.
- Uses `sendEmail` to send the parsed email data and acknowledges messages on successful processing.

### `package.json`

- Defines the project�s metadata, scripts, and dependencies.
- Includes scripts for starting the server (`npm start`).
- Lists dependencies like `nodemailer` for sending emails, `amqplib` for RabbitMQ, and `dotenv` for environment variables management.

## Sample Message in RabbitMQ

To test the application, you can send a message to the RabbitMQ queue with the following content:

```json
{
  "to": "example@example.com",
  "subject": "Test e-mail",
  "text": "This is the content of the test email."
}
```
