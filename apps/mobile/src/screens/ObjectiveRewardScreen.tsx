import { useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getObjectiveUnlockSnapshot } from '@/services/getObjectiveUnlockSnapshot';
import type { MobileObjectiveUnlockSnapshot } from '@/types/route';

type ObjectiveRewardScreenProps = {
  objectiveSlug?: string;
  onBack: () => void;
  routeSlug: string;
};

export function ObjectiveRewardScreen({
  objectiveSlug,
  onBack,
  routeSlug,
}: ObjectiveRewardScreenProps): React.JSX.Element {
  const [unlockSnapshot, setUnlockSnapshot] = useState<MobileObjectiveUnlockSnapshot | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadUnlockSnapshot() {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const snapshot = await getObjectiveUnlockSnapshot(routeSlug, objectiveSlug);
      setUnlockSnapshot(snapshot);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'The unlocked content could not load from the live Worker API.',
      );
      setUnlockSnapshot(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadUnlockSnapshot();
  }, [objectiveSlug, routeSlug]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Unlocked Story</Text>
          <ActivityIndicator color="#1d4f91" size="small" />
          <Text style={styles.title}>Loading reward</Text>
          <Text style={styles.description}>
            The app is reading the unlockable narrative content from `GET /objectives/:objectiveSlug/unlocks`.
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
          <Text style={styles.eyebrow}>Unlocked Story</Text>
          <Text style={styles.title}>Reward unavailable</Text>
          <Text style={styles.description}>{errorMessage}</Text>
          <PrimaryButton label="Retry" onPress={() => void loadUnlockSnapshot()} />
          <PrimaryButton label="Back to Objective" onPress={onBack} />
        </View>
      </ScreenContainer>
    );
  }

  if (!unlockSnapshot || unlockSnapshot.unlockableContents.length === 0) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Unlocked Story</Text>
          <Text style={styles.title}>Reward not available</Text>
          <Text style={styles.description}>
            This objective does not have published unlockable content in the live MVP dataset yet.
          </Text>
          <PrimaryButton label="Back to Objective" onPress={onBack} />
        </View>
      </ScreenContainer>
    );
  }

  const primaryUnlock = unlockSnapshot.unlockableContents[0];

  return (
    <ScreenContainer>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.eyebrow}>Unlocked Story</Text>
        <Text style={styles.title}>{primaryUnlock.title}</Text>
        <Text style={styles.description}>
          This is the first real narrative payoff delivered from D1. The validation gate is still a
          later EVO, but the reward content itself is now live.
        </Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryLabel}>Objective completed context</Text>
          <Text style={styles.summaryTitle}>{unlockSnapshot.objective.title}</Text>
          <Text style={styles.summaryValue}>{unlockSnapshot.poiName}</Text>
          <Text style={styles.summaryBody}>Route: {unlockSnapshot.routeTitle}</Text>
          <Text style={styles.summaryBody}>Destination: {unlockSnapshot.destinationName}</Text>
          <Text style={styles.summaryBody}>Reward items: {unlockSnapshot.unlockableContents.length}</Text>
        </View>

        <View style={styles.rewardCard}>
          <Text style={styles.rewardType}>{primaryUnlock.contentType}</Text>
          <Text style={styles.rewardTitle}>{primaryUnlock.title}</Text>
          <Text style={styles.rewardSummary}>{primaryUnlock.shortText}</Text>
          <Text style={styles.rewardBody}>{primaryUnlock.longText}</Text>
        </View>

        {(primaryUnlock.imageUrl || primaryUnlock.audioUrl) && (
          <View style={styles.mediaCard}>
            <Text style={styles.mediaTitle}>Associated media</Text>
            <Text style={styles.mediaBody}>
              {primaryUnlock.imageUrl
                ? `Image asset ready: ${primaryUnlock.imageUrl}`
                : 'No image asset is attached to this reward.'}
            </Text>
            <Text style={styles.mediaBody}>
              {primaryUnlock.audioUrl
                ? `Audio asset ready: ${primaryUnlock.audioUrl}`
                : 'No audio asset is attached to this reward.'}
            </Text>
          </View>
        )}

        <PrimaryButton label="Back to Objective" onPress={onBack} />
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
    fontSize: 18,
    fontWeight: '800',
  },
  summaryValue: {
    color: '#a45a2a',
    fontSize: 15,
    fontWeight: '700',
  },
  summaryBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 22,
  },
  rewardCard: {
    gap: 14,
    padding: 22,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6d5bf',
  },
  rewardType: {
    color: '#1d4f91',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  rewardTitle: {
    color: '#1c1d21',
    fontSize: 22,
    fontWeight: '800',
  },
  rewardSummary: {
    color: '#a45a2a',
    fontSize: 16,
    lineHeight: 24,
    fontWeight: '700',
  },
  rewardBody: {
    color: '#4f5663',
    fontSize: 16,
    lineHeight: 25,
  },
  mediaCard: {
    gap: 10,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6d5bf',
  },
  mediaTitle: {
    color: '#1c1d21',
    fontSize: 18,
    fontWeight: '800',
  },
  mediaBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 22,
  },
});
