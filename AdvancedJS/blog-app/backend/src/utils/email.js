const nodemailer = require("nodemailer");

function createTransport() {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS } = process.env;
  if (!SMTP_HOST || !SMTP_USER || !SMTP_PASS) {
    return null;
  }
  const port = Number(SMTP_PORT) || 587;
  return nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
}


async function sendMail(opts) {
  const from = process.env.EMAIL_FROM || process.env.SMTP_USER;
  const transport = createTransport();

  if (!transport) {
    if (process.env.NODE_ENV === "production") {
      throw new Error(
        "Email is not configured (set SMTP_HOST, SMTP_USER, SMTP_PASS)"
      );
    }
    console.warn("[email] SMTP not configured; would send to", opts.to);
    console.warn("[email] Subject:", opts.subject);
    console.warn("[email] Body:\n", opts.text);
    return { skipped: true };
  }

  const info = await transport.sendMail({
    from,
    to: opts.to,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
  });
  return { messageId: info.messageId };
}

module.exports = { sendMail, createTransport };
