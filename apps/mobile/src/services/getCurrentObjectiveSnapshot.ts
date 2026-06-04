import { getRouteDetail } from '@/services/getRouteDetail';
import type { MobileCurrentObjectiveSnapshot, MobileRouteDetail } from '@/types/route';

function deriveCurrentObjectiveSnapshot(
  routeDetail: MobileRouteDetail,
  objectiveSlug?: string,
): MobileCurrentObjectiveSnapshot | null {
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

export async function getCurrentObjectiveSnapshot(
  routeSlug: string,
  objectiveSlug?: string,
): Promise<MobileCurrentObjectiveSnapshot | null> {
  const routeDetail = await getRouteDetail(routeSlug);

  if (!routeDetail) {
    return null;
  }

  return deriveCurrentObjectiveSnapshot(routeDetail, objectiveSlug);
}
