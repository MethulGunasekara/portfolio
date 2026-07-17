import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

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

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
            <div>
              <label style={{ color: 'var(--text-color)', fontSize: 'var(--small-font-size)', display: 'block', marginBottom: '0.5rem' }}>Resume URL (Cloudinary)</label>
              <input
                type="url"
                name="resumeUrl"
                value={profileData.resumeUrl}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }}
              />
            </div>
            <div>
              <label style={{ color: 'var(--text-color)', fontSize: 'var(--small-font-size)', display: 'block', marginBottom: '0.5rem' }}>Hero Image URL (Cloudinary)</label>
              <input
                type="url"
                name="heroImageUrl"
                value={profileData.heroImageUrl}
                onChange={handleInputChange}
                style={{ width: '100%', padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }}
              />
            </div>
          </div>

          <button type="submit" className="nav__contact" style={{ cursor: 'pointer', border: 'none', width: '100%', justifyContent: 'center', marginTop: '1rem' }}>
            Save Changes
          </button>
        </form>
      </div>
    </main>
  );
};

export default AdminDashboard;