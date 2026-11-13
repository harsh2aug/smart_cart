import { env } from '../config/env.js';

// Sends one email through Brevo's API (https://developers.brevo.com).
// No Brevo key in .env (development)? Print the email in the terminal instead.
export async function sendEmail({ to, subject, text }) {
  if (!env.BREVO_API_KEY) {
    console.log('\n--- EMAIL (not sent, no BREVO_API_KEY) ---');
    console.log(`To: ${to}\nSubject: ${subject}\n${text}\n`);
    return;
  }

  const response = await fetch('https://api.brevo.com/v3/smtp/email', {
    method: 'POST',
    headers: {
      'api-key': env.BREVO_API_KEY,
      'content-type': 'application/json',
      accept: 'application/json',
    },
    body: JSON.stringify({
      sender: { name: env.MAIL_FROM_NAME, email: env.MAIL_FROM_EMAIL },
      to: [{ email: to }],
      subject,
      textContent: text,
    }),
  });

  if (!response.ok) {
    throw new Error(`Email failed (${response.status}): ${await response.text()}`);
  }
}
