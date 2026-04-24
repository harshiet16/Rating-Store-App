import React from 'react';
import { Star } from '@phosphor-icons/react';
import RatingStars from './RatingStars';

interface Store {
  id: string;
  name: string;
  address: string;
  averageRating: number;
  myRating: number | null;
}

interface StoreCardProps {
  store: Store;
  onRate: (storeId: string, rating: number, isUpdate: boolean) => void;
}

const StoreCard: React.FC<StoreCardProps> = ({ store, onRate }) => {
  return (
    <div className="glass" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <div>
          <h3 style={{ margin: 0, marginBottom: '0.25rem' }}>{store.name}</h3>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.875rem', margin: 0 }}>{store.address}</p>
        </div>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: '#fbbf24', fontWeight: 'bold' }}>
          <Star weight="fill" /> {store.averageRating || 'N/A'}
        </div>
      </div>
      
      <div style={{ marginTop: 'auto', borderTop: '1px solid var(--border-color)', paddingTop: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <span style={{ fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          {store.myRating ? 'Your Rating:' : 'Rate this store:'}
        </span>
        <RatingStars 
          rating={store.myRating} 
          interactive={true} 
          onRate={(rating) => onRate(store.id, rating, store.myRating !== null)} 
        />
      </div>
    </div>
  );
};

export default StoreCard;
