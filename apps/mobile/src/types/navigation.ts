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

export type CurrentObjectiveRoute = {
  name: 'currentObjective';
  params: {
    objectiveSlug?: string;
    routeSlug: string;
  };
};

export type AppRoute =
  | WelcomeRoute
  | DestinationsRoute
  | RouteDetailRoute
  | CurrentObjectiveRoute;

export type AppScreenName = AppRoute['name'];
