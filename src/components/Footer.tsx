import styles from './Footer.module.css';

export default function Footer() {
  return (
    <footer className={styles.footer}>
      <div className={styles.grid}>
        <div className={styles.section}>
          <h3>RANOOSH LOUNGE</h3>
          <p>Experience the finest Middle Eastern cuisine in a great atmosphere.</p>
        </div>
        <div className={styles.section}>
          <h3>VISIT US</h3>
          <p>580 Concession St #578<br />Hamilton, ON L8V 1B1<br />(905) 296-6962</p>
        </div>
        <div className={styles.section}>
          <h3>HOURS</h3>
          <p>Mon-Thu: 12pm - 12am<br />Fri-Sat: 12pm - 1am<br />Sun: 3pm - 12am</p>
        </div>
      </div>
      <div className={styles.bottom}>
        &copy; {new Date().getFullYear()} Ranoosh Restaurant & Lounge. All rights reserved.
      </div>
    </footer>
  );
}
