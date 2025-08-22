import nodemailer from "nodemailer";
import { response } from "./Helper/responsehelper";
export const sendEmail = async (subject, reciever, body) => {
  const transporter = nodemailer.createTransport({
    host: process.env.NODEMAILER_HOST,
    port: process.env.NODEMAILER_PORT,
    secure: false,
    auth: {
      user: process.env.NODEMAILER_EMAIL,
      pass: process.env.NODEMAILER_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Team Huzaifa" <${process.env.NODEMAILER_EMAIL}>`,
    to: reciever,
    subject: subject,
    html: body,
  };

  try {
    await transporter.sendMail(mailOptions);
    return response(true, 200, "Email sent successfully");
  } catch (error) {
    return response(false, 500, "Failed to send email", {
      error: error.message,
    });
  }
};
