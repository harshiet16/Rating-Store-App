import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { Storefront, Users } from '@phosphor-icons/react';

interface Rater {
  ratingId: string;
  rating: number;
  date: string;
  user: {
    id: string;
    name: string;
    email: string;
  };
}

interface StoreData {
  id: string;
  name: string;
  averageRating: number;
  raters: Rater[];
}

const OwnerDashboard: React.FC = () => {
  const [stores, setStores] = useState<StoreData[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });
  
  const [sortConfig, setSortConfig] = useState<{ field: string, order: 'asc' | 'desc' }>({ field: 'date', order: 'desc' });

  const fetchDashboardData = async () => {
    try {
      const response = await api.get('/stores/owner-dashboard');
      if (response.data.success) {
        setStores(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching owner dashboard', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const handleUpdatePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.put('/users/password', passwordData);
      alert('Password updated successfully');
      setShowPasswordModal(false);
      setPasswordData({ oldPassword: '', newPassword: '' });
    } catch (err: any) {
      alert(err.response?.data?.message || 'Failed to update password');
    }
  };

  const toggleSort = (field: string) => {
    setSortConfig(prev => ({
      field,
      order: prev.field === field && prev.order === 'asc' ? 'desc' : 'asc'
    }));
  };

  const getSortedRaters = (raters: Rater[]) => {
    return [...raters].sort((a, b) => {
      let valA: any, valB: any;
      if (sortConfig.field === 'name') {
        valA = a.user.name;
        valB = b.user.name;
      } else if (sortConfig.field === 'email') {
        valA = a.user.email;
        valB = b.user.email;
      } else if (sortConfig.field === 'rating') {
        valA = a.rating;
        valB = b.rating;
      } else {
        valA = new Date(a.date).getTime();
        valB = new Date(b.date).getTime();
      }

      if (valA < valB) return sortConfig.order === 'asc' ? -1 : 1;
      if (valA > valB) return sortConfig.order === 'asc' ? 1 : -1;
      return 0;
    });
  };

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2>Owner Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage your stores and view ratings</p>
        </div>
        <button className="btn-secondary" onClick={() => setShowPasswordModal(true)}>Change Password</button>
      </div>

      {showPasswordModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, background: 'rgba(0,0,0,0.8)', display: 'flex', justifyContent: 'center', alignItems: 'center', zIndex: 1000 }}>
          <div className="glass" style={{ padding: '2rem', width: '100%', maxWidth: '400px' }}>
            <h3>Update Password</h3>
            <form onSubmit={handleUpdatePassword}>
              <div className="form-group">
                <label>Current Password</label>
                <input type="password" value={passwordData.oldPassword} onChange={e => setPasswordData({...passwordData, oldPassword: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>New Password</label>
                <input type="password" value={passwordData.newPassword} onChange={e => setPasswordData({...passwordData, newPassword: e.target.value})} required minLength={8} maxLength={16} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
                <button type="submit" className="btn" style={{ flex: 1 }}>Update</button>
                <button type="button" className="btn-secondary" style={{ flex: 1 }} onClick={() => setShowPasswordModal(false)}>Cancel</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {loading ? (
        <div style={{ textAlign: 'center', padding: '2rem' }}>Loading dashboard...</div>
      ) : stores.length === 0 ? (
        <div className="glass" style={{ padding: '3rem', textAlign: 'center' }}>
          <Storefront size={48} color="var(--text-secondary)" style={{ marginBottom: '1rem' }} />
          <h3>No Stores Found</h3>
          <p style={{ color: 'var(--text-secondary)' }}>You don't have any stores registered under your account yet.</p>
        </div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {stores.map((store) => (
            <div key={store.id} className="glass" style={{ padding: '2rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Storefront color="var(--primary-color)" /> {store.name}
                </h3>
                <div style={{ textAlign: 'right' }}>
                  <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>Average Rating</span>
                  <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#fbbf24' }}>
                    {store.averageRating} / 5.0
                  </div>
                </div>
              </div>

              <h4 style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                <Users /> Users who rated this store ({store.raters.length})
              </h4>
              
              <div className="table-container" style={{ border: '1px solid var(--border-color)', borderRadius: 'var(--radius)' }}>
                {store.raters.length === 0 ? (
                  <div style={{ padding: '1rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
                    No ratings yet.
                  </div>
                ) : (
                  <table>
                    <thead>
                      <tr>
                        <th onClick={() => toggleSort('name')} style={{ cursor: 'pointer' }}>Name {sortConfig.field === 'name' && (sortConfig.order === 'asc' ? '↑' : '↓')}</th>
                        <th onClick={() => toggleSort('email')} style={{ cursor: 'pointer' }}>Email {sortConfig.field === 'email' && (sortConfig.order === 'asc' ? '↑' : '↓')}</th>
                        <th onClick={() => toggleSort('rating')} style={{ cursor: 'pointer' }}>Rating Given {sortConfig.field === 'rating' && (sortConfig.order === 'asc' ? '↑' : '↓')}</th>
                        <th onClick={() => toggleSort('date')} style={{ cursor: 'pointer' }}>Date {sortConfig.field === 'date' && (sortConfig.order === 'asc' ? '↑' : '↓')}</th>
                      </tr>
                    </thead>
                    <tbody>
                      {getSortedRaters(store.raters).map((rater) => (
                        <tr key={rater.ratingId}>
                          <td>{rater.user.name}</td>
                          <td style={{ color: 'var(--text-secondary)' }}>{rater.user.email}</td>
                          <td style={{ fontWeight: 'bold', color: '#fbbf24' }}>{rater.rating}</td>
                          <td style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
                            {new Date(rater.date).toLocaleDateString()}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default OwnerDashboard;
