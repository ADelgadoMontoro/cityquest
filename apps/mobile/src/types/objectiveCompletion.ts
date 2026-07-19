export type MobileObjectiveCompletion = {
  actorId: string;
  completedAt: string;
  gpsStatus: 'radius_unavailable' | 'within_radius';
  id: string;
  objectiveSlug: string;
  routeSlug: string;
  validationMode: 'mock_visual';
  visualStatus: 'passed';
};

export type MobileRegisterObjectiveCompletionInput = {
  actorId?: string;
  gpsStatus: 'radius_unavailable' | 'within_radius';
  objectiveSlug: string;
  routeSlug: string;
  validationMode: 'mock_visual';
  visualStatus: 'passed';
};
