import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Users, Storefront, Star, Plus } from '@phosphor-icons/react';

const AdminDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'users' | 'stores' | 'add-user' | 'add-store'>('users');
  
  // Data States
  const [users, setUsers] = useState<any[]>([]);
  const [stores, setStores] = useState<any[]>([]);
  const [stats, setStats] = useState({ users: 0, stores: 0, ratings: 0 });
  const [loading, setLoading] = useState(true);

  // Filter States for Users
  const [userFilters, setUserFilters] = useState({ name: '', email: '', address: '', role: '' });

  // Form States
  const [newUser, setNewUser] = useState({ name: '', email: '', password: '', address: '', role: 'USER' });
  const [newStore, setNewStore] = useState({ name: '', email: '', address: '', ownerId: '' });

  const fetchData = async () => {
    setLoading(true);
    try {
      // Build query string for users
      const userQ = new URLSearchParams();
      if (userFilters.name) userQ.append('name', userFilters.name);
      if (userFilters.email) userQ.append('email', userFilters.email);
      if (userFilters.address) userQ.append('address', userFilters.address);
      if (userFilters.role) userQ.append('role', userFilters.role);

      const [usersRes, storesRes] = await Promise.all([
        api.get(`/users?${userQ.toString()}`),
        api.get('/stores')
      ]);

      setUsers(usersRes.data.data);
      setStores(storesRes.data.data);
      
      // Calculate ratings stats roughly (in a real app, backend should provide a stats endpoint)
      let totalRatings = 0;
      storesRes.data.data.forEach((s: any) => {
        // If the backend doesn't return total count, we might need a dedicated endpoint
        // For now, assume we just want to show something or we need a real stats endpoint
      });

      setStats({
        users: usersRes.data.meta.total,
        stores: storesRes.data.meta.total,
        ratings: 0 // Placeholder, we should ideally have a stats endpoint
      });
      
    } catch (error) {
      console.error('Error fetching admin data', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [userFilters]);

  const handleAddUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/users', newUser);
      alert('User added successfully');
      setNewUser({ name: '', email: '', password: '', address: '', role: 'USER' });
      setActiveTab('users');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add user');
    }
  };

  const handleAddStore = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.post('/stores', newStore);
      alert('Store added successfully');
      setNewStore({ name: '', email: '', address: '', ownerId: '' });
      setActiveTab('stores');
      fetchData();
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to add store');
    }
  };

  return (
    <div className="app-container">
      <div style={{ marginBottom: '2rem' }}>
        <h2>System Administrator</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage the platform and monitor activity</p>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(79, 70, 229, 0.2)', padding: '1rem', borderRadius: '50%', color: 'var(--primary-color)' }}>
            <Users size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.users}</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Users</span>
          </div>
        </div>
        <div className="glass" style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <div style={{ background: 'rgba(16, 185, 129, 0.2)', padding: '1rem', borderRadius: '50%', color: 'var(--success-color)' }}>
            <Storefront size={28} />
          </div>
          <div>
            <h3 style={{ margin: 0, fontSize: '1.5rem' }}>{stats.stores}</h3>
            <span style={{ color: 'var(--text-secondary)', fontSize: '0.875rem' }}>Total Stores</span>
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '1rem', marginBottom: '2rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
        <button className="btn" style={{ background: activeTab === 'users' ? 'var(--primary-color)' : 'transparent', border: activeTab === 'users' ? 'none' : '1px solid var(--border-color)' }} onClick={() => setActiveTab('users')}>Users</button>
        <button className="btn" style={{ background: activeTab === 'stores' ? 'var(--primary-color)' : 'transparent', border: activeTab === 'stores' ? 'none' : '1px solid var(--border-color)' }} onClick={() => setActiveTab('stores')}>Stores</button>
        <button className="btn" style={{ background: activeTab === 'add-user' ? 'var(--primary-color)' : 'transparent', border: activeTab === 'add-user' ? 'none' : '1px solid var(--border-color)' }} onClick={() => setActiveTab('add-user')}><Plus /> Add User</button>
        <button className="btn" style={{ background: activeTab === 'add-store' ? 'var(--primary-color)' : 'transparent', border: activeTab === 'add-store' ? 'none' : '1px solid var(--border-color)' }} onClick={() => setActiveTab('add-store')}><Plus /> Add Store</button>
      </div>

      <div className="glass" style={{ padding: '2rem' }}>
        {activeTab === 'users' && (
          <div>
            <div style={{ display: 'flex', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
              <input type="text" placeholder="Filter Name" value={userFilters.name} onChange={e => setUserFilters({...userFilters, name: e.target.value})} />
              <input type="text" placeholder="Filter Email" value={userFilters.email} onChange={e => setUserFilters({...userFilters, email: e.target.value})} />
              <input type="text" placeholder="Filter Address" value={userFilters.address} onChange={e => setUserFilters({...userFilters, address: e.target.value})} />
              <select value={userFilters.role} onChange={e => setUserFilters({...userFilters, role: e.target.value})}>
                <option value="">All Roles</option>
                <option value="ADMIN">Admin</option>
                <option value="USER">User</option>
                <option value="STORE_OWNER">Owner</option>
              </select>
            </div>
            
            <div className="table-container">
              <table>
                <thead><tr><th>ID</th><th>Name</th><th>Email</th><th>Address</th><th>Role</th></tr></thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id}>
                      <td style={{ fontSize: '0.75rem', fontFamily: 'monospace' }}>{u.id}</td>
                      <td>{u.name}</td>
                      <td>{u.email}</td>
                      <td>{u.address}</td>
                      <td>{u.role}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {activeTab === 'stores' && (
          <div className="table-container">
            <table>
              <thead><tr><th>Name</th><th>Email</th><th>Address</th><th>Owner</th><th>Rating</th></tr></thead>
              <tbody>
                {stores.map(s => (
                  <tr key={s.id}>
                    <td>{s.name}</td>
                    <td>{s.email}</td>
                    <td>{s.address}</td>
                    <td>{s.owner?.name}</td>
                    <td style={{ color: '#fbbf24', fontWeight: 'bold' }}><Star weight="fill" /> {s.averageRating}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {activeTab === 'add-user' && (
          <form onSubmit={handleAddUser} style={{ maxWidth: '500px' }}>
            <h3>Add New User</h3>
            <div className="form-group">
              <label>Name</label>
              <input type="text" value={newUser.name} onChange={e => setNewUser({...newUser, name: e.target.value})} required minLength={20} maxLength={60} />
            </div>
            <div className="form-group">
              <label>Email</label>
              <input type="email" value={newUser.email} onChange={e => setNewUser({...newUser, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Password</label>
              <input type="password" value={newUser.password} onChange={e => setNewUser({...newUser, password: e.target.value})} required minLength={8} maxLength={16} />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" value={newUser.address} onChange={e => setNewUser({...newUser, address: e.target.value})} required maxLength={400} />
            </div>
            <div className="form-group">
              <label>Role</label>
              <select value={newUser.role} onChange={e => setNewUser({...newUser, role: e.target.value})}>
                <option value="USER">Normal User</option>
                <option value="STORE_OWNER">Store Owner</option>
                <option value="ADMIN">System Administrator</option>
              </select>
            </div>
            <button type="submit" className="btn">Create User</button>
          </form>
        )}

        {activeTab === 'add-store' && (
          <form onSubmit={handleAddStore} style={{ maxWidth: '500px' }}>
            <h3>Add New Store</h3>
            <div className="form-group">
              <label>Store Name</label>
              <input type="text" value={newStore.name} onChange={e => setNewStore({...newStore, name: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Store Email</label>
              <input type="email" value={newStore.email} onChange={e => setNewStore({...newStore, email: e.target.value})} required />
            </div>
            <div className="form-group">
              <label>Address</label>
              <input type="text" value={newStore.address} onChange={e => setNewStore({...newStore, address: e.target.value})} required maxLength={400} />
            </div>
            <div className="form-group">
              <label>Owner ID (Must be a STORE_OWNER role)</label>
              <input type="text" value={newStore.ownerId} onChange={e => setNewStore({...newStore, ownerId: e.target.value})} required />
            </div>
            <button type="submit" className="btn">Create Store</button>
          </form>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
