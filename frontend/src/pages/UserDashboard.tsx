import React, { useState, useEffect } from 'react';
import { api } from '../services/api';
import { MagnifyingGlass } from '@phosphor-icons/react';
import StoreCard from '../components/StoreCard';

interface Store {
  id: string;
  name: string;
  address: string;
  averageRating: number;
  myRating: number | null;
}

const UserDashboard: React.FC = () => {
  const [stores, setStores] = useState<Store[]>([]);
  const [searchName, setSearchName] = useState('');
  const [searchAddress, setSearchAddress] = useState('');
  const [loading, setLoading] = useState(true);

  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [passwordData, setPasswordData] = useState({ oldPassword: '', newPassword: '' });

  const fetchStores = async () => {
    setLoading(true);
    try {
      const query = new URLSearchParams();
      if (searchName) query.append('name', searchName);
      if (searchAddress) query.append('address', searchAddress);

      const response = await api.get(`/stores?${query.toString()}`);
      if (response.data.success) {
        setStores(response.data.data);
      }
    } catch (error) {
      console.error('Error fetching stores', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStores();
  }, []);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchStores();
  };

  const submitRating = async (storeId: string, rating: number, isUpdate: boolean) => {
    try {
      if (isUpdate) {
        await api.put(`/ratings/${storeId}`, { rating });
      } else {
        await api.post('/ratings', { storeId, rating });
      }
      fetchStores(); 
    } catch (error) {
      console.error('Error submitting rating', error);
      alert('Failed to submit rating.');
    }
  };

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

  return (
    <div className="app-container">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
        <div>
          <h2>User Dashboard</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Discover and rate your favorite stores</p>
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

      <div className="glass" style={{ padding: '1.5rem', marginBottom: '2rem' }}>
        <form onSubmit={handleSearch} style={{ display: 'flex', gap: '1rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ flex: '1', minWidth: '200px', marginBottom: 0 }}>
            <label>Search by Name</label>
            <input 
              type="text" 
              placeholder="Store name..." 
              value={searchName} 
              onChange={(e) => setSearchName(e.target.value)} 
            />
          </div>
          <div className="form-group" style={{ flex: '1', minWidth: '200px', marginBottom: 0 }}>
            <label>Search by Address</label>
            <input 
              type="text" 
              placeholder="Store address..." 
              value={searchAddress} 
              onChange={(e) => setSearchAddress(e.target.value)} 
            />
          </div>
          <button type="submit" className="btn" style={{ height: '46px' }}>
            <MagnifyingGlass size={20} /> Search
          </button>
        </form>
      </div>

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading stores...</div>
      ) : stores.length === 0 ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>No stores found.</div>
      ) : (
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
          {stores.map((store) => (
            <StoreCard key={store.id} store={store} onRate={submitRating} />
          ))}
        </div>
      )}
    </div>
  );
};

export default UserDashboard;
