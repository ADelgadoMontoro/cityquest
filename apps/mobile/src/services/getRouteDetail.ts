import { mobileAppConfig } from '@/config/appConfig';
import type { MobileRouteDetail } from '@/types/route';

type RouteDetailApiResponse = {
  data: {
    route: {
      description: string | null;
      destination: {
        id: string;
        name: string;
        slug: string;
      };
      difficulty: string | null;
      displayOrder: number;
      estimatedDurationMinutes: number | null;
      id: string;
      pois: Array<{
        accessNotes: string | null;
        description: string | null;
        displayOrder: number;
        id: string;
        indoorMode: number;
        latitude: number;
        longitude: number;
        name: string;
        objectives: Array<{
          description: string | null;
          difficulty: string | null;
          displayOrder: number;
          gpsRadiusMeters: number | null;
          id: string;
          indoorMode: number;
          slug: string;
          status: string;
          targetType: string;
          title: string;
        }>;
        slug: string;
        status: string;
      }>;
      slug: string;
      status: string;
      title: string;
    };
  };
  meta: Record<string, unknown>;
  success: boolean;
};

export async function getRouteDetail(routeSlug: string): Promise<MobileRouteDetail | null> {
  const response = await fetch(`${mobileAppConfig.apiBaseUrl}/routes/${routeSlug}`, {
    headers: {
      accept: 'application/json',
    },
    method: 'GET',
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load route detail: ${response.status}`);
  }

  const payload = (await response.json()) as RouteDetailApiResponse;
  const { route } = payload.data;

  return {
    destination: {
      name: route.destination.name,
      slug: route.destination.slug,
    },
    route: {
      description: route.description ?? '',
      difficulty: route.difficulty ?? 'unknown',
      estimatedDurationMinutes: route.estimatedDurationMinutes ?? 0,
      slug: route.slug,
      title: route.title,
    },
    pois: route.pois.map((poi) => ({
      slug: poi.slug,
      name: poi.name,
      description: poi.description ?? '',
      indoorMode: poi.indoorMode === 1,
      displayOrder: poi.displayOrder,
      objectives: poi.objectives.map((objective) => ({
        slug: objective.slug,
        title: objective.title,
        description: objective.description ?? '',
        targetType: objective.targetType,
        difficulty: objective.difficulty ?? 'unknown',
        gpsRadiusMeters: objective.gpsRadiusMeters,
        indoorMode: objective.indoorMode === 1,
        displayOrder: objective.displayOrder,
      })),
    })),
  };
}
