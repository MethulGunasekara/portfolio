import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';

const AdminMessages = () => {
  const [messages, setMessages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    fetchMessages();
  }, []);

  const fetchMessages = async () => {
    try {
      const token = localStorage.getItem('adminToken');
      if (!token) return navigate('/admin');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      const res = await axios.get('/api/messages', config);
      setMessages(res.data);
    } catch (error) {
      console.error("Error fetching messages:", error);
      if (error.response?.status === 401) navigate('/admin');
    }
  };

  const updateStatus = async (id, newStatus) => {
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.put(`/api/messages/${id}`, { status: newStatus }, config);
      fetchMessages(); // Refresh UI
    } catch (error) {
      console.error("Error updating status:", error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Permanently delete this message?")) return;
    try {
      const token = localStorage.getItem('adminToken');
      const config = { headers: { Authorization: `Bearer ${token}` } };
      
      await axios.delete(`/api/messages/${id}`, config);
      fetchMessages();
    } catch (error) {
      console.error("Error deleting message:", error);
    }
  };

  return (
    <main className="main" style={{ padding: '5rem 1rem', minHeight: '100vh', backgroundColor: 'var(--body-color)' }}>
      <div className="container" style={{ maxWidth: '900px' }}>
        
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h2 className="section__title" style={{ marginBottom: 0 }}>Inbox <span>Messages</span></h2>
          <Link to="/admin/dashboard" style={{ color: 'var(--first-color)', textDecoration: 'underline' }}>Back to Dashboard</Link>
        </div>

        <div style={{ display: 'grid', gap: '1rem' }}>
          {messages.length === 0 ? (
            <p style={{ color: 'var(--text-color)', textAlign: 'center' }}>Your inbox is empty.</p>
          ) : (
            messages.map((msg) => (
              <div key={msg._id} style={{ 
                backgroundColor: 'var(--container-color)', 
                padding: '1.5rem', 
                borderRadius: '1rem',
                borderLeft: msg.status === 'Unread' ? '4px solid var(--first-color)' : '4px solid var(--border-color)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1rem' }}>
                  <div>
                    <h4 style={{ color: 'var(--white-color)', marginBottom: '0.25rem' }}>{msg.senderName}</h4>
                    <a href={`mailto:${msg.senderEmail}`} style={{ fontSize: 'var(--small-font-size)', color: 'var(--first-color)' }}>{msg.senderEmail}</a>
                  </div>
                  <span style={{ fontSize: 'var(--smaller-font-size)', color: 'var(--text-color)' }}>
                    {new Date(msg.createdAt).toLocaleDateString()}
                  </span>
                </div>
                
                <p style={{ color: 'var(--text-color)', marginBottom: '1.5rem', whiteSpace: 'pre-wrap' }}>
                  {msg.messageBody}
                </p>

                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <span style={{ fontSize: 'var(--smaller-font-size)', color: 'var(--white-color)', backgroundColor: 'var(--body-color)', padding: '0.25rem 0.75rem', borderRadius: '1rem' }}>
                    Status: {msg.status}
                  </span>
                  
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    {msg.status !== 'Read' && (
                      <button onClick={() => updateStatus(msg._id, 'Read')} style={{ backgroundColor: 'transparent', color: 'var(--white-color)', cursor: 'pointer', textDecoration: 'underline' }}>Mark Read</button>
                    )}
                    {msg.status !== 'Archived' && (
                      <button onClick={() => updateStatus(msg._id, 'Archived')} style={{ backgroundColor: 'transparent', color: 'var(--white-color)', cursor: 'pointer', textDecoration: 'underline' }}>Archive</button>
                    )}
                    <button onClick={() => handleDelete(msg._id)} style={{ backgroundColor: 'transparent', color: 'hsl(0, 70%, 60%)', cursor: 'pointer', textDecoration: 'underline' }}>Delete</button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </main>
  );
};

export default AdminMessages;