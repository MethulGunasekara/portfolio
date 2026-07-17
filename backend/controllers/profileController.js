const Profile = require('../models/Profile');

// @desc    Get public profile data
// @route   GET /api/profile
// @access  Public
const getProfile = async (req, res) => {
  try {
    // We use findOne() because the Profile is a singleton (only one exists)
    const profile = await Profile.findOne();
    
    if (!profile) {
      return res.status(404).json({ message: 'Profile not found' });
    }
    
    res.status(200).json(profile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

// @desc    Update or create profile data
// @route   PUT /api/admin/profile
// @access  Private/Admin
const updateProfile = async (req, res) => {
  try {
    const { fullName, jobTitle, bio, resumeUrl, githubUrl, linkedinUrl, heroImageUrl } = req.body;

    // findOneAndUpdate with an empty filter {} targets the first/only document.
    // upsert: true creates the document if it doesn't exist yet.
    // new: true returns the modified document rather than the original.
    const updatedProfile = await Profile.findOneAndUpdate(
      {}, 
      { fullName, jobTitle, bio, resumeUrl, githubUrl, linkedinUrl, heroImageUrl },
      { new: true, upsert: true, runValidators: true }
    );

    res.status(200).json(updatedProfile);
  } catch (error) {
    res.status(500).json({ message: 'Server Error', error: error.message });
  }
};

module.exports = {
  getProfile,
  updateProfile
};