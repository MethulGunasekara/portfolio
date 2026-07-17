import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminSkills = () => {
  const [skills, setSkills] = useState([]);
  const [formData, setFormData] = useState({
    name: '',
    category: 'Frontend', // Default based on your Enum
    iconClass: '',
    proficiency: ''
  });
  const [editingId, setEditingId] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchSkills();
  }, []);

  const fetchSkills = async () => {
    try {
      const res = await axios.get('/api/skills');
      setSkills(res.data);
    } catch (error) {
      console.error("Error fetching skills:", error);
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
      const config = { headers: { Authorization: `Bearer ${token}` } };

      if (editingId) {
        await axios.put(`/api/admin/skills/${editingId}`, formData, config);
        alert('Skill updated!');
      } else {
        await axios.post('/api/admin/skills', formData, config);
        alert('Skill added!');
      }

      setFormData({ name: '', category: 'Frontend', iconClass: '', proficiency: '' });
      setEditingId(null);
      fetchSkills();
    } catch (error) {
      console.error("Submission error:", error);
      alert('Failed to save skill. Ensure your session is valid.');
    }
  };

  const handleEdit = (skill) => {
    setEditingId(skill._id);
    setFormData({
      name: skill.name,
      category: skill.category,
      iconClass: skill.iconClass || '',
      proficiency: skill.proficiency || ''
    });
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this skill?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      await axios.delete(`/api/admin/skills/${id}`, config);
      fetchSkills();
    } catch (error) {
      console.error("Delete error:", error);
      alert('Failed to delete skill.');
    }
  };

  return (
    <main className="main" style={{ padding: '5rem 1rem', minHeight: '100vh', backgroundColor: 'var(--body-color)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="section__title" style={{ marginBottom: 0 }}>Manage <span>Skills</span></h2>
          <Link to="/admin/dashboard" style={{ color: 'var(--first-color)', textDecoration: 'underline' }}>Back to Dashboard</Link>
        </div>

        {/* Add/Edit Form */}
        <div style={{ backgroundColor: 'var(--container-color)', padding: '2rem', borderRadius: '1rem', marginBottom: '3rem' }}>
          <h3 style={{ marginBottom: '1.5rem', color: 'var(--white-color)' }}>{editingId ? 'Edit Skill' : 'Add New Skill'}</h3>
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="text" name="name" value={formData.name} onChange={handleInputChange} placeholder="Skill Name (e.g., React)" required style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }} />
              <select name="category" value={formData.category} onChange={handleInputChange} required style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }}>
                <option value="Frontend">Frontend</option>
                <option value="Backend">Backend</option>
                <option value="Tools">Tools</option>
                <option value="Design">Design</option>
              </select>
            </div>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
              <input type="text" name="iconClass" value={formData.iconClass} onChange={handleInputChange} placeholder="Remix Icon Class (e.g., ri-reactjs-line)" style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }} />
              <input type="number" name="proficiency" value={formData.proficiency} onChange={handleInputChange} placeholder="Proficiency (1-100)" min="1" max="100" style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--body-color)', color: 'white', border: '1px solid var(--border-color)' }} />
            </div>
            
            <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
              <button type="submit" className="nav__contact" style={{ cursor: 'pointer', border: 'none', flex: 1, justifyContent: 'center' }}>
                {editingId ? 'Update Skill' : 'Save Skill'}
              </button>
              {editingId && (
                <button type="button" onClick={() => { setEditingId(null); setFormData({ name: '', category: 'Frontend', iconClass: '', proficiency: '' }); }} style={{ cursor: 'pointer', border: '1px solid var(--border-color)', backgroundColor: 'transparent', color: 'white', flex: 1, borderRadius: '4rem' }}>
                  Cancel
                </button>
              )}
            </div>
          </form>
        </div>

        {/* List Skills */}
        <h3 style={{ marginBottom: '1.5rem', color: 'var(--white-color)' }}>Current Skills</h3>
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: '1rem' }}>
          {skills.map((skill) => (
            <div key={skill._id} style={{ backgroundColor: 'var(--container-color)', padding: '1.5rem', borderRadius: '1rem', textAlign: 'center' }}>
              <i className={skill.iconClass} style={{ fontSize: '2rem', color: 'var(--first-color)' }}></i>
              <h4 style={{ color: 'var(--white-color)', margin: '0.5rem 0' }}>{skill.name}</h4>
              <p style={{ fontSize: 'var(--smaller-font-size)', color: 'var(--text-color)', marginBottom: '1rem' }}>{skill.category} | {skill.proficiency}%</p>
              <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem' }}>
                <button onClick={() => handleEdit(skill)} style={{ backgroundColor: 'transparent', color: 'var(--white-color)', cursor: 'pointer', textDecoration: 'underline' }}>Edit</button>
                <button onClick={() => handleDelete(skill._id)} style={{ backgroundColor: 'transparent', color: 'hsl(0, 70%, 60%)', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
};

export default AdminSkills;