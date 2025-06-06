const express = require("express");
const router = express.Router();
const Skill = require("../models/Skill");
const authenticateAdmin = require("../middleware/authMiddleware");

// GET all skills
router.get("/", async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new skill category
router.post("/", authenticateAdmin, async (req, res) => {
  const { category, items } = req.body;
  const skill = new Skill({ category, items });

  try {
    const newSkill = await skill.save();
    res.status(201).json(newSkill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
// PUT update a skill category by ID
router.put("/:id", authenticateAdmin, async (req, res) => {
  const { category, items } = req.body;

  try {
    const updatedSkill = await Skill.findByIdAndUpdate(
      req.params.id,
      { category, items },
      { new: true, runValidators: true }
    );

    if (!updatedSkill) {
      return res.status(404).json({ message: "Skill category not found" });
    }

    res.json(updatedSkill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
