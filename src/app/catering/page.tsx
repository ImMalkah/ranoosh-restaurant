import styles from '../menu/page.module.css';
import { Metadata } from 'next';
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
    <div className={styles.menuContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Catering Options</h1>
        <p className={styles.subtitle}>Let us host your next event.</p>
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
  );
}
