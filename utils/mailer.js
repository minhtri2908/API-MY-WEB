
const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

const sendContactNotification = async (contactData) => {
  const { name, email, phone, details } = contactData;

  const mailOptions = {
    from: `"Thông báo từ website của bạn" <${process.env.EMAIL_USER}>`,
    to: process.env.NOTIFY_EMAIL, // Email admin nhận thông báo
    subject: "📩 Có người vừa gửi liên hệ!",
    html: `
      <h3>Thông tin liên hệ mới:</h3>
      <p><strong>Họ tên:</strong> ${name}</p>
      <p><strong>Email:</strong> ${email}</p>
      <p><strong>SĐT:</strong> ${phone}</p>
      <p><strong>Chi tiết:</strong> ${details}</p>
    `,
  };

  return transporter.sendMail(mailOptions);
};

module.exports = { sendContactNotification };
