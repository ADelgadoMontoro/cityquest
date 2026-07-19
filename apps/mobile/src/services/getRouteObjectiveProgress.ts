import { mobileAppConfig } from '@/config/appConfig';
import { MVP_DEMO_ACTOR_ID } from '@/services/registerObjectiveCompletion';
import type { MobileRouteObjectiveProgressSnapshot } from '@/types/objectiveProgress';

type RouteObjectiveProgressApiResponse = {
  data: {
    actorId: string;
    objectives: Array<{
      completedAt: string | null;
      objectiveSlug: string;
      poiSlug: string;
      status: 'completed' | 'current' | 'locked';
    }>;
    route: {
      slug: string;
      title: string;
    };
  };
  meta: Record<string, unknown>;
  success: boolean;
};

export async function getRouteObjectiveProgress(
  routeSlug: string,
  actorId = MVP_DEMO_ACTOR_ID,
): Promise<MobileRouteObjectiveProgressSnapshot | null> {
  const encodedActorId = encodeURIComponent(actorId);
  const endpointPath = `/routes/${routeSlug}/objective-progress?actorId=${encodedActorId}`;

  const response = await fetch(`${mobileAppConfig.apiBaseUrl}${endpointPath}`, {
    headers: {
      accept: 'application/json',
    },
    method: 'GET',
  });

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load route objective progress: ${response.status}`);
  }

  const payload = (await response.json()) as RouteObjectiveProgressApiResponse;

  return payload.data;
}
