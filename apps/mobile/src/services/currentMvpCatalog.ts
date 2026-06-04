export type MobileDestinationListItem = {
  id: string;
  slug: string;
  name: string;
  description: string;
  status: 'published';
  coverImageUrl: string | null;
  displayOrder: number;
  routeSlug: string;
  routeTitle: string;
};

export type MobileObjectiveSummary = {
  slug: string;
  title: string;
  targetType: string;
  difficulty: string;
  indoorMode: boolean;
  displayOrder: number;
};

export type MobilePoiDetail = {
  slug: string;
  name: string;
  description: string;
  indoorMode: boolean;
  displayOrder: number;
  objectives: MobileObjectiveSummary[];
};

export type MobileRouteDetail = {
  destination: {
    name: string;
    slug: string;
  };
  pois: MobilePoiDetail[];
  route: {
    description: string;
    difficulty: string;
    estimatedDurationMinutes: number;
    slug: string;
    title: string;
  };
};

export type MobileCurrentObjectiveSnapshot = {
  destinationName: string;
  objective: MobileObjectiveSummary;
  poiName: string;
  routeSlug: string;
  routeTitle: string;
};

const CURRENT_DESTINATIONS: MobileDestinationListItem[] = [
  {
    id: 'destination-jaen',
    slug: 'jaen',
    name: 'Jaén',
    description:
      'Jaén is a historic Andalusian city where castles, cathedrals, Arab baths and local legends reveal centuries of cultural heritage.',
    status: 'published',
    coverImageUrl: null,
    displayOrder: 0,
    routeSlug: 'jaen-echoes-of-stone',
    routeTitle: 'Jaén: Echoes of Stone',
  },
];

const CURRENT_ROUTES: Record<string, MobileRouteDetail> = {
  'jaen-echoes-of-stone': {
    destination: {
      name: 'Jaén',
      slug: 'jaen',
    },
    route: {
      slug: 'jaen-echoes-of-stone',
      title: 'Jaén: Echoes of Stone',
      description:
        'Jaén: Echoes of Stone turns the city into a visual investigation, guiding visitors through real heritage details in the Cathedral of Jaén and the Arab Baths to unlock hidden stories.',
      difficulty: 'easy',
      estimatedDurationMinutes: 300,
    },
    pois: [
      {
        slug: 'catedral-de-jaen',
        name: 'Cathedral of Jaén',
        description:
          'A monumental Renaissance cathedral in the heart of Jaén, where sacred architecture, hidden stone details and local legends make the city’s history feel alive.',
        indoorMode: true,
        displayOrder: 0,
        objectives: [
          {
            slug: 'estatua-san-fernando',
            title: 'Statue of Saint Ferdinand',
            targetType: 'statue',
            difficulty: 'easy',
            indoorMode: false,
            displayOrder: 0,
          },
          {
            slug: 'mona-catedral-jaen',
            title: 'Cathedral Monkey',
            targetType: 'architectural_detail',
            difficulty: 'hard',
            indoorMode: false,
            displayOrder: 1,
          },
          {
            slug: 'placa-santa-catalina-coro',
            title: 'Saint Catherine Choir Panel',
            targetType: 'decorative_panel',
            difficulty: 'medium',
            indoorMode: true,
            displayOrder: 2,
          },
          {
            slug: 'organo-catedral-jaen',
            title: 'Cathedral Organ',
            targetType: 'architectural_detail',
            difficulty: 'easy',
            indoorMode: true,
            displayOrder: 3,
          },
          {
            slug: 'tumba-don-alonso-suarez',
            title: 'Tomb of Don Alonso Suárez',
            targetType: 'tomb',
            difficulty: 'hard',
            indoorMode: true,
            displayOrder: 4,
          },
        ],
      },
      {
        slug: 'banos-arabes-jaen',
        name: 'Arab Baths of Jaén',
        description:
          'One of Jaén’s most remarkable heritage sites, hidden beneath the Palace of Villardompardo and preserving the memory of the city’s Andalusian past.',
        indoorMode: true,
        displayOrder: 1,
        objectives: [
          {
            slug: 'fachada-palacio-villardompardo',
            title: 'Palace of Villardompardo Façade',
            targetType: 'facade',
            difficulty: 'easy',
            indoorMode: false,
            displayOrder: 0,
          },
          {
            slug: 'pinturas-recibidor-banos-arabes',
            title: 'Arab Baths Entrance Paintings',
            targetType: 'decorative_painting',
            difficulty: 'easy',
            indoorMode: true,
            displayOrder: 1,
          },
          {
            slug: 'piscina-sala-templada-banos-arabes',
            title: 'Warm Room Central Pool',
            targetType: 'pool',
            difficulty: 'easy',
            indoorMode: true,
            displayOrder: 2,
          },
          {
            slug: 'columnas-ala-rey-ali',
            title: 'King Ali’s Wing Columns',
            targetType: 'architectural_detail',
            difficulty: 'medium',
            indoorMode: true,
            displayOrder: 3,
          },
          {
            slug: 'tinajas-agua-sala-caliente',
            title: 'Hot Room Water Jars',
            targetType: 'historic_object',
            difficulty: 'easy',
            indoorMode: true,
            displayOrder: 4,
          },
        ],
      },
    ],
  },
};

export function listCurrentDestinations(): MobileDestinationListItem[] {
  return CURRENT_DESTINATIONS;
}

export function getCurrentRouteDetail(routeSlug: string): MobileRouteDetail | null {
  return CURRENT_ROUTES[routeSlug] ?? null;
}

export function getCurrentObjectiveSnapshot(
  routeSlug: string,
  objectiveSlug?: string,
): MobileCurrentObjectiveSnapshot | null {
  const routeDetail = getCurrentRouteDetail(routeSlug);

  if (!routeDetail) {
    return null;
  }

  const orderedPois = [...routeDetail.pois].sort((left, right) => left.displayOrder - right.displayOrder);

  for (const poi of orderedPois) {
    const orderedObjectives = [...poi.objectives].sort(
      (left, right) => left.displayOrder - right.displayOrder,
    );

    const matchedObjective = objectiveSlug
      ? orderedObjectives.find((objective) => objective.slug === objectiveSlug)
      : orderedObjectives[0];

    if (matchedObjective) {
      return {
        routeSlug: routeDetail.route.slug,
        routeTitle: routeDetail.route.title,
        destinationName: routeDetail.destination.name,
        poiName: poi.name,
        objective: matchedObjective,
      };
    }
  }

  return null;
}
