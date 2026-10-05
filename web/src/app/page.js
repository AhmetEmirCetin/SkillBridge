import Link from 'next/link';
import styles from './page.module.css';

export default function HomePage() {
  return (
    <main className={styles.main}>
      <div className={styles.container}>
        <h1 className={styles.title}>
          Skill<span className={styles.highlight}>Bridge</span> AI
        </h1>
        <p className={styles.subtitle}>
          Yapay zeka destekli kişisel öğrenme yol haritanı oluştur. 
          Ücretsiz kaynaklarla, sana özel bir müfredat.
        </p>

        <div className={styles.buttons}>
          <Link href="/register">
            <button className={styles.primaryButton}>Ücretsiz Başla 🚀</button>
          </Link>
          <Link href="/login">
            <button className={styles.secondaryButton}>Giriş Yap</button>
          </Link>
        </div>

        <div className={styles.cards}>
          <div className={styles.card}>
            <div className={styles.cardIcon}>🎯</div>
            <h3>Kişiselleştirilmiş</h3>
            <p>Seviyene, vaktine ve hedefine göre özel plan</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>💡</div>
            <h3>Ücretsiz Kaynaklar</h3>
            <p>YouTube, dokümantasyon ve makalelerden oluşan müfredat</p>
          </div>
          <div className={styles.card}>
            <div className={styles.cardIcon}>⚡</div>
            <h3>Anında Oluştur</h3>
            <p>Saniyeler içinde haftalık öğrenme planın hazır</p>
          </div>
        </div>
      </div>
    </main>
  );
}