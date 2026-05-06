import styles from "./page.module.css";
import Link from 'next/link';
import { createClient } from '@/utils/supabase/server';
import Reviews from '@/components/Reviews';

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero_image_url').single();
  const heroImage = data?.value || '/hero-bg.png';

  return (
    <div className={styles.main}>
      <section className={styles.hero} style={{ background: `linear-gradient(rgba(13, 14, 18, 0.7), rgba(13, 14, 18, 0.9)), url('${heroImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className={styles.heroContent}>
          <h1 className={styles.title}>RANNOSH</h1>
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

      <Reviews />
    </div>
  );
}
