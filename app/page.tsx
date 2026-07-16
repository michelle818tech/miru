'use client';

import { useState } from 'react';

export default function KPIApp() {
  const [user, setUser] = useState(null);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = (e) => {
    e.preventDefault();
    setUser({ email, role: 'manager' });
  };

  if (user?.role === 'manager') {
    return (
      <div style={{ padding: '2rem', fontFamily: 'system-ui' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
          <h1>Mirus KPI Tracker</h1>
          <button onClick={() => setUser(null)} style={{ padding: '8px 16px' }}>Logout</button>
        </div>

        <div style={{ maxWidth: '700px' }}>
          <div style={{ background: '#f5f5f5', padding: '1.5rem', borderRadius: '8px', marginBottom: '2rem' }}>
            <h3>Your Weekly Metrics</h3>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '14px' }}>
              <div>Sales: ₮1,234,567 ↑12%</div>
              <div>Transactions: 156</div>
              <div>Avg Value: ₮7,908</div>
              <div>Bundle Rate: 45%</div>
              <div>Refund Rate: 2%</div>
              <div>Top: Anua, Black Rouge</div>
            </div>
          </div>

          <div style={{ background: 'white', border: '1px solid #ddd', padding: '1.5rem', borderRadius: '8px' }}>
            <h3>Weekly Reflection - Week 1</h3>
            <form onSubmit={(e) => { e.preventDefault(); alert('✓ Submitted!'); }}>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Which products did you focus on?</label>
                <textarea placeholder="List specific product names with numbers..." style={{ width: '100%', height: '100px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'system-ui' }} />
              </div>
              <div style={{ marginBottom: '1rem' }}>
                <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>What actions did you take?</label>
                <textarea placeholder="Describe specific actions with dates and numbers..." style={{ width: '100%', height: '100px', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', fontFamily: 'system-ui' }} />
              </div>
              <button type="submit" style={{ width: '100%', padding: '12px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500 }}>
                Submit Weekly Log
              </button>
            </form>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', background: '#f5f5f5', fontFamily: 'system-ui' }}>
      <div style={{ width: '100%', maxWidth: '400px', background: 'white', padding: '2rem', borderRadius: '8px', boxShadow: '0 2px 8px rgba(0,0,0,0.1)' }}>
        <h1 style={{ textAlign: 'center', marginBottom: '2rem' }}>Mirus KPI Tracker</h1>
        <form onSubmit={handleLogin}>
          <div style={{ marginBottom: '1rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Email</label>
            <input 
              type="email" 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              placeholder="tsogzolmaa@mirus.mn" 
              required 
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} 
            />
          </div>
          <div style={{ marginBottom: '1.5rem' }}>
            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 500 }}>Password</label>
            <input 
              type="password" 
              value={password} 
              onChange={(e) => setPassword(e.target.value)} 
              placeholder="••••••••" 
              required 
              style={{ width: '100%', padding: '8px', border: '1px solid #ddd', borderRadius: '4px', boxSizing: 'border-box' }} 
            />
          </div>
          <button 
            type="submit" 
            style={{ width: '100%', padding: '12px', background: '#0066cc', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer', fontWeight: 500, marginBottom: '1rem' }}
          >
            Login
          </button>
        </form>
        <div style={{ fontSize: '13px', color: '#666', marginTop: '1rem', padding: '1rem', background: '#f9f9f9', borderRadius: '4px' }}>
          <strong>Test Accounts:</strong><br/>
          Manager: tsogzolmaa@mirus.mn / password123<br/>
          HR: hr@mirus.mn / password123<br/>
          Admin: michelle@mirus.mn / password123
        </div>
      </div>
    </div>
  );
}
