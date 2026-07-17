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
  .post(createSkill);    // Private/Admin: Create a new skill

// @route   /api/skills/:id
router.route('/:id')
  .put(updateSkill)      // Private/Admin: Update specific skill
  .delete(deleteSkill);  // Private/Admin: Delete specific skill

module.exports = router;