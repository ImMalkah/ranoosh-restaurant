'use client';

import { useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import styles from '../app/menu/page.module.css';

interface CateringItemProps {
  item: {
    id: string;
    title: string;
    description: string | null;
    image_url: string | null;
  };
}

export default function CateringItemCard({ item }: CateringItemProps) {
  const [showOptions, setShowOptions] = useState(false);
  const [showEmailForm, setShowEmailForm] = useState(false);

  const [email, setEmail] = useState('');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const handleEmailSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    try {
      const res = await fetch('/api/inquiries', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          itemTitle: item.title,
          userEmail: email,
          notes: notes
        })
      });
      if (!res.ok) throw new Error('Failed to submit inquiry');
      setSubmitted(true);
    } catch (err) {
      console.error(err);
      alert('There was an error submitting your inquiry. Please try again.');
    }
    setIsSubmitting(false);
  };

  return (
    <>
      <div className={styles.menuItem}>
        <div className={styles.mediaContainer}>
          {item.image_url ? (
            <Image
              src={item.image_url}
              alt={item.title}
              fill
              style={{ objectFit: 'contain', padding: '1rem' }}
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
          </div>
          {item.description && <p className={styles.itemDescription}>{item.description}</p>}
          <button
            onClick={() => setShowOptions(true)}
            style={{
              marginTop: '1rem',
              padding: '0.5rem 1rem',
              background: 'var(--primary-gold)',
              color: 'black',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
              fontWeight: 'bold',
              width: '100%'
            }}
          >
            Contact Us
          </button>
        </div>
      </div>

      {showOptions && (
        <div style={{ position: 'fixed', inset: 0, zIndex: 9999, backgroundColor: 'rgba(0, 0, 0, 0.85)', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem' }} onClick={() => setShowOptions(false)}>
          <div style={{ background: 'var(--panel-bg)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px', position: 'relative' }} onClick={e => e.stopPropagation()}>
            <button onClick={() => setShowOptions(false)} style={{ position: 'absolute', top: '15px', right: '15px', background: 'transparent', border: 'none', color: 'white', fontSize: '1.5rem', cursor: 'pointer' }}>&times;</button>
            <h3 style={{ color: 'var(--primary-gold)', marginBottom: '1.5rem' }}>Inquire about {item.title}</h3>

            {!showEmailForm ? (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <a href="tel:+19052966962" style={{ display: 'block', padding: '1rem', background: 'rgba(255,255,255,0.05)', color: 'white', textAlign: 'center', borderRadius: '8px', textDecoration: 'none' }}>📞 Call Us: (905) 296-6962</a>
                <Link href="/#about" onClick={() => setShowOptions(false)} style={{ display: 'block', padding: '1rem', background: 'rgba(255,255,255,0.05)', color: 'white', textAlign: 'center', borderRadius: '8px', textDecoration: 'none' }}>📍 Visit Our Location</Link>
                <button onClick={() => setShowEmailForm(true)} style={{ padding: '1rem', background: 'var(--primary-gold)', color: 'black', border: 'none', borderRadius: '8px', cursor: 'pointer', fontSize: '1rem', fontWeight: 'bold' }}>✉️ Email Us</button>
              </div>
            ) : submitted ? (
              <div style={{ textAlign: 'center', color: 'white' }}>
                <p style={{ fontSize: '1.2rem', color: 'var(--primary-gold)', marginBottom: '1rem' }}>Thank you!</p>
                <p>Your inquiry has been sent to our managers. We will get back to you shortly.</p>
                <button onClick={() => setShowOptions(false)} style={{ marginTop: '2rem', padding: '0.5rem 1rem', background: 'rgba(255,255,255,0.1)', color: 'white', border: 'none', borderRadius: '4px', cursor: 'pointer' }}>Close</button>
              </div>
            ) : (
              <form onSubmit={handleEmailSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>Your Email</label>
                  <input type="email" required value={email} onChange={e => setEmail(e.target.value)} style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white' }} />
                </div>
                <div>
                  <label style={{ display: 'block', color: 'rgba(255,255,255,0.8)', marginBottom: '0.5rem' }}>Additional Notes</label>
                  <textarea rows={4} value={notes} onChange={e => setNotes(e.target.value)} placeholder="Please include party size, date, or specific requests." style={{ width: '100%', padding: '0.75rem', background: 'rgba(255,255,255,0.05)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: '6px', color: 'white', fontFamily: 'inherit' }}></textarea>
                </div>
                <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                  <button type="button" onClick={() => setShowEmailForm(false)} style={{ flex: 1, padding: '0.75rem', background: 'transparent', color: 'white', border: '1px solid rgba(255,255,255,0.2)', borderRadius: '6px', cursor: 'pointer' }}>Back</button>
                  <button type="submit" disabled={isSubmitting} style={{ flex: 1, padding: '0.75rem', background: 'var(--primary-gold)', color: 'black', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: 'bold' }}>{isSubmitting ? 'Sending...' : 'Send Inquiry'}</button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}
