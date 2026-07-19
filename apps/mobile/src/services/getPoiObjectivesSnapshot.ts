import { getRouteDetail } from '@/services/getRouteDetail';
import { getRouteObjectiveProgress } from '@/services/getRouteObjectiveProgress';
import type {
  MobileObjectiveProgressStatus,
  MobilePoiObjectivesSnapshot,
  MobileRouteObjectiveProgressSnapshot,
} from '@/types/objectiveProgress';
import type { MobilePoiDetail, MobileRouteDetail } from '@/types/route';

function getProgressByObjectiveSlug(
  progress: MobileRouteObjectiveProgressSnapshot,
): Map<string, { completedAt: string | null; status: MobileObjectiveProgressStatus }> {
  const progressEntries: Array<
    [string, { completedAt: string | null; status: MobileObjectiveProgressStatus }]
  > = progress.objectives.map((objectiveProgress) => [
    objectiveProgress.objectiveSlug,
    {
      completedAt: objectiveProgress.completedAt,
      status: objectiveProgress.status,
    },
  ]);

  return new Map(progressEntries);
}

export function buildPoiObjectivesSnapshot(
  routeDetail: MobileRouteDetail,
  progress: MobileRouteObjectiveProgressSnapshot,
  poiSlug: string,
): MobilePoiObjectivesSnapshot | null {
  const poi = routeDetail.pois.find((candidatePoi) => candidatePoi.slug === poiSlug) ?? null;

  if (!poi) {
    return null;
  }

  const progressByObjectiveSlug = getProgressByObjectiveSlug(progress);

  return {
    destinationName: routeDetail.destination.name,
    poi: {
      description: poi.description,
      displayOrder: poi.displayOrder,
      indoorMode: poi.indoorMode,
      name: poi.name,
      objectives: poi.objectives.map((objective) => {
        const objectiveProgress = progressByObjectiveSlug.get(objective.slug);

        return {
          ...objective,
          completedAt: objectiveProgress?.completedAt ?? null,
          progressStatus: objectiveProgress?.status ?? 'locked',
        };
      }),
      slug: poi.slug,
    },
    routeSlug: routeDetail.route.slug,
    routeTitle: routeDetail.route.title,
  };
}

export async function getPoiObjectivesSnapshot(
  routeSlug: string,
  poiSlug: MobilePoiDetail['slug'],
): Promise<MobilePoiObjectivesSnapshot | null> {
  const [routeDetail, progress] = await Promise.all([
    getRouteDetail(routeSlug),
    getRouteObjectiveProgress(routeSlug),
  ]);

  if (!routeDetail || !progress) {
    return null;
  }

  return buildPoiObjectivesSnapshot(routeDetail, progress, poiSlug);
}
