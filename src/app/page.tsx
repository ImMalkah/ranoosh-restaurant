import styles from "./page.module.css";
import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import Reviews from '@/components/Reviews';

export const metadata: Metadata = {
  title: 'National Shawarma Day Special',
  description: 'Celebrate National Shawarma Day at Ranoosh in Hamilton on October 15 with a $5 shawarma special, available all day for takeout only.',
  keywords: [
    'National Shawarma Day Hamilton',
    'shawarma special Hamilton',
    'shawarma Hamilton',
    'Middle Eastern restaurant Hamilton',
    'takeout shawarma',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'National Shawarma Day Special | Ranoosh Restaurant & Lounge',
    description: 'Enjoy a $5 shawarma special all day on October 15 at Ranoosh in Hamilton. Takeout only.',
    url: '/',
    siteName: 'Ranoosh Restaurant',
    images: [
      {
        url: '/og-image.png',
        width: 1200,
        height: 630,
      },
    ],
    locale: 'en_US',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'National Shawarma Day Special | Ranoosh Restaurant & Lounge',
    description: 'A $5 shawarma special all day on October 15 at Ranoosh in Hamilton. Takeout only.',
    images: ['/og-image.png'],
  },
};

export const revalidate = 0;

export default async function Home() {
  const supabase = await createClient();
  const { data } = await supabase.from('site_settings').select('value').eq('key', 'hero_image_url').single();
  const heroImage = data?.value || '/hero-bg.png';

  const promotionJsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Offer',
    name: 'National Shawarma Day $5 Shawarma Special',
    description: 'A $5 shawarma special available all day on October 15 for takeout only.',
    price: '5.00',
    priceCurrency: 'CAD',
    validFrom: '2026-10-15T00:00:00-04:00',
    validThrough: '2026-10-15T23:59:59-04:00',
    availability: 'https://schema.org/InStock',
    availableDeliveryMethod: 'https://schema.org/OnSitePickup',
    url: 'https://ranoosh-restaurant.vercel.app/',
  };

  return (
    <div className={styles.main}>
      <section className={styles.hero} aria-labelledby="hero-title" style={{ background: `linear-gradient(rgba(13, 14, 18, 0.7), rgba(13, 14, 18, 0.9)), url('${heroImage}')`, backgroundSize: 'cover', backgroundPosition: 'center' }}>
        <div className={styles.heroContent}>
          <h1 id="hero-title" className={styles.title}>RANOOSH</h1>
          <p className={styles.subtitle}>Modern Middle Eastern Dining & Lounge</p>
          <Link href="/menu" className={styles.cta}>
            Explore Menu
          </Link>
          <Link href="#shawarma-day-special" className={styles.promoLink}>
            See the October 15th special
          </Link>
        </div>
      </section>

      <section className={styles.promotion} id="shawarma-day-special" aria-labelledby="promotion-title">
        <div className={styles.promotionInner}>
          <div className={styles.promotionHeader}>
            <p className={styles.eyebrow}>National Shawarma Day · October 15</p>
            <h2 id="promotion-title" className={styles.promotionTitle}>Shawarma all day for $5</h2>
            <p className={styles.promotionIntro}>
              Celebrate National Shawarma Day with a shawarma special prepared fresh at Ranoosh in Hamilton.
            </p>
          </div>

          <div className={styles.offerGrid}>
            <article className={styles.offerCard}>
              <div className={styles.offerCardTop}>
                <span className={styles.offerTag}>Takeout only</span>
                <p className={styles.offerPrice} aria-label="5 dollars">
                  <span className={styles.priceCurrency}>$</span>5
                </p>
              </div>
              <h3 className={styles.offerTitle}>National Shawarma Day special</h3>
              <p className={styles.offerDescription}>Enjoy a shawarma for $5 all day on October 15. Available for takeout orders only.</p>
            </article>
          </div>

          <div className={styles.promotionFooter}>
            <p className={styles.availability}><strong>October 15 · All day · Takeout only.</strong> Ask us about the National Shawarma Day special when you order.</p>
            <Link href="/menu" className={`${styles.cta} ${styles.secondaryCta}`}>
              View the full menu
            </Link>
          </div>
        </div>
      </section>

      <section className={styles.about} id="about">
        <h2 className={styles.aboutTitle}>A Taste of Tradition in Hamilton</h2>
        <p className={styles.aboutText}>
          Step into Ranoosh and immerse yourself in an ambiance where modern dining meets the rich heritage of the Middle East. Experience our extensive menu featuring deeply flavorful shawarmas, authentic kabab combination plates, comforting appetizers, and indulgent desserts. After your meal, unwind in our sophisticated lounge over our shisha selection and refreshing signature drinks.
        </p>
      </section>

      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(promotionJsonLd).replace(/</g, '\\u003c'),
        }}
      />

      <Reviews />
    </div>
  );
}
