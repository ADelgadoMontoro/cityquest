import type { AdminStatusCardViewModel } from '@/types/admin-home';

import styles from '../app/page.module.css';

type AdminStatusCardProps = {
  card: AdminStatusCardViewModel;
};

export function AdminStatusCard({ card }: AdminStatusCardProps): React.JSX.Element {
  return (
    <aside className={`${styles.card} ${styles.statusCard}`}>
      <h2>{card.title}</h2>
      <p>{card.description}</p>
      <p>
        <strong>Next milestone:</strong> {card.nextMilestone}
      </p>
    </aside>
  );
}
