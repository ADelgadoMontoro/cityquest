import { useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getRouteDetail } from '@/services/getRouteDetail';
import type { MobileRouteDetail } from '@/types/route';

type RouteDetailScreenProps = {
  onBack: () => void;
  onOpenCurrentObjective: (routeSlug: string, objectiveSlug?: string) => void;
  routeSlug: string;
};

export function RouteDetailScreen({
  onBack,
  onOpenCurrentObjective,
  routeSlug,
}: RouteDetailScreenProps): React.JSX.Element {
  const [routeDetail, setRouteDetail] = useState<MobileRouteDetail | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadRouteDetail() {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const snapshot = await getRouteDetail(routeSlug);
      setRouteDetail(snapshot);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'The route detail screen could not load the live route payload.',
      );
      setRouteDetail(null);
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadRouteDetail();
  }, [routeSlug]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Route Detail</Text>
          <ActivityIndicator color="#1d4f91" size="small" />
          <Text style={styles.title}>Loading route</Text>
          <Text style={styles.description}>
            The app is reading the real route payload from `GET /routes/{routeSlug}`.
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
          <Text style={styles.eyebrow}>Route Detail</Text>
          <Text style={styles.title}>Route unavailable</Text>
          <Text style={styles.description}>{errorMessage}</Text>
          <PrimaryButton label="Retry" onPress={() => void loadRouteDetail()} />
          <PrimaryButton label="Back to Destinations" onPress={onBack} />
        </View>
      </ScreenContainer>
    );
  }

  if (!routeDetail) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Route Detail</Text>
          <Text style={styles.title}>Route not available</Text>
          <Text style={styles.description}>
            This navigation step is wired for the real route detail endpoint, but the requested
            slug is not published in the live backend right now.
          </Text>
          <Text style={styles.slug}>{routeSlug}</Text>
          <PrimaryButton label="Back to Destinations" onPress={onBack} />
        </View>
      </ScreenContainer>
    );
  }

  const firstObjective = routeDetail.pois[0]?.objectives[0];

  return (
    <ScreenContainer>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.eyebrow}>Route Detail</Text>
        <Text style={styles.title}>{routeDetail.route.title}</Text>
        <Text style={styles.description}>
          This screen now reads the live route detail payload exposed by `GET /routes/:routeSlug`.
        </Text>
        <Text style={styles.slug}>{routeSlug}</Text>

        <View style={styles.summaryCard}>
          <Text style={styles.summaryTitle}>{routeDetail.destination.name}</Text>
          <Text style={styles.summaryBody}>{routeDetail.route.description}</Text>
          <Text style={styles.summaryBody}>Difficulty: {routeDetail.route.difficulty}</Text>
          <Text style={styles.summaryBody}>
            Estimated duration: {routeDetail.route.estimatedDurationMinutes} minutes
          </Text>
          <Text style={styles.summaryBody}>Published POIs: {routeDetail.pois.length}</Text>
          <Text style={styles.summaryBody}>Experience mode: live route preview</Text>
        </View>

        <PrimaryButton
          label="Open Current Objective"
          onPress={() => onOpenCurrentObjective(routeSlug, firstObjective?.slug)}
        />

        {routeDetail.pois.map((poi) => (
          <View key={poi.slug} style={styles.poiCard}>
            <Text style={styles.poiTitle}>{poi.name}</Text>
            <Text style={styles.poiBody}>{poi.description}</Text>
            <Text style={styles.poiMeta}>
              {poi.indoorMode ? 'Indoor-focused POI' : 'Outdoor-focused POI'}
            </Text>
            <Text style={styles.poiMeta}>Objectives: {poi.objectives.length}</Text>
          </View>
        ))}

        <PrimaryButton label="Back to Destinations" onPress={onBack} />
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
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#fff9f1',
    borderWidth: 1,
    borderColor: '#e6d5bf',
  },
  summaryTitle: {
    color: '#1c1d21',
    fontSize: 18,
    fontWeight: '800',
  },
  summaryBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 22,
  },
  poiBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 22,
  },
  poiCard: {
    gap: 10,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6d5bf',
  },
  poiMeta: {
    color: '#7a6f61',
    fontSize: 13,
    lineHeight: 20,
  },
  poiTitle: {
    color: '#1c1d21',
    fontSize: 20,
    fontWeight: '800',
  },
});
