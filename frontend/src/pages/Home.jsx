import React, { useState, useEffect } from 'react';
import axios from 'axios';

const Home = () => {
  // --- 1. STATE ---
  const [profile, setProfile] = useState(null);
  const [projects, setProjects] = useState([]);
  const [skills, setSkills] = useState([]);

  const [formData, setFormData] = useState({
    senderName: '',
    senderEmail: '',
    messageBody: ''
  });

  // --- 2. HANDLERS & EFFECTS ---
  const handleInputChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [profileRes, projectsRes, skillsRes] = await Promise.all([
          axios.get('/api/profile'),
          axios.get('/api/projects'),
          axios.get('/api/skills')
        ]);

        setProfile(profileRes.data);
        setProjects(projectsRes.data);
        setSkills(skillsRes.data);
      } catch (error) {
        console.error("Error fetching portfolio data:", error);
      }
    };

    fetchData();
  }, []); 

  const handleSubmit = async (e) => {
    e.preventDefault(); 

    try {
      await axios.post('/api/messages', formData);
      
      setFormData({
        senderName: '',
        senderEmail: '',
        messageBody: ''
      });
      
      alert("Message sent successfully!"); 
    } catch (error) {
      console.error("Error sending message:", error);
      alert("Failed to send message. Please try again.");
    }
  };

  // --- 3. RETURN JSX ---
  return (
    <>
      {/* HEADER */}
      <header className="header" id="header">
        <nav className="nav container">
          <a href="#" className="nav__logo">Methul.</a>
          <div className="nav__menu" id="nav-menu">
            <ul className="nav__list">
              <li><a href="#home" className="nav__link">Home</a></li>
              <li><a href="#work" className="nav__link">Projects</a></li>
              <li><a href="#skills" className="nav__link">Skills</a></li>
              <li><a href="#contact" className="nav__link">Contact</a></li>
            </ul>
            <div className="nav__close" id="nav-close">
              <i className="ri-close-line"></i>
            </div>
          </div>
          <div className="nav__toggle" id="nav-toggle">
            <i className="ri-menu-line"></i>
          </div>
        </nav>
      </header>

      {/* MAIN CONTENT */}
      <main className="main">
        {/* HOME / HERO SECTION */}
        <section className="section" id="home">
          <div className="container grid">
            <h1 className="section__title">
              {profile ? profile.fullName : 'Loading Profile...'}
            </h1>
            <p style={{ textAlign: 'center', fontSize: 'var(--h3-font-size)' }}>
              {profile ? profile.jobTitle : ''}
            </p>
            {profile?.bio && <p style={{ textAlign: 'center', marginTop: '1rem', maxWidth: '600px', marginInline: 'auto' }}>{profile.bio}</p>}
          </div>
        </section>

        {/* PROJECTS SECTION */}
        <section className="section" id="work">
          <h2 className="section__title">My <span>Projects</span></h2>
          <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2rem' }}>
             {projects.length > 0 ? (
               projects.map((project) => (
                 <div key={project._id} style={{ backgroundColor: 'var(--container-color)', padding: '1.5rem', borderRadius: '1rem' }}>
                    <h3 style={{ marginBottom: '0.5rem' }}>{project.title}</h3>
                    <p style={{ fontSize: 'var(--small-font-size)', marginBottom: '1rem' }}>{project.description}</p>
                    <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                      {project.technologies.map((tech, index) => (
                        <span key={index} style={{ backgroundColor: 'var(--first-color)', color: 'var(--black-color)', padding: '0.25rem 0.5rem', borderRadius: '0.25rem', fontSize: 'var(--smaller-font-size)', fontWeight: 'bold' }}>
                          {tech}
                        </span>
                      ))}
                    </div>
                 </div>
               ))
             ) : (
               <p style={{ textAlign: 'center' }}>Loading projects...</p>
             )}
          </div>
        </section>

        {/* SKILLS SECTION */}
        <section className="section" id="skills">
          <h2 className="section__title">My <span>Skills</span></h2>
          <div className="container grid" style={{ gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))', gap: '2rem', textAlign: 'center' }}>
            {skills.length > 0 ? (
              skills.map((skill) => (
                <div key={skill._id} style={{ backgroundColor: 'var(--container-color)', padding: '1.5rem', borderRadius: '1rem' }}>
                  <i className={skill.iconClass} style={{ fontSize: '2.5rem', color: 'var(--first-color)' }}></i>
                  <h3 style={{ marginTop: '1rem' }}>{skill.name}</h3>
                  <p style={{ fontSize: 'var(--smaller-font-size)', color: 'var(--text-color)' }}>{skill.category}</p>
                </div>
              ))
            ) : (
              <p style={{ textAlign: 'center' }}>Loading skills...</p>
            )}
          </div>
        </section>

        {/* CONTACT SECTION */}
        <section className="section" id="contact">
          <h2 className="section__title">Contact <span>Me</span></h2>
          <div className="container grid" style={{ display: 'flex', justifyContent: 'center' }}>
            <form 
              className="contact__form" 
              onSubmit={handleSubmit} 
              style={{ display: 'flex', flexDirection: 'column', gap: '1rem', width: '100%', maxWidth: '500px' }}
            >
               <input 
                 type="text" 
                 name="senderName"
                 value={formData.senderName}
                 onChange={handleInputChange}
                 placeholder="Name" 
                 style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--container-color)', color: 'white' }} 
               />
               <input 
                 type="email" 
                 name="senderEmail"
                 value={formData.senderEmail}
                 onChange={handleInputChange}
                 placeholder="Email" 
                 style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--container-color)', color: 'white' }} 
               />
               <textarea 
                 name="messageBody"
                 value={formData.messageBody}
                 onChange={handleInputChange}
                 placeholder="Message" 
                 rows="5" 
                 style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--container-color)', color: 'white' }}
               ></textarea>
               <button type="submit" className="nav__contact" style={{ cursor: 'pointer', border: 'none' }}>Send Message</button>
            </form>
          </div>
        </section>
      </main>
    </>
  );
};

export default Home;