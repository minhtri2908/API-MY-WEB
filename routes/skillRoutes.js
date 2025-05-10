const express = require('express');
const router = express.Router();
const Skill = require('../models/Skill');


// GET all skills
router.get('/', async (req, res) => {
  try {
    const skills = await Skill.find();
    res.json(skills);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// POST a new skill category
router.post('/', async (req, res) => {
  const { category, items } = req.body;
  const skill = new Skill({ category, items });

  try {
    const newSkill = await skill.save();
    res.status(201).json(newSkill);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

module.exports = router;
