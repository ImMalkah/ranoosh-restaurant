import styles from "./page.module.css";
import Link from 'next/link';
import type { Metadata } from 'next';
import { createClient } from '@/utils/supabase/server';
import Reviews from '@/components/Reviews';

export const metadata: Metadata = {
  title: 'Thanksgiving Weekend Specials',
  description: 'Celebrate Thanksgiving weekend at Ranoosh in Hamilton with two chicken or beef shawarma wraps for $14.99, or shawarma with rice and a drink for $10.99.',
  keywords: [
    'Thanksgiving specials Hamilton',
    'shawarma Hamilton',
    'Middle Eastern restaurant Hamilton',
    'chicken shawarma wrap',
    'beef shawarma',
  ],
  alternates: {
    canonical: '/',
  },
  openGraph: {
    title: 'Thanksgiving Weekend Specials | Ranoosh Restaurant & Lounge',
    description: 'Enjoy two chicken or beef shawarma wraps for $14.99, or shawarma with rice and a drink for $10.99, available Saturday through Monday at Ranoosh in Hamilton.',
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
    title: 'Thanksgiving Weekend Specials | Ranoosh Restaurant & Lounge',
    description: 'Enjoy two chicken or beef shawarma wraps for $14.99, or shawarma with rice and a drink for $10.99, available Saturday through Monday.',
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
    '@type': 'ItemList',
    name: 'Thanksgiving weekend specials at Ranoosh Restaurant & Lounge',
    description: 'Chicken or beef shawarma specials available Saturday, Sunday, and Monday.',
    url: 'https://ranoosh-restaurant.vercel.app/',
    itemListElement: [
      {
        '@type': 'ListItem',
        position: 1,
        item: {
          '@type': 'Offer',
          name: 'Two Chicken or Beef Shawarma Wraps',
          description: 'Two chicken or beef shawarma wraps for Thanksgiving weekend.',
          price: '14.99',
          priceCurrency: 'CAD',
          eligibleQuantity: {
            '@type': 'QuantitativeValue',
            value: 2,
          },
          url: 'https://ranoosh-restaurant.vercel.app/#thanksgiving-special',
        },
      },
      {
        '@type': 'ListItem',
        position: 2,
        item: {
          '@type': 'Offer',
          name: 'Chicken or Beef Shawarma with Rice and a Drink',
          description: 'Chicken or beef shawarma served with rice and a drink for Thanksgiving weekend.',
          price: '10.99',
          priceCurrency: 'CAD',
          url: 'https://ranoosh-restaurant.vercel.app/#thanksgiving-special',
        },
      },
    ],
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
          <Link href="#thanksgiving-special" className={styles.promoLink}>
            See this weekend&apos;s special
          </Link>
        </div>
      </section>

      <section className={styles.promotion} id="thanksgiving-special" aria-labelledby="promotion-title">
        <div className={styles.promotionInner}>
          <div className={styles.promotionHeader}>
            <p className={styles.eyebrow}>Thanksgiving weekend · Saturday–Monday</p>
            <h2 id="promotion-title" className={styles.promotionTitle}>Gather around a special price</h2>
            <p className={styles.promotionIntro}>
              Make the long weekend delicious with shawarma favourites prepared fresh at Ranoosh in Hamilton.
            </p>
          </div>

          <div className={styles.offerGrid}>
            <article className={styles.offerCard}>
              <div className={styles.offerCardTop}>
                <span className={styles.offerTag}>2 wraps</span>
                <p className={styles.offerPrice} aria-label="14 dollars and 99 cents">
                  <span className={styles.priceCurrency}>$</span>14<span className={styles.priceCents}>.99</span>
                </p>
              </div>
              <h3 className={styles.offerTitle}>Two Chicken or Beef Wraps</h3>
              <p className={styles.offerDescription}>Choose chicken or beef shawarma and enjoy two wraps made to order with fresh toppings.</p>
            </article>

            <article className={styles.offerCard}>
              <div className={styles.offerCardTop}>
                <span className={styles.offerTag}>Meal + drink</span>
                <p className={styles.offerPrice} aria-label="10 dollars and 99 cents">
                  <span className={styles.priceCurrency}>$</span>10<span className={styles.priceCents}>.99</span>
                </p>
              </div>
              <h3 className={styles.offerTitle}>Chicken or Beef Shawarma with Rice</h3>
              <p className={styles.offerDescription}>Enjoy chicken or beef shawarma with rice and a drink.</p>
            </article>
          </div>

          <div className={styles.promotionFooter}>
            <p className={styles.availability}><strong>Available Saturday, Sunday, and Monday.</strong> Ask us about the Thanksgiving special when you order.</p>
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
