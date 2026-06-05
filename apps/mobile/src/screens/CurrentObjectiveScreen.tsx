import { useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getCurrentObjectiveSnapshot } from '@/services/getCurrentObjectiveSnapshot';
import type { MobileCurrentObjectiveSnapshot } from '@/types/route';

type CurrentObjectiveScreenProps = {
  objectiveSlug?: string;
  onBack: () => void;
  onOpenUnlockedStory: (routeSlug: string, objectiveSlug?: string) => void;
  routeSlug: string;
};

export function CurrentObjectiveScreen({
  objectiveSlug,
  onBack,
  onOpenUnlockedStory,
  routeSlug,
}: CurrentObjectiveScreenProps): React.JSX.Element {
  const [currentObjective, setCurrentObjective] = useState<MobileCurrentObjectiveSnapshot | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadCurrentObjective() {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const snapshot = await getCurrentObjectiveSnapshot(routeSlug, objectiveSlug);
      setCurrentObjective(snapshot);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'The current objective screen could not load the live route payload.',
      );
      setCurrentObjective(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadCurrentObjective();
  }, [objectiveSlug, routeSlug]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Current Objective</Text>
          <ActivityIndicator color="#1d4f91" size="small" />
          <Text style={styles.title}>Loading objective</Text>
          <Text style={styles.description}>
            The app is resolving the selected objective from the live route payload.
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
          <Text style={styles.eyebrow}>Current Objective</Text>
          <Text style={styles.title}>Objective unavailable</Text>
          <Text style={styles.description}>{errorMessage}</Text>
          <PrimaryButton label="Retry" onPress={() => void loadCurrentObjective()} />
          <PrimaryButton label="Back to Route Detail" onPress={onBack} />
        </View>
      </ScreenContainer>
    );
  }

  if (!currentObjective) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Current Objective</Text>
          <Text style={styles.title}>Objective not available</Text>
          <Text style={styles.description}>
            This screen is reserved for the gameplay slice, but the requested objective does not
            exist in the current MVP catalog.
          </Text>
          <PrimaryButton label="Back to Route Detail" onPress={onBack} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.eyebrow}>Current Objective</Text>
        <Text style={styles.title}>{currentObjective.objective.title}</Text>
        <Text style={styles.description}>
          {currentObjective.objective.description ||
            'This objective is now sourced from the live route payload and acts as the gameplay-prep landing point for the MVP.'}
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Focus location</Text>
          <Text style={styles.objectiveTitle}>{currentObjective.poiName}</Text>
          <Text style={styles.objectiveValue}>{currentObjective.routeTitle}</Text>
          <Text style={styles.objectiveBody}>Destination: {currentObjective.destinationName}</Text>
          <Text style={styles.objectiveBody}>
            Difficulty: {currentObjective.objective.difficulty}
          </Text>
          <Text style={styles.objectiveBody}>
            Mode: {currentObjective.objective.indoorMode ? 'indoor' : 'outdoor'}
          </Text>
          <Text style={styles.objectiveBody}>
            Target type: {currentObjective.objective.targetType}
          </Text>
          <Text style={styles.objectiveBody}>
            GPS radius:{' '}
            {currentObjective.objective.gpsRadiusMeters
              ? `${currentObjective.objective.gpsRadiusMeters} meters`
              : 'not defined yet'}
          </Text>
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Narrative reward</Text>
          <Text style={styles.supportBody}>
            The full validation gate is still a later EVO, but the first unlockable story is
            already live in D1. You can open it now to exercise the reward payload end to end.
          </Text>
          <PrimaryButton
            label="Open Unlocked Story"
            onPress={() => onOpenUnlockedStory(routeSlug, currentObjective.objective.slug)}
          />
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Progressive hints</Text>
          <Text style={styles.supportBody}>
            Hints are already seeded in D1 and exposed by the Worker API. The reveal interaction for
            this screen is the next missing slice.
          </Text>
          <PrimaryButton disabled label="Hints Coming Soon" onPress={() => undefined} />
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Camera validation</Text>
          <Text style={styles.supportBody}>
            Camera capture is intentionally not active yet. This slice prepares the gameplay screen
            without pretending that validation, permissions, or photo analysis already exist.
          </Text>
          <PrimaryButton disabled label="Camera Coming Soon" onPress={() => undefined} />
        </View>

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
  heroCard: {
    gap: 10,
    padding: 22,
    borderRadius: 24,
    backgroundColor: '#fff9f1',
    borderWidth: 1,
    borderColor: '#e6d5bf',
  },
  heroLabel: {
    color: '#a45a2a',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  objectiveTitle: {
    color: '#1c1d21',
    fontSize: 18,
    fontWeight: '800',
  },
  objectiveValue: {
    color: '#a45a2a',
    fontSize: 15,
    fontWeight: '700',
  },
  objectiveBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 22,
  },
  supportCard: {
    gap: 14,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6d5bf',
  },
  supportTitle: {
    color: '#1c1d21',
    fontSize: 18,
    fontWeight: '800',
  },
  supportBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 23,
  },
});
