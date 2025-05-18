// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const authenticateAdmin = require("../middleware/authMiddleware");
// @route   POST /api/contacts
// @desc    Save contact form data
// @access  Public
router.post("/", async (req, res) => {
  const { name, email, phone, details } = req.body;

  if (!name || !email || !phone || !details) {
    return res.status(400).json({ message: "All fields are required." });
  }

  try {
    const newContact = new Contact({ name, email, phone, details });
    await newContact.save();
    res.status(201).json({ message: "Contact saved successfully." });
  } catch (error) {
    res.status(500).json({ message: "Server error.", error });
  }
});
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const contacts = await Contact.find().sort({ createdAt: -1 });
    res.json(contacts);
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contacts", error });
  }
});

module.exports = router;
