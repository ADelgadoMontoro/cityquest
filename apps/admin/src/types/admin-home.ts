export type AdminStatusCardViewModel = {
  title: string;
  description: string;
  nextMilestone: string;
};

export type AdminFeatureCardViewModel = {
  label: string;
  title: string;
  description?: string;
  items?: string[];
};

export type AdminHomeViewModel = {
  eyebrow: string;
  title: string;
  subtitle: string;
  stack: string[];
  statusCard: AdminStatusCardViewModel;
  featureCards: AdminFeatureCardViewModel[];
};
