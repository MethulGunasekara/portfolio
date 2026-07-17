import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const AdminLogin = () => {
  // 1. STATE
  const [credentials, setCredentials] = useState({
    email: '',
    password: ''
  });
  
  // React Router hook for redirecting after successful login
  const navigate = useNavigate();

  // 2. HANDLERS
  const handleInputChange = (e) => {
    setCredentials({
      ...credentials,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault(); 
    try {
      // Send credentials to your Express backend
      const res = await axios.post('/api/admin/login', credentials);
      
      // 3. AUTHENTICATION (The "Why" for interviews)
      // When the backend verifies the password, it sends back a JWT (JSON Web Token).
      // We store it in localStorage so it persists even if you refresh the page.
      // We will attach this token to the headers of all future /api/admin requests.
      localStorage.setItem('adminToken', res.data.token);
      
      alert('Login successful!');
      
      // Redirect the user to the dashboard
      navigate('/admin/dashboard');
    } catch (error) {
      console.error("Login error:", error);
      // Display the error message sent from your backend (e.g., "Invalid email or password")
      alert(error.response?.data?.message || 'Login failed. Check credentials.');
    }
  };

  // 4. RETURN JSX
  return (
    <main className="main" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <section className="section" style={{ width: '100%', maxWidth: '400px' }}>
        <div className="container">
          <h2 className="section__title" style={{ marginBottom: '1rem' }}>Admin <span>Login</span></h2>
          <p style={{ textAlign: 'center', marginBottom: '2rem', color: 'var(--text-color)' }}>Secure access for portfolio management.</p>

          <form 
            className="contact__form" 
            onSubmit={handleSubmit} 
            style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}
          >
            <input
              type="email"
              name="email"
              value={credentials.email}
              onChange={handleInputChange}
              placeholder="Admin Email"
              required
              style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--container-color)', color: 'white' }}
            />
            <input
              type="password"
              name="password"
              value={credentials.password}
              onChange={handleInputChange}
              placeholder="Password"
              required
              style={{ padding: '1rem', borderRadius: '0.5rem', backgroundColor: 'var(--container-color)', color: 'white' }}
            />
            <button type="submit" className="nav__contact" style={{ cursor: 'pointer', border: 'none', width: '100%', justifyContent: 'center' }}>
              Login
            </button>
          </form>
        </div>
      </section>
    </main>
  );
};

export default AdminLogin;