const Project = require('../models/Project');

// @desc    Get all projects (Sorted by display order)
// @route   GET /api/projects
// @access  Public
const getProjects = async (req, res) => {
  try {
    const projects = await Project.find().sort({ order: 1 });
    res.status(200).json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

const getProjectById = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id)
    if (!project) return res.status(404).json({ message: 'Project not found' })
    res.status(200).json(project)
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message })
  }
}

// @desc    Create a new project
// @route   POST /api/admin/projects
// @access  Private/Admin
const createProject = async (req, res) => {
  try {
    const project = await Project.create(req.body);
    res.status(201).json(project);
  } catch (error) {
    res.status(400).json({ message: 'Invalid project data', error: error.message });
  }
};

// @desc    Update a project
// @route   PUT /api/admin/projects/:id
// @access  Private/Admin
const updateProject = async (req, res) => {
  try {
    const updatedProject = await Project.findByIdAndUpdate(
      req.params.id, 
      req.body, 
      { new: true, runValidators: true } // Returns the updated document and runs schema validation
    );

    if (!updatedProject) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json(updatedProject);
  } catch (error) {
    res.status(400).json({ message: 'Invalid update data', error: error.message });
  }
};

// @desc    Delete a project
// @route   DELETE /api/admin/projects/:id
// @access  Private/Admin
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.params.id);
    
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    res.status(200).json({ message: 'Project removed successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProjects,
  getProjectById,
  createProject,
  updateProject,
  deleteProject
};