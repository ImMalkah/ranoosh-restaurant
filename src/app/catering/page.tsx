import styles from '../menu/page.module.css';
import cateringStyles from './catering.module.css';
import { Metadata } from 'next';
import Image from 'next/image';
import CateringItemCard from '@/components/CateringItemCard';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Catering',
  description: 'Explore our catering options for your next event.',
};

export const revalidate = 0; // Disable static caching so it always fetches fresh data

export default async function CateringPage() {
  const supabase = await createClient();

  // Fetch categories
  const { data: categories, error: catError } = await supabase
    .from('catering_categories')
    .select('*')
    .order('order_index', { ascending: true });

  if (catError) {
    console.error(catError);
  }

  // Fetch items
  const { data: items, error: itemError } = await supabase
    .from('catering_items')
    .select('*')
    .order('order_index', { ascending: true });

  if (itemError) {
    console.error(itemError);
  }

  // Group items by category
  const cateringData = categories?.map((cat) => ({
    category: cat.name,
    items: items?.filter((item) => item.category_id === cat.id) || [],
  })) || [];

  return (
    <main>
      <section className={cateringStyles.heroSection}>
        <div className={cateringStyles.heroBackground}>
          <Image 
            src="/catering-hero.jpg" 
            alt="Delicious Catering Spread" 
            fill 
            style={{ objectFit: 'cover' }} 
            priority
          />
          <div className={cateringStyles.heroOverlay}></div>
        </div>
        <div className={cateringStyles.heroContent}>
          <h1 className={cateringStyles.heroTitle}>Let Us Cater Your Next Event</h1>
          <p className={cateringStyles.heroText}>
            Whether it's a family gathering, wedding, or corporate event, we prepare fresh, flavorful dishes that bring people together. Enjoy the taste of tradition with every bite.
          </p>
          <p className={cateringStyles.heroArabicText}>
            مستعدون لتجهيز جميع المناسبات<br/>
            أكلات عراقية أصيلة، منسف القوزي و الدولمة والتبولة إلى المشاوي وطبعا المسكوف العراقي والأطباق الرئيسية<br/>
            للطلب والاستفسار: تواصل ويانا
          </p>
          <a href="/contact" className={cateringStyles.contactButton}>Contact Us</a>
        </div>
      </section>

      <section className={cateringStyles.videoSection}>
        <video 
          src="/catering-video.mp4" 
          controls 
          autoPlay 
          loop 
          muted 
          playsInline 
          className={cateringStyles.cateringVideo}
        />
      </section>

      <div className={styles.menuContainer}>
        <div className={styles.header}>
          <h2 className={styles.title}>Catering Menu</h2>
          <p className={styles.subtitle}>Explore our catering options for your next event.</p>
        </div>

        <div className={styles.menuGrid}>
          {cateringData.map((section, idx) => (
            <div key={idx} className={styles.categorySection}>
              <h2 className={styles.categoryTitle}>{section.category}</h2>
              <div className={styles.itemsGrid}>
                {section.items.map((item) => (
                  <CateringItemCard key={item.id} item={item} />
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </main>
  );
}
