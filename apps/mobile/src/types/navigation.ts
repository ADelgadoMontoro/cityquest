export type WelcomeRoute = {
  name: 'welcome';
};

export type DestinationsRoute = {
  name: 'destinations';
};

export type RouteDetailRoute = {
  name: 'routeDetail';
  params: {
    routeSlug: string;
  };
};

export type PoiObjectivesRoute = {
  name: 'poiObjectives';
  params: {
    poiSlug: string;
    routeSlug: string;
  };
};

export type CurrentObjectiveRoute = {
  name: 'currentObjective';
  params: {
    objectiveSlug?: string;
    routeSlug: string;
  };
};

export type ObjectiveRewardRoute = {
  name: 'objectiveReward';
  params: {
    backLabel?: string;
    entryMode?: 'direct' | 'mockValidation';
    objectiveSlug?: string;
    routeSlug: string;
  };
};

export type AppRoute =
  | WelcomeRoute
  | DestinationsRoute
  | RouteDetailRoute
  | PoiObjectivesRoute
  | CurrentObjectiveRoute
  | ObjectiveRewardRoute;

export type AppScreenName = AppRoute['name'];
