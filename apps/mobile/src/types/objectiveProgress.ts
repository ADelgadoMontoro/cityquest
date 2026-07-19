import type { MobileObjectiveSummary } from './route';

export type MobileObjectiveProgressStatus = 'completed' | 'current' | 'locked';

export type MobileRouteObjectiveProgressItem = {
  completedAt: string | null;
  objectiveSlug: string;
  poiSlug: string;
  status: MobileObjectiveProgressStatus;
};

export type MobileRouteObjectiveProgressSnapshot = {
  actorId: string;
  objectives: MobileRouteObjectiveProgressItem[];
  route: {
    slug: string;
    title: string;
  };
};

export type MobilePoiObjectiveListItem = MobileObjectiveSummary & {
  completedAt: string | null;
  progressStatus: MobileObjectiveProgressStatus;
};

export type MobilePoiObjectivesSnapshot = {
  destinationName: string;
  poi: {
    description: string;
    displayOrder: number;
    indoorMode: boolean;
    name: string;
    objectives: MobilePoiObjectiveListItem[];
    slug: string;
  };
  routeSlug: string;
  routeTitle: string;
};
