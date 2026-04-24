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

  useEffect(() => {
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

    fetchDashboardData();
  }, []);

  return (
    <div className="app-container">
      <div style={{ marginBottom: '2rem' }}>
        <h2>Owner Dashboard</h2>
        <p style={{ color: 'var(--text-secondary)' }}>Manage your stores and view ratings</p>
      </div>

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
                        <th>Name</th>
                        <th>Email</th>
                        <th>Rating Given</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {store.raters.map((rater) => (
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
