import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminProjects = () => {
  const [projects, setProjects] = useState([]);
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    technologies: '', 
    githubLink: '',
    liveLink: ''
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  // Fetch all projects on mount
  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const res = await axios.get('/api/projects');
      setProjects(res.data);
    } catch (error) {
      console.error("Error fetching projects:", error);
    }
  };

  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return navigate('/admin');

      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      // Convert comma-separated string back to an array for the backend
      const payload = {
        ...formData,
        technologies: formData.technologies.split(',').map(tech => tech.trim())
      };

      if (editingId) {
        // Update existing project
        await axios.put(`/api/admin/projects/${editingId}`, payload, config);
        alert('Project updated successfully!');
      } else {
        // Create new project
        await axios.post('/api/admin/projects', payload, config);
        alert('Project created successfully!');
      }

      // Reset form and refresh list
      setFormData({ title: '', description: '', technologies: '', githubLink: '', liveLink: '' });
      setEditingId(null);
      fetchProjects();

    } catch (error) {
      console.error("Submission error:", error);
      alert('Failed to save project. Ensure your session is valid.');
      if (error.response?.status === 401) navigate('/admin');
    }
  };

  const handleEdit = (project) => {
    setEditingId(project._id);
    setFormData({
      title: project.title,
      description: project.description,
      technologies: project.technologies.join(', '), // Convert array to comma string for the input
      githubLink: project.githubLink || '',
      liveLink: project.liveLink || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this project?")) return;

    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };

      await axios.delete(`/api/admin/projects/${id}`, config);
      fetchProjects();
    } catch (error) {
      console.error("Delete error:", error);
      alert('Failed to delete project.');
    }
  };

  return (
    <main className="main" style={{ padding: '5rem 1rem', minHeight: '100vh', backgroundColor: 'var(--body-color)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        {/* Navigation / Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="section__title" style={{ marginBottom: 0 }}>Manage <span>Projects</span></h2>
          <Link to="/admin/dashboard" style={{ color: 'var(--first-color)', textDecoration: 'underline' }}>
            Back to Dashboard
          </Link>
        </div>

        {/* Form Section: Add / Edit Project */}
        <div style={{ backgroundColor: 'var(--container-color)', padding: '2rem', borderRadius: '1rem', marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--white-color)' }}>
            {editingId ? 'Edit Project' : 'Add New Project'}
          </h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <input 
              type="text" 
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              placeholder="Project Title" 
              required
              style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }} 
            />
            
            <textarea 
              name="description"
              value={formData.description}
              onChange={handleInputChange}
              placeholder="Description" 
              rows="3" 
              required
              style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }}
            ></textarea>
            
            <input 
              type="text" 
              name="technologies"
              value={formData.technologies}
              onChange={handleInputChange}
              placeholder="Technologies (comma separated, e.g., React, Node, MongoDB)" 
              required
              style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }} 
            />
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input 
                type="url" 
                name="githubLink"
                value={formData.githubLink}
                onChange={handleInputChange}
                placeholder="GitHub Link" 
                style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }} 
              />
              <input 
                type="url" 
                name="liveLink"
                value={formData.liveLink}
                onChange={handleInputChange}
                placeholder="Live Link" 
                style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }} 
              />
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="nav__contact" style={{ cursor: 'pointer', border: 'none', flex: 1, justifyContent: 'center' }}>
                {editingId ? 'Update Project' : 'Save Project'}
              </button>
              {editingId && (
                <button 
                  type="button" 
                  onClick={() => {
                    setEditingId(null);
                    setFormData({ title: '', description: '', technologies: '', githubLink: '', liveLink: '' });
                  }} 
                  style={{ cursor: 'pointer', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'white', flex: 1, borderRadius: '4rem' }}
                >
                  Cancel Edit
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Section: Existing Projects */}
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--white-color)' }}>Current Projects</h3>
        <div style={{ display: 'grid', gap: '1rem' }}>
          {projects.length === 0 ? (
            <p style={{ color: 'var(--text-color)' }}>No projects found. Add one above.</p>
          ) : (
            projects.map((project) => (
              <div key={project._id} style={{ backgroundColor: 'var(--container-color)', padding: '1.5rem', borderRadius: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div>
                  <h4 style={{ color: 'var(--first-color)' }}>{project.title}</h4>
                  <p style={{ fontSize: 'var(--small-font-size)', color: 'var(--text-color)' }}>{project.technologies.join(', ')}</p>
                </div>
                <div style={{ display: 'flex', gap: '1rem' }}>
                  <button onClick={() => handleEdit(project)} style={{ backgroundColor: 'transparent', color: 'var(--white-color)', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                  <button onClick={() => handleDelete(project._id)} style={{ backgroundColor: 'transparent', color: 'hsl(0, 70%, 60%)', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </main>
  );
};

export default AdminProjects;