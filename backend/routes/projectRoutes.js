const express = require('express');
const router = express.Router();
const { 
  getProjects,
  getProjectById, 
  createProject, 
  updateProject, 
  deleteProject 
} = require('../controllers/projectController');

const { protect } = require('../middleware/authMiddleware');

// @route   /api/projects
router.route('/')
  .get(getProjects)        // Public: Fetch all projects
  .post(protect, createProject);    // Private/Admin: Create a new project

// @route   /api/projects/:id
router.route('/:id')
  .get(getProjectById)     // Private/Admin: Fetch specific project
  .put(protect, updateProject)      // Private/Admin: Update specific project
  .delete(protect, deleteProject);  // Private/Admin: Delete specific project

module.exports = router;