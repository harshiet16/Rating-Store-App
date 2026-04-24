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
      fetchStores(); // Refresh to get updated ratings
    } catch (error) {
      console.error('Error submitting rating', error);
      alert('Failed to submit rating.');
    }
  };

  return (
    <div className="app-container">
      <div style={{ marginBottom: '2rem' }}>
        <h2>User Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Discover and rate your favorite stores</p>
      </div>

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
