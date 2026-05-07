'use client';

import { useState } from 'react';
import { createClient } from '@/utils/supabase/client';
import styles from './page.module.css';

export default function ContactPage() {
  const [email, setEmail] = useState('');
  const [inquiryType, setInquiryType] = useState('Catering Inquiry');
  const [notes, setNotes] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [errorMsg, setErrorMsg] = useState('');

  const supabase = createClient();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg('');

    const { error } = await supabase.from('inquiries').insert({
      user_email: email,
      item_title: inquiryType,
      notes: notes,
      status: 'pending'
    });

    setIsSubmitting(false);

    if (error) {
      setErrorMsg('Failed to send inquiry. Please try again later.');
      console.error(error);
    } else {
      setIsSuccess(true);
    }
  };

  return (
    <main className={styles.container}>
      <div className={styles.header}>
        <h1 className={styles.title}>Contact Us</h1>
        <p className={styles.subtitle}>Have a question or want to book catering? We'd love to hear from you.</p>
      </div>

      {isSuccess ? (
        <div className={styles.successMessage}>
          <span className={styles.successIcon}>✨</span>
          <h2 className={styles.successTitle}>Message Received</h2>
          <p className={styles.successText}>Thank you for reaching out! Our team will get back to you at <strong>{email}</strong> as soon as possible.</p>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className={styles.form}>
          {errorMsg && <div style={{ color: '#ef4444', background: 'rgba(239, 68, 68, 0.1)', padding: '1rem', borderRadius: '8px', border: '1px solid #ef4444', marginBottom: '1rem' }}>{errorMsg}</div>}
          
          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="email">Email Address</label>
            <input 
              type="email" 
              id="email"
              required 
              value={email} 
              onChange={(e) => setEmail(e.target.value)} 
              className={styles.input}
              placeholder="you@example.com"
            />
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="type">Inquiry Type</label>
            <select 
              id="type"
              value={inquiryType} 
              onChange={(e) => setInquiryType(e.target.value)} 
              className={styles.input}
            >
              <option value="Catering Inquiry">Catering Inquiry</option>
              <option value="General Question">General Question</option>
              <option value="Reservation Request">Reservation Request</option>
              <option value="Feedback">Feedback</option>
            </select>
          </div>

          <div className={styles.formGroup}>
            <label className={styles.label} htmlFor="notes">Message</label>
            <textarea 
              id="notes"
              required 
              value={notes} 
              onChange={(e) => setNotes(e.target.value)} 
              className={styles.textarea}
              placeholder="How can we help you?"
            />
          </div>

          <button type="submit" disabled={isSubmitting} className={styles.submitBtn}>
            {isSubmitting ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      )}
    </main>
  );
}
