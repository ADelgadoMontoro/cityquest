import { useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getPoiObjectivesSnapshot } from '@/services/getPoiObjectivesSnapshot';
import type {
  MobileObjectiveProgressStatus,
  MobilePoiObjectiveListItem,
  MobilePoiObjectivesSnapshot,
} from '@/types/objectiveProgress';

type PoiObjectivesScreenProps = {
  onBack: () => void;
  onOpenCurrentObjective: (routeSlug: string, objectiveSlug: string) => void;
  onOpenObjectiveReward: (routeSlug: string, objectiveSlug: string) => void;
  poiSlug: string;
  routeSlug: string;
};

function getStatusLabel(status: MobileObjectiveProgressStatus): string {
  if (status === 'completed') {
    return 'Completed';
  }

  if (status === 'current') {
    return 'Current objective';
  }

  return 'Locked';
}

function getStatusHelper(objective: MobilePoiObjectiveListItem): string {
  if (objective.progressStatus === 'completed') {
    return objective.completedAt
      ? `Reward unlocked on ${new Date(objective.completedAt).toLocaleDateString()}.`
      : 'Reward unlocked and available to revisit.';
  }

  if (objective.progressStatus === 'current') {
    return 'Continue here to capture the objective, pass GPS, and unlock the reward.';
  }

  return [
    'Complete previous objectives first.',
    'This target is visible so the route progression feels clear.',
  ].join(' ');
}

export function PoiObjectivesScreen({
  onBack,
  onOpenCurrentObjective,
  onOpenObjectiveReward,
  poiSlug,
  routeSlug,
}: PoiObjectivesScreenProps): React.JSX.Element {
  const [snapshot, setSnapshot] = useState<MobilePoiObjectivesSnapshot | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadPoiObjectives() {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const nextSnapshot = await getPoiObjectivesSnapshot(routeSlug, poiSlug);
      setSnapshot(nextSnapshot);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'The POI objectives screen could not load route progress.',
      );
      setSnapshot(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadPoiObjectives();
  }, [poiSlug, routeSlug]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Objectives</Text>
          <ActivityIndicator color="#1d4f91" size="small" />
          <Text style={styles.title}>Loading POI objectives</Text>
          <Text style={styles.description}>
            The app is merging route detail with MVP completion progress.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (errorMessage) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Objectives</Text>
          <Text style={styles.title}>Objectives unavailable</Text>
          <Text style={styles.description}>{errorMessage}</Text>
          <PrimaryButton label="Retry" onPress={() => void loadPoiObjectives()} />
          <PrimaryButton label="Back to Route Detail" onPress={onBack} />
        </View>
      </ScreenContainer>
    );
  }

  if (!snapshot) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Objectives</Text>
          <Text style={styles.title}>POI not available</Text>
          <Text style={styles.description}>
            This POI does not exist in the current route payload, or progress is unavailable.
          </Text>
          <Text style={styles.slug}>{poiSlug}</Text>
          <PrimaryButton label="Back to Route Detail" onPress={onBack} />
        </View>
      </ScreenContainer>
    );
  }

  const completedCount = snapshot.poi.objectives.filter(
    (objective) => objective.progressStatus === 'completed',
  ).length;
  const currentObjective = snapshot.poi.objectives.find(
    (objective) => objective.progressStatus === 'current',
  );

  return (
    <ScreenContainer>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.eyebrow}>Objectives</Text>
        <Text style={styles.title}>{snapshot.poi.name}</Text>
        <Text style={styles.description}>{snapshot.poi.description}</Text>
        <Text style={styles.slug}>{snapshot.routeTitle}</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>POI progress</Text>
          <Text style={styles.summaryTitle}>
            {completedCount}/{snapshot.poi.objectives.length} completed
          </Text>
          <Text style={styles.summaryBody}>
            {currentObjective
              ? `Current objective: ${currentObjective.title}`
              : 'All currently published objectives in this POI are completed.'}
          </Text>
          <Text style={styles.summaryBody}>
            {snapshot.poi.indoorMode ? 'Indoor-focused POI' : 'Outdoor-focused POI'}
          </Text>
        </View>

        {snapshot.poi.objectives.map((objective) => {
          const isCompleted = objective.progressStatus === 'completed';
          const isCurrent = objective.progressStatus === 'current';
          const isLocked = objective.progressStatus === 'locked';

          return (
            <View
              key={objective.slug}
              style={[
                styles.objectiveCard,
                isCompleted && styles.completedCard,
                isCurrent && styles.currentCard,
                isLocked && styles.lockedCard,
              ]}
            >
              <Text
                style={[
                  styles.objectiveStatus,
                  isCompleted && styles.completedText,
                  isCurrent && styles.currentText,
                  isLocked && styles.lockedText,
                ]}
              >
                {getStatusLabel(objective.progressStatus)}
              </Text>
              <Text style={[styles.objectiveTitle, isLocked && styles.lockedText]}>
                {objective.title}
              </Text>
              <Text style={[styles.objectiveBody, isLocked && styles.lockedBody]}>
                {objective.description}
              </Text>
              <Text style={[styles.objectiveMeta, isLocked && styles.lockedBody]}>
                Difficulty: {objective.difficulty} · Target: {objective.targetType}
              </Text>
              <Text style={[styles.objectiveHelper, isLocked && styles.lockedBody]}>
                {getStatusHelper(objective)}
              </Text>

              {isCompleted ? (
                <PrimaryButton
                  label="View Reward"
                  onPress={() => onOpenObjectiveReward(snapshot.routeSlug, objective.slug)}
                />
              ) : null}

              {isCurrent ? (
                <PrimaryButton
                  label="Continue Objective"
                  onPress={() => onOpenCurrentObjective(snapshot.routeSlug, objective.slug)}
                />
              ) : null}

              {isLocked ? (
                <PrimaryButton disabled label="Locked" onPress={() => undefined} />
              ) : null}
            </View>
          );
        })}

        <PrimaryButton label="Back to Route Detail" onPress={onBack} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 18,
    backgroundColor: '#f8f4ec',
  },
  eyebrow: {
    color: '#1d4f91',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#1c1d21',
    fontSize: 32,
    fontWeight: '800',
  },
  description: {
    color: '#4f5663',
    fontSize: 16,
    lineHeight: 24,
  },
  slug: {
    color: '#a45a2a',
    fontSize: 15,
    fontWeight: '700',
  },
  summaryCard: {
    gap: 10,
    padding: 22,
    borderRadius: 24,
    backgroundColor: '#fff9f1',
    borderWidth: 1,
    borderColor: '#e6d5bf',
  },
  summaryLabel: {
    color: '#a45a2a',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  summaryTitle: {
    color: '#1c1d21',
    fontSize: 20,
    fontWeight: '800',
  },
  summaryBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 22,
  },
  objectiveCard: {
    gap: 12,
    padding: 22,
    borderRadius: 26,
    borderWidth: 1,
  },
  completedCard: {
    backgroundColor: '#eef7ed',
    borderColor: '#b8d9b2',
  },
  currentCard: {
    backgroundColor: '#fff9f1',
    borderColor: '#b55b24',
  },
  lockedCard: {
    backgroundColor: '#eef0f3',
    borderColor: '#c6ccd4',
  },
  objectiveStatus: {
    fontSize: 13,
    fontWeight: '800',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  completedText: {
    color: '#2e6b32',
  },
  currentText: {
    color: '#a45a2a',
  },
  lockedText: {
    color: '#6d7580',
  },
  objectiveTitle: {
    color: '#1c1d21',
    fontSize: 21,
    fontWeight: '800',
  },
  objectiveBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 23,
  },
  objectiveMeta: {
    color: '#7a6f61',
    fontSize: 13,
    lineHeight: 20,
  },
  objectiveHelper: {
    color: '#4f5663',
    fontSize: 14,
    lineHeight: 21,
  },
  lockedBody: {
    color: '#7b8491',
  },
});
