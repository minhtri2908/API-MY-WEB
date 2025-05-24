// routes/contactRoutes.js
const express = require("express");
const router = express.Router();
const Contact = require("../models/Contact");
const authenticateAdmin = require("../middleware/authMiddleware");
const { sendContactNotification } = require("../utils/mailer");
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
    await sendContactNotification({ name, email, phone, details });
    res.status(201).json({ message: "Contact saved and email sent." });
  } catch (error) {
    console.error("Error saving contact or sending email:", error);
    res.status(500).json({ message: "Server error.", error });
  }
});
// GET /api/contacts?page=1&limit=10
router.get("/", authenticateAdmin, async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 10;
    const skip = (page - 1) * limit;

    const totalContacts = await Contact.countDocuments();
    const contacts = await Contact.find()
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit);

    res.json({
      contacts,
      total: totalContacts,
      page,
      totalPages: Math.ceil(totalContacts / limit),
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch contacts", error });
  }
});


router.delete("/:id", authenticateAdmin, async (req, res) => {
  try {
    const deletedContact = await Contact.findByIdAndDelete(req.params.id);
    if (!deletedContact) {
      return res.status(404).json({ message: "Contact not found." });
    }
    res.json({ message: "Contact deleted successfully." });
  } catch (error) {
    res.status(500).json({ message: "Failed to delete contact.", error });
  }
});
module.exports = router;
