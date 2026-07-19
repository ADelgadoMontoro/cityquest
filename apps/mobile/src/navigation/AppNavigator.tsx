import { useState } from 'react';

import { CurrentObjectiveScreen } from '@/screens/CurrentObjectiveScreen';
import { DestinationsScreen } from '@/screens/DestinationsScreen';
import { ObjectiveRewardScreen } from '@/screens/ObjectiveRewardScreen';
import { PoiObjectivesScreen } from '@/screens/PoiObjectivesScreen';
import { RouteDetailScreen } from '@/screens/RouteDetailScreen';
import { WelcomeScreen } from '@/screens/WelcomeScreen';
import type { AppRoute } from '@/types/navigation';

const INITIAL_ROUTE: AppRoute = {
  name: 'welcome',
};

export function AppNavigator(): React.JSX.Element {
  const [routeStack, setRouteStack] = useState<AppRoute[]>([INITIAL_ROUTE]);

  const currentRoute = routeStack[routeStack.length - 1] ?? INITIAL_ROUTE;

  function navigate(nextRoute: AppRoute) {
    setRouteStack((currentStack) => [...currentStack, nextRoute]);
  }

  function goBack() {
    setRouteStack((currentStack) => {
      if (currentStack.length <= 1) {
        return currentStack;
      }

      return currentStack.slice(0, -1);
    });
  }

  if (currentRoute.name === 'destinations') {
    return (
      <DestinationsScreen
        onBack={goBack}
        onOpenRoute={(routeSlug) =>
          navigate({
            name: 'routeDetail',
            params: {
              routeSlug,
            },
          })
        }
      />
    );
  }

  if (currentRoute.name === 'routeDetail') {
    return (
      <RouteDetailScreen
        onBack={goBack}
        onOpenPoiObjectives={(routeSlug, poiSlug) =>
          navigate({
            name: 'poiObjectives',
            params: {
              poiSlug,
              routeSlug,
            },
          })
        }
        routeSlug={currentRoute.params.routeSlug}
      />
    );
  }

  if (currentRoute.name === 'poiObjectives') {
    return (
      <PoiObjectivesScreen
        onBack={goBack}
        onOpenCurrentObjective={(routeSlug, objectiveSlug) =>
          navigate({
            name: 'currentObjective',
            params: {
              objectiveSlug,
              routeSlug,
            },
          })
        }
        onOpenObjectiveReward={(routeSlug, objectiveSlug) =>
          navigate({
            name: 'objectiveReward',
            params: {
              backLabel: 'Back to Objectives',
              entryMode: 'direct',
              objectiveSlug,
              routeSlug,
            },
          })
        }
        poiSlug={currentRoute.params.poiSlug}
        routeSlug={currentRoute.params.routeSlug}
      />
    );
  }

  if (currentRoute.name === 'currentObjective') {
    return (
      <CurrentObjectiveScreen
        objectiveSlug={currentRoute.params.objectiveSlug}
        onBack={goBack}
        onOpenUnlockedStory={(routeSlug, objectiveSlug) =>
          navigate({
            name: 'objectiveReward',
            params: {
              entryMode: 'mockValidation',
              objectiveSlug,
              routeSlug,
            },
          })
        }
        routeSlug={currentRoute.params.routeSlug}
      />
    );
  }

  if (currentRoute.name === 'objectiveReward') {
    return (
      <ObjectiveRewardScreen
        backLabel={currentRoute.params.backLabel}
        entryMode={currentRoute.params.entryMode}
        objectiveSlug={currentRoute.params.objectiveSlug}
        onBack={goBack}
        routeSlug={currentRoute.params.routeSlug}
      />
    );
  }

  return (
    <WelcomeScreen
      onStart={() =>
        navigate({
          name: 'destinations',
        })
      }
    />
  );
}
