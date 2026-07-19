import { mobileAppConfig } from '@/config/appConfig';
import type {
  MobileObjectiveCompletion,
  MobileRegisterObjectiveCompletionInput,
} from '@/types/objectiveCompletion';

export const MVP_DEMO_ACTOR_ID = 'cityquest-local-demo-actor';

type RegisterObjectiveCompletionApiResponse = {
  data: {
    completion: {
      actorId: string;
      completedAt: string;
      gpsStatus: 'radius_unavailable' | 'within_radius';
      id: string;
      objectiveSlug: string;
      routeSlug: string;
      validationMode: 'mock_visual';
      visualStatus: 'passed';
    };
  };
  meta: Record<string, unknown>;
  success: boolean;
};

export async function registerObjectiveCompletion(
  input: MobileRegisterObjectiveCompletionInput,
): Promise<MobileObjectiveCompletion> {
  const response = await fetch(
    `${mobileAppConfig.apiBaseUrl}/objectives/${input.objectiveSlug}/completions`,
    {
      body: JSON.stringify({
        actorId: input.actorId ?? MVP_DEMO_ACTOR_ID,
        gpsStatus: input.gpsStatus,
        routeSlug: input.routeSlug,
        validationMode: input.validationMode,
        visualStatus: input.visualStatus,
      }),
      headers: {
        accept: 'application/json',
        'content-type': 'application/json',
      },
      method: 'POST',
    },
  );

  if (!response.ok) {
    throw new Error(`Failed to register objective completion: ${response.status}`);
  }

  const payload = (await response.json()) as RegisterObjectiveCompletionApiResponse;

  return payload.data.completion;
}
