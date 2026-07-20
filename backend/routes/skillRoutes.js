const express = require('express');
const router = express.Router();
const { 
  getSkills, 
  createSkill, 
  updateSkill, 
  deleteSkill 
} = require('../controllers/skillController');

const { protect } = require('../middleware/authMiddleware');

// @route   /api/skills
router.route('/')
  .get(getSkills)        // Public: Fetch all skills
  .post(protect, createSkill);    // Private/Admin: Create a new skill

// @route   /api/skills/:id
router.route('/:id')
  .put(protect, updateSkill)      // Private/Admin: Update specific skill
  .delete(protect, deleteSkill);  // Private/Admin: Delete specific skill

module.exports = router;