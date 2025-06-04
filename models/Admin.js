const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: {
    type: String,
    default: "admin",
    enum: ["admin"],
  },
  name: { type: String }, // Tên người dùng (hiển thị)
  jobTitle: { type: String }, // Nghề nghiệp
  about: { type: String }, // Đôi lời
  cvLink: { type: String }, // Liên kết đến file CV
});

module.exports = mongoose.model("Admin", adminSchema);
