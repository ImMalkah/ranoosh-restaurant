import styles from './page.module.css';
import { Metadata } from 'next';
import MenuItemCard from '../../components/MenuItemCard';
import { createClient } from '@/utils/supabase/server';

export const metadata: Metadata = {
  title: 'Menu',
  description: 'Explore the Ranoosh menu. Featuring a wide selection of authentic Middle Eastern mezze, grills, and lounge refreshments.',
};

export const revalidate = 0; // Disable static caching so it always fetches fresh data

export default async function MenuPage() {
  const supabase = await createClient();

  // Fetch categories
  const { data: categories, error: catError } = await supabase
    .from('menu_categories')
    .select('*')
    .order('order_index', { ascending: true });

  if (catError) {
    console.error(catError);
  }

  // Fetch items
  const { data: items, error: itemError } = await supabase
    .from('menu_items')
    .select('*')
    .order('order_index', { ascending: true });

  if (itemError) {
    console.error(itemError);
  }

  // Group items by category
  const menuData = categories?.map((cat) => ({
    category: cat.name,
    items: items?.filter((item) => item.category_id === cat.id) || [],
  })) || [];

  return (
    <div className={styles.menuContainer}>
      <div className={styles.header}>
        <h1 className={styles.title}>Our Menu</h1>
        <p className={styles.subtitle}>Discover an array of authentic flavors.</p>
      </div>

      {menuData.map((section) => (
        <section key={section.category} className={styles.category}>
          <h2 className={styles.categoryTitle}>{section.category}</h2>
          <div className={styles.grid}>
            {section.items.map((item) => (
              <MenuItemCard key={item.id} item={{...item, image: item.image_url}} />
            ))}
          </div>
        </section>
      ))}
    </div>
  );
}
