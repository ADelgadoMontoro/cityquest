import type { AdminFeatureCardViewModel } from '@/types/admin-home';

import styles from '../app/page.module.css';

type AdminFeatureCardProps = {
  card: AdminFeatureCardViewModel;
};

export function AdminFeatureCard({ card }: AdminFeatureCardProps): React.JSX.Element {
  return (
    <article className={styles.card}>
      <span className={styles.cardLabel}>{card.label}</span>
      <h2 className={styles.cardTitle}>{card.title}</h2>
      {card.description ? <p>{card.description}</p> : null}
      {card.items ? (
        <ul className={styles.list}>
          {card.items.map((item) => (
            <li key={item}>{item}</li>
          ))}
        </ul>
      ) : null}
    </article>
  );
}
