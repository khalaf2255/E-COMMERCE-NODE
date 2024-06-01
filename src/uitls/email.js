import nodemailer from "nodemailer";

const sendEmail = async ({
  from = process.env.EMAIL,
  to,
  subject,
  cc,
  bcc,
  text,
  html,
  attachments = [],
} = {}) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  
  const info = await transporter.sendMail({
    from: `"khalaf 👻" <${from}>`, // sender address
    to,
    subject,
    cc,
    bcc,
    text,
    html,
    attachments,
  });
};

export default sendEmail;
