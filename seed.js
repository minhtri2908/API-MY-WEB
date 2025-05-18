const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const Admin = require("./models/Admin");
require("dotenv").config();

async function createAdmin() {
  try {
    await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    const existing = await Admin.findOne({ username: "admin" });
    if (existing) {
      console.log("Admin already exists");
    } else {
      const hashedPassword = await bcrypt.hash("Pmt29082001@", 10);
      const newAdmin = new Admin({
        username: "admin",
        password: hashedPassword,
        role: "admin", // nếu bạn có field này
      });
      await newAdmin.save();
      console.log("Admin created successfully");
    }
  } catch (err) {
    console.error("Error creating admin:", err);
  } finally {
    mongoose.connection.close(); // đóng kết nối sau khi xong
  }
}

createAdmin();
