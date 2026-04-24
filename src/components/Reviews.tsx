'use client';

import styles from './Reviews.module.css';

const REVIEWS = [
  { name: 'kevin R.', date: '24-06-19', text: "Rice the best i've had!" },
  { name: 'Jordan D.', date: '24-04-09', text: "The shawarma poutine is the best I've ever had" },
  { name: 'Fatema B.', date: '23-11-02', text: "good food" },
  { name: 'Mehmet E.', date: '23-08-27', text: "very nice" },
  { name: 'jose D.', date: '23-08-05', text: "good food" },
  { name: 'Mike H.', date: '23-07-11', text: "Everything was well seasoned, amazing flavors, and great portions!" },
  { name: 'Deborah B.', date: '23-05-29', text: "Fresh food and great price!" },
];

export default function Reviews() {
  return (
    <section className={styles.container}>
      <div className={styles.header}>
        <div style={{ marginBottom: '1.5rem', display: 'inline-flex', alignItems: 'center', gap: '8px', background: '#06C167', padding: '6px 16px', borderRadius: '24px' }}>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="white" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm4.5 14H8c-1.66 0-3-1.34-3-3s1.34-3 3-3h8.5v6z" />
          </svg>
          <span style={{ fontWeight: 'bold', fontSize: '1rem', color: 'white', letterSpacing: '-0.5px' }}>Uber Eats</span>
        </div>
        <div className={styles.ratingWrapper}>
          <span className={styles.bigScore}>4.6</span>
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-start' }}>
            <div className={styles.stars}>★★★★★</div>
            <div className={styles.stats}>270+ Ratings • 7 Reviews</div>
          </div>
        </div>
      </div>

      <div className={styles.marquee}>
        <div className={styles.marqueeContent}>
          {REVIEWS.map((r, i) => (
            <div key={i} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.reviewer}>{r.name}</span>
                <span className={styles.date}>{r.date}</span>
              </div>
              <div className={styles.cardStars}>★★★★★</div>
              <p className={styles.reviewText}>"{r.text}"</p>
            </div>
          ))}
        </div>
        <div className={styles.marqueeContent} aria-hidden="true">
          {REVIEWS.map((r, i) => (
            <div key={`dup-${i}`} className={styles.card}>
              <div className={styles.cardHeader}>
                <span className={styles.reviewer}>{r.name}</span>
                <span className={styles.date}>{r.date}</span>
              </div>
              <div className={styles.cardStars}>★★★★★</div>
              <p className={styles.reviewText}>"{r.text}"</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
