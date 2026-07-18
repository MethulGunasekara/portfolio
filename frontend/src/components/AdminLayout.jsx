import React from 'react';
import { Link, Outlet, useNavigate } from 'react-router-dom';

const AdminLayout = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem('adminToken');
    navigate('/admin');
  };

  return (
    <div style={{ display: 'flex', minHeight: '100vh', backgroundColor: 'var(--body-color)' }}>
      
      {/* 1. PERSISTENT SIDEBAR */}
      <aside style={{ width: '250px', backgroundColor: 'var(--container-color)', padding: '2rem 1rem', borderRight: '1px solid var(--border-color)', display: 'flex', flexDirection: 'column' }}>
        <h2 style={{ color: 'var(--first-color)', marginBottom: '3rem', textAlign: 'center', fontSize: 'var(--h2-font-size)' }}>
          CMS Admin
        </h2>
        
        <nav style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem', flex: 1 }}>
          <Link to="/admin/dashboard" style={{ color: 'var(--white-color)', textDecoration: 'none', fontWeight: 'bold' }}>Dashboard</Link>
          <Link to="/admin/projects" style={{ color: 'var(--white-color)', textDecoration: 'none', fontWeight: 'bold' }}>Manage Projects</Link>
          <Link to="/admin/skills" style={{ color: 'var(--white-color)', textDecoration: 'none', fontWeight: 'bold' }}>Manage Skills</Link>
          <Link to="/admin/messages" style={{ color: 'var(--white-color)', textDecoration: 'none', fontWeight: 'bold' }}>Inbox</Link>
        </nav>

        <button 
          onClick={handleLogout} 
          style={{ marginTop: 'auto', backgroundColor: 'transparent', color: 'hsl(0, 70%, 60%)', border: '1px solid hsl(0, 70%, 60%)', padding: '0.75rem', borderRadius: '0.5rem', cursor: 'pointer', fontWeight: 'bold' }}
        >
          Logout
        </button>
      </aside>

      {/* 2. DYNAMIC CONTENT AREA (The Outlet) */}
      <div style={{ flex: 1, height: '100vh', overflowY: 'auto' }}>
        <Outlet />
      </div>
      
    </div>
  );
};

export default AdminLayout;