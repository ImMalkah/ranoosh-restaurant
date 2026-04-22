import styles from "./page.module.css";
import Link from 'next/link';

export default function Home() {
  return (
    <div className={styles.main}>
      <section className={styles.hero}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>RANOOSH</h1>
          <p className={styles.subtitle}>Modern Middle Eastern Dining & Lounge</p>
          <Link href="/menu" className={styles.cta}>
            Explore Menu
          </Link>
        </div>
      </section>

      <section className={styles.about} id="about">
        <h2 className={styles.aboutTitle}>A Taste of Tradition</h2>
        <p className={styles.aboutText}>
          Step into Ranoosh and immerse yourself in an ambiance where modern dining meets the rich heritage of the Middle East. Experience our extensive menu featuring deeply flavorful shawarmas, authentic kabab combination plates, comforting appetizers, and an array of indulgent desserts like Kunafe and premium Cheesecake. After your meal, unwind in our sophisticated lounge over our shisha selection and refreshing signature drinks.
        </p>
      </section>
    </div>
  );
}
