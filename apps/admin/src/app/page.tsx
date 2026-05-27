import { AdminFeatureCard } from '@/components/AdminFeatureCard';
import { AdminStatusCard } from '@/components/AdminStatusCard';
import { createAdminHomeViewModel } from '@/services/createAdminHomeViewModel';

import styles from './page.module.css';

export default function AdminHomePage() {
  const viewModel = createAdminHomeViewModel();

  return (
    <main className={styles.page}>
      <div className={styles.shell}>
        <section className={styles.hero}>
          <div className={styles.panel}>
            <span className={styles.eyebrow}>{viewModel.eyebrow}</span>
            <h1 className={styles.title}>{viewModel.title}</h1>
            <p className={styles.subtitle}>{viewModel.subtitle}</p>
            <div className={styles.stack}>
              {viewModel.stack.map((item) => (
                <span key={item} className={styles.pill}>
                  {item}
                </span>
              ))}
            </div>
          </div>

          <AdminStatusCard card={viewModel.statusCard} />
        </section>

        <section className={styles.grid}>
          {viewModel.featureCards.map((card) => (
            <AdminFeatureCard key={card.title} card={card} />
          ))}
        </section>
      </div>
    </main>
  );
}
