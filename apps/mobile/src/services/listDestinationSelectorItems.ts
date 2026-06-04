import { mobileAppConfig } from '@/config/appConfig';

type DestinationsApiResponse = {
  data: {
    destinations: Array<{
      coverImageUrl: string | null;
      description: string | null;
      displayOrder: number;
      id: string;
      name: string;
      slug: string;
      status: string;
    }>;
  };
  meta: {
    count: number;
  };
  success: boolean;
};

export type AvailableDestinationSelectorItem = {
  availability: 'available';
  coverImageUrl: string | null;
  description: string;
  displayOrder: number;
  id: string;
  name: string;
  routeSlug: string;
  routeTitle: string;
  slug: string;
  status: string;
};

export type PublishedUnroutedDestinationSelectorItem = {
  availability: 'publishedUnrouted';
  coverImageUrl: string | null;
  description: string;
  displayOrder: number;
  id: string;
  name: string;
  slug: string;
  status: string;
};

export type LockedDestinationSelectorItem = {
  availability: 'locked';
  name: string;
  slug: string;
  teaser: string;
};

export type DestinationSelectorItem =
  | AvailableDestinationSelectorItem
  | PublishedUnroutedDestinationSelectorItem
  | LockedDestinationSelectorItem;

const CURRENT_PLAYABLE_ROUTE_BY_DESTINATION_SLUG: Record<
  string,
  {
    routeSlug: string;
    routeTitle: string;
  }
> = {
  jaen: {
    routeSlug: 'jaen-echoes-of-stone',
    routeTitle: 'Jaén: Echoes of Stone',
  },
};

const LOCKED_DESTINATIONS: LockedDestinationSelectorItem[] = [
  {
    availability: 'locked',
    name: 'Úbeda',
    slug: 'ubeda',
    teaser: 'Coming soon to the CityQuest MVP roadmap.',
  },
  {
    availability: 'locked',
    name: 'Baeza',
    slug: 'baeza',
    teaser: 'Planned as a future heritage destination.',
  },
  {
    availability: 'locked',
    name: 'Cazorla',
    slug: 'cazorla',
    teaser: 'Reserved for a later expansion of the playable catalog.',
  },
];

export type ListDestinationSelectorItemsResult = {
  availableDestinations: AvailableDestinationSelectorItem[];
  lockedDestinations: LockedDestinationSelectorItem[];
  publishedUnroutedDestinations: PublishedUnroutedDestinationSelectorItem[];
};

export async function listDestinationSelectorItems(): Promise<ListDestinationSelectorItemsResult> {
  const response = await fetch(`${mobileAppConfig.apiBaseUrl}/destinations`, {
    headers: {
      accept: 'application/json',
    },
    method: 'GET',
  });

  if (!response.ok) {
    throw new Error(`Failed to load destinations: ${response.status}`);
  }

  const payload = (await response.json()) as DestinationsApiResponse;

  const publishedDestinations = payload.data.destinations
    .map<AvailableDestinationSelectorItem | PublishedUnroutedDestinationSelectorItem>(
      (destination) => {
      const routeBinding = CURRENT_PLAYABLE_ROUTE_BY_DESTINATION_SLUG[destination.slug];

      if (!routeBinding) {
        return {
          availability: 'publishedUnrouted',
          coverImageUrl: destination.coverImageUrl,
          description: destination.description ?? '',
          displayOrder: destination.displayOrder,
          id: destination.id,
          name: destination.name,
          slug: destination.slug,
          status: destination.status,
        };
      }

      return {
        availability: 'available',
        coverImageUrl: destination.coverImageUrl,
        description: destination.description ?? '',
        displayOrder: destination.displayOrder,
        id: destination.id,
        name: destination.name,
        routeSlug: routeBinding.routeSlug,
        routeTitle: routeBinding.routeTitle,
        slug: destination.slug,
        status: destination.status,
      };
    },
    )
    .sort((left, right) => left.displayOrder - right.displayOrder);

  return {
    availableDestinations: publishedDestinations.filter(
      (destination): destination is AvailableDestinationSelectorItem =>
        destination.availability === 'available',
    ),
    lockedDestinations: LOCKED_DESTINATIONS,
    publishedUnroutedDestinations: publishedDestinations.filter(
      (destination): destination is PublishedUnroutedDestinationSelectorItem =>
        destination.availability === 'publishedUnrouted',
    ),
  };
}

export function listLockedDestinationSelectorItems(): LockedDestinationSelectorItem[] {
  return LOCKED_DESTINATIONS;
}
