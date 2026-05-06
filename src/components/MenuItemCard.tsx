'use client';

import { useState } from 'react';
import Image from 'next/image';
import styles from '../app/menu/page.module.css';

interface MenuItemProps {
  item: {
    id: string;
    title: string;
    description: string;
    price: string;
    image?: string;
    addons?: { id: string, title: string, price: string }[];
  };
}

export default function MenuItemCard({ item }: MenuItemProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <>
      <div 
        className={styles.menuItem} 
        onClick={() => item.image && setIsOpen(true)} 
        style={{ cursor: item.image ? 'pointer' : 'default' }}
      >
        <div className={styles.mediaContainer}>
          {item.image ? (
            <Image 
              src={item.image} 
              alt={item.title} 
              fill 
              style={{ objectFit: 'cover' }} 
              className={styles.placeholderImage} 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          ) : (
            <Image 
              src="/placeholder.png" 
              alt={`${item.title} Coming Soon`} 
              fill 
              style={{ objectFit: 'cover' }} 
              className={styles.placeholderImage} 
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
          )}
        </div>
        <div className={styles.itemContent}>
          <div className={styles.itemHeader}>
            <h3 className={styles.itemTitle}>{item.title}</h3>
            <span className={styles.itemPrice}>{item.price}</span>
          </div>
          {item.description && <p className={styles.itemDescription}>{item.description}</p>}
          {item.addons && item.addons.length > 0 && (
            <div style={{ marginTop: '0.75rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.1)' }}>
              {item.addons.map(addon => (
                <div key={addon.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', color: 'rgba(255,255,255,0.7)', marginTop: '0.25rem' }}>
                  <span>+ {addon.title}</span>
                  <span>{addon.price}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {isOpen && item.image && (
        <div 
          style={{
            position: 'fixed',
            inset: 0,
            zIndex: 9999,
            backgroundColor: 'rgba(0, 0, 0, 0.85)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            padding: '2rem'
          }}
          onClick={(e) => {
            e.stopPropagation();
            setIsOpen(false);
          }}
        >
          <div style={{ position: 'relative', width: '100%', height: '100%', maxWidth: '800px', maxHeight: '800px' }}>
            <Image 
              src={item.image} 
              alt={item.title} 
              fill 
              style={{ objectFit: 'contain' }} 
              sizes="(max-width: 1200px) 100vw, 800px"
              priority
            />
          </div>
          <button 
            onClick={(e) => {
              e.stopPropagation();
              setIsOpen(false);
            }}
            style={{
              position: 'absolute',
              top: '20px',
              right: '20px',
              background: 'transparent',
              border: 'none',
              color: '#fff',
              fontSize: '3rem',
              cursor: 'pointer',
              lineHeight: 1
            }}
            aria-label="Close modal"
          >
            &times;
          </button>
        </div>
      )}
    </>
  );
}
