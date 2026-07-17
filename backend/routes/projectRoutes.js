const express = require('express');
const router = express.Router();
const { 
  getProjects, 
  createProject, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');

const { protect } = require('../middleware/authMiddleware');

// @route   /api/projects
router.route('/')
  .get(getProjects)        // Public: Fetch all projects
  .post(createProject);    // Private/Admin: Create a new project

// @route   /api/projects/:id
router.route('/:id')
  .put(updateProject)      // Private/Admin: Update specific project
  .delete(deleteProject);  // Private/Admin: Delete specific project

module.exports = router;