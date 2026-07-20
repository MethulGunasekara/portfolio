import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { uploadToCloudinary } from '../utils/cloudinaryUpload';

const AdminDashboard = () => {
  const [profileData, setProfileData] = useState({
    fullName: '',
    jobTitle: '',
    bio: '',
    resumeUrl: '',
    githubUrl: '',
    linkedinUrl: '',
    heroImageUrl: ''
  });
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const navigate = useNavigate();

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const token = localStorage.getItem('adminToken');
        if (!token) {
          navigate('/admin');
          return;
        }

        const res = await axios.get('/api/profile');
        if (res.data) {
          setProfileData({
            fullName: res.data.fullName || '',
            jobTitle: res.data.jobTitle || '',
            bio: res.data.bio || '',
            resumeUrl: res.data.resumeUrl || '',
            githubUrl: res.data.githubUrl || '',
            linkedinUrl: res.data.linkedinUrl || '',
            heroImageUrl: res.data.heroImageUrl || ''
          });
        }
      } catch (error) {
        console.error("Failed to load profile:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProfile();
  }, [navigate]);

  const handleFileUpload = async (e, field) => {
    const file = e.target.files[0];
    if (!file) return;

    setIsUploading(true);
    try {
      // Pass the file to our new utility function
      const uploadedUrl = await uploadToCloudinary(file);
      
      // Update the specific field (resumeUrl or heroImageUrl) in our form state
      setProfileData({ ...profileData, [field]: uploadedUrl });
      
    } catch (error) {
      console.error("Upload error:", error);
      alert('File upload failed. Please check your connection and try again.');
    } finally {
      // This runs whether the upload succeeds or fails, ensuring the form unlocks
      setIsUploading(false);
    }
  };

  const handleInputChange = (e) => {
    setProfileData({
      ...profileData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      const config = {
        headers: {
          Authorization: `Bearer ${token}`
        }
      };

      await axios.put('/api/admin/profile', profileData, config);
      alert('Profile updated successfully!');
    } catch (error) {
      console.error("Update error:", error);
      alert('Failed to update profile. Ensure your session is valid.');
      if (error.response?.status === 401) {
        navigate('/admin');
      }
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  if (isLoading) {
    return <div style={{ textAlign: 'center', marginTop: '5rem', color: 'white' }}>Loading dashboard...</div>;
  }

  return (
    <main className="main" style={{ padding: '5rem 1rem', minHeight: '100vh', backgroundColor: 'var(--body-color)' }}>
      <div className="container" style={{ maxWidth: '800px', backgroundColor: 'var(--container-color)', padding: '2rem', borderRadius: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="section__title" style={{ marginBottom: 0 }}>Dashboard <span>Profile</span></h2>
          <button onClick={handleLogout} style={{ backgroundColor: 'var(--border-color)', color: 'white', padding: '0.5rem 1rem', borderRadius: '0.5rem', cursor: 'pointer' }}>
            Logout
          </button>
        </div>

        <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: 'var(--text-color)', fontSize: 'var(--small-font-size)', display: 'block', marginBottom: '0.5rem' }}>Full Name</label>
              <input
                type="text"
                name="fullName"
                value={profileData.fullName}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ color: 'var(--text-color)', fontSize: 'var(--small-font-size)', display: 'block', marginBottom: '0.5rem' }}>Job Title</label>
              <input
                type="text"
                name="jobTitle"
                value={profileData.jobTitle}
                onChange={handleInputChange}
                required
                style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <div>
            <label style={{ color: 'var(--text-color)', fontSize: 'var(--small-font-size)', display: 'block', marginBottom: '0.5rem' }}>Bio</label>
            <textarea
              name="bio"
              value={profileData.bio}
              onChange={handleInputChange}
              required
              rows="4"
              style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }}
            />
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: 'var(--text-color)', fontSize: 'var(--small-font-size)', display: 'block', marginBottom: '0.5rem' }}>GitHub URL</label>
              <input
                type="url"
                name="githubUrl"
                value={profileData.githubUrl}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ color: 'var(--text-color)', fontSize: 'var(--small-font-size)', display: 'block', marginBottom: '0.5rem' }}>LinkedIn URL</label>
              <input
                type="url"
                name="linkedinUrl"
                value={profileData.linkedinUrl}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          {/* Inside your profile form JSX */}
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Resume / CV (PDF)
            </label>
            <input 
              type="file" 
              accept=".pdf"
              onChange={(e) => handleFileUpload(e, 'resumeUrl')}
              disabled={isUploading}
              style={{ display: 'block', marginBottom: '0.5rem' }}
            />
            {/* Visual feedback for the user */}
            {isUploading && <span style={{ color: 'var(--first-color)' }}>Uploading to Cloudinary...</span>}
            {profileData.resumeUrl && (
              <p style={{ fontSize: '0.9rem' }}>
                Current: <a href={profileData.resumeUrl} target="_blank" rel="noreferrer" style={{ color: 'hsl(0, 0%, 40%)' }}>View Uploaded File</a>
              </p>
            )}
          </div>

          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '0.5rem', fontWeight: 'bold' }}>
              Hero Image (JPG/PNG)
            </label>
            <input 
              type="file" 
              accept="image/*"
              onChange={(e) => handleFileUpload(e, 'heroImageUrl')}
              disabled={isUploading}
              style={{ display: 'block', marginBottom: '0.5rem' }}
            />
            {isUploading && <span style={{ color: 'var(--first-color)' }}>Uploading to Cloudinary...</span>}
            {profileData.heroImageUrl && (
              <div style={{ marginTop: '0.5rem' }}>
                <p style={{ fontSize: '0.9rem', marginBottom: '0.25rem' }}>Current Image:</p>
                <img src={profileData.heroImageUrl} alt="Hero Preview" style={{ width: '150px', borderRadius: '0.5rem', border: '1px solid var(--border-color)' }} />
              </div>
            )}
          </div>

          {/* Make sure your submit button is also disabled during upload to prevent saving incomplete URLs! */}
          <button 
            type="submit" 
            disabled={isUploading}
            style={{ 
              backgroundColor: isUploading ? 'gray' : 'var(--first-color)', 
              color: 'var(--white-color)', 
              padding: '0.75rem 1.5rem', 
              border: 'none', 
              borderRadius: '0.5rem', 
              cursor: isUploading ? 'not-allowed' : 'pointer' 
            }}
          >
            {isUploading ? 'Uploading Media...' : 'Save Profile Changes'}
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminDashboard;