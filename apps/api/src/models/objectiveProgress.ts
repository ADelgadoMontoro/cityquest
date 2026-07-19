export type RouteObjectiveProgressStatus = 'completed' | 'current' | 'locked';

export type RouteObjectiveProgressItem = {
  completedAt: string | null;
  objectiveSlug: string;
  poiSlug: string;
  status: RouteObjectiveProgressStatus;
};

export type RouteObjectiveProgressSnapshot = {
  actorId: string;
  objectives: RouteObjectiveProgressItem[];
  route: {
    slug: string;
    title: string;
  };
};
