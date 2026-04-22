import Link from 'next/link';
import styles from './Navbar.module.css';

export default function Navbar() {
  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo}>
        RANOOSH
      </Link>
      <div className={styles.links}>
        <Link href="/" className={styles.link}>Home</Link>
        <Link href="/menu" className={styles.link}>Menu</Link>
        <Link href="/#about" className={styles.link}>About</Link>
      </div>
    </nav>
  );
}
