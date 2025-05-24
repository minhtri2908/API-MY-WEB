const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();
const cookieParser = require("cookie-parser");
const adminRoutes = require("./routes/adminRoutes");

const app = express();

// Middlewares
const allowedOrigins = [
  "http://localhost:5173",
  "https://tri-pham-indol.vercel.app",
];

app.use(
  cors({
    origin: function (origin, callback) {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error("Not allowed by CORS"));
      }
    },
    credentials: true,
  })
);
app.use(express.json());
console.log(process.env.MONGO_URI);
// MongoDB connection
mongoose
  .connect(process.env.MONGO_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));
// Routes
const pingRoute = require("./routes/ping")
app.use("/api/ping",pingRoute);

app.use(cookieParser());
app.use("/api/admin", adminRoutes);

const experienceRoutes = require("./routes/experienceRoutes");
app.use("/api/experiences", experienceRoutes);

const educationRoutes = require("./routes/educationRoutes");
app.use("/api/educations", educationRoutes);

const skillRoutes = require("./routes/skillRoutes");
app.use("/api/skills", skillRoutes);

const contactRoutes = require("./routes/contactRoutes");
app.use("/api/contacts", contactRoutes);

const PORT = process.env.PORT || 5000;
app.get("/", (req, res) => {
  res.send("API is running!");
});
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
