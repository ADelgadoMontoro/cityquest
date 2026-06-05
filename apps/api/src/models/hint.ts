export type ObjectiveHintSummary = {
  id: string;
  slug: string;
  title: string;
};

export type ObjectiveHintItem = {
  id: string;
  level: number;
  penalizesPerfectCompletion: number;
  text: string;
};

export type ObjectiveHintsSnapshot = {
  hints: ObjectiveHintItem[];
  objective: ObjectiveHintSummary;
};
