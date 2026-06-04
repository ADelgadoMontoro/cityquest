import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getCurrentObjectiveSnapshot } from '@/services/currentMvpCatalog';

type CurrentObjectiveScreenProps = {
  objectiveSlug?: string;
  onBack: () => void;
  routeSlug: string;
};

export function CurrentObjectiveScreen({
  objectiveSlug,
  onBack,
  routeSlug,
}: CurrentObjectiveScreenProps): React.JSX.Element {
  const currentObjective = getCurrentObjectiveSnapshot(routeSlug, objectiveSlug);

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
      <View style={styles.wrapper}>
        <Text style={styles.eyebrow}>Current Objective</Text>
        <Text style={styles.title}>{currentObjective.objective.title}</Text>
        <Text style={styles.description}>
          This is the navigation landing point for the future gameplay slice. The next EVOs can
          replace this in-memory adapter with the real route payload and then add hints,
          validation, and unlocks.
        </Text>

        <View style={styles.objectiveCard}>
          <Text style={styles.objectiveTitle}>{currentObjective.poiName}</Text>
          <Text style={styles.objectiveValue}>{currentObjective.routeTitle}</Text>
          <Text style={styles.objectiveBody}>Destination: {currentObjective.destinationName}</Text>
          <Text style={styles.objectiveBody}>
            Target type: {currentObjective.objective.targetType}
          </Text>
          <Text style={styles.objectiveBody}>
            Difficulty: {currentObjective.objective.difficulty}
          </Text>
          <Text style={styles.objectiveBody}>
            Mode: {currentObjective.objective.indoorMode ? 'indoor' : 'outdoor'}
          </Text>
          <Text style={styles.objectiveBody}>
            Expected next payload source: {`GET /routes/${routeSlug}`}
          </Text>
        </View>

        <PrimaryButton label="Back to Route Detail" onPress={onBack} />
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
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
  objectiveCard: {
    gap: 10,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#fff9f1',
    borderWidth: 1,
    borderColor: '#e6d5bf',
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
});
