import { mobileAppConfig } from '@/config/appConfig';
import { getCurrentObjectiveSnapshot } from '@/services/getCurrentObjectiveSnapshot';
import type { MobileObjectiveUnlockSnapshot } from '@/types/route';

type ObjectiveUnlocksApiResponse = {
  data: {
    objective: {
      id: string;
      slug: string;
      title: string;
    };
    unlockableContents: Array<{
      audioUrl: string | null;
      contentType: string;
      displayOrder: number;
      id: string;
      imageUrl: string | null;
      longText: string | null;
      shortText: string | null;
      title: string;
    }>;
  };
  meta: Record<string, unknown>;
  success: boolean;
};

export async function getObjectiveUnlockSnapshot(
  routeSlug: string,
  objectiveSlug?: string,
): Promise<MobileObjectiveUnlockSnapshot | null> {
  const currentObjective = await getCurrentObjectiveSnapshot(routeSlug, objectiveSlug);

  if (!currentObjective) {
    return null;
  }

  const response = await fetch(
    `${mobileAppConfig.apiBaseUrl}/objectives/${currentObjective.objective.slug}/unlocks`,
    {
      headers: {
        accept: 'application/json',
      },
      method: 'GET',
    },
  );

  if (response.status === 404) {
    return null;
  }

  if (!response.ok) {
    throw new Error(`Failed to load objective unlocks: ${response.status}`);
  }

  const payload = (await response.json()) as ObjectiveUnlocksApiResponse;

  return {
    destinationName: currentObjective.destinationName,
    objective: {
      slug: payload.data.objective.slug,
      title: payload.data.objective.title,
    },
    poiName: currentObjective.poiName,
    routeSlug: currentObjective.routeSlug,
    routeTitle: currentObjective.routeTitle,
    unlockableContents: payload.data.unlockableContents
      .map((unlockableContent) => ({
        audioUrl: unlockableContent.audioUrl,
        contentType: unlockableContent.contentType,
        displayOrder: unlockableContent.displayOrder,
        id: unlockableContent.id,
        imageUrl: unlockableContent.imageUrl,
        longText: unlockableContent.longText ?? '',
        shortText: unlockableContent.shortText ?? '',
        title: unlockableContent.title,
      }))
      .sort((left, right) => left.displayOrder - right.displayOrder),
  };
}
