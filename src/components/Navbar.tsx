'use client';

import Link from 'next/link';
import { useState } from 'react';
import styles from './Navbar.module.css';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className={styles.navbar}>
      <Link href="/" className={styles.logo} onClick={() => setIsOpen(false)}>
        RANOOSH
      </Link>
      <div className={`${styles.hamburger} ${isOpen ? styles.hamburgerOpen : ''}`} onClick={() => setIsOpen(!isOpen)}>
        <span></span>
        <span></span>
        <span></span>
      </div>
      <div className={`${styles.links} ${isOpen ? styles.open : ''}`}>
        <Link href="/" className={styles.link} onClick={() => setIsOpen(false)}>Home</Link>
        <Link href="/menu" className={styles.link} onClick={() => setIsOpen(false)}>Menu</Link>
        <Link href="/catering" className={styles.link} onClick={() => setIsOpen(false)}>Catering</Link>
        <a href="https://www.ubereats.com/ca/store/rannoshgrill/U_asRGeTTEqrjpNem7RUhw?utm_campaign=CM2508147-search-free-nonbrand-google-pas_e_all_acq_Global&utm_medium=search-free-nonbrand&utm_source=google-pas&rwg_token=AFd1xnFWFNMmupr9g2m6ysCz8KI_Cn1ymfo2J3vP89Cin6DTOo7eaSO8plGdHhOksvP_lZ9dKRjUSXBztSK-XB2Bh_ByhjhqQw%3D%3D" target="_blank" rel="noopener noreferrer" className={styles.link} onClick={() => setIsOpen(false)}>
          Uber Eats
          <svg style={{ marginLeft: '4px', display: 'inline-block', verticalAlign: 'middle' }} xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path><polyline points="15 3 21 3 21 9"></polyline><line x1="10" y1="14" x2="21" y2="3"></line></svg>
        </a>
        <Link href="/#about" className={styles.link} onClick={() => setIsOpen(false)}>About</Link>
        <Link href="/admin" className={styles.link} onClick={() => setIsOpen(false)}>Admin</Link>
      </div>
    </nav>
  );
}
