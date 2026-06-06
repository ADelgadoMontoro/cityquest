import { useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import { ActivityIndicator, ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import {
  listLockedDestinationSelectorItems,
  listDestinationSelectorItems,
  type AvailableDestinationSelectorItem,
  type LockedDestinationSelectorItem,
  type PublishedUnroutedDestinationSelectorItem,
} from '@/services/listDestinationSelectorItems';

type DestinationsScreenProps = {
  onBack: () => void;
  onOpenRoute: (routeSlug: string) => void;
};

export function DestinationsScreen({
  onBack,
  onOpenRoute,
}: DestinationsScreenProps): React.JSX.Element {
  const [availableDestinations, setAvailableDestinations] = useState<
    AvailableDestinationSelectorItem[]
  >([]);
  const [publishedUnroutedDestinations, setPublishedUnroutedDestinations] = useState<
    PublishedUnroutedDestinationSelectorItem[]
  >([]);
  const [lockedDestinations] = useState<LockedDestinationSelectorItem[]>(
    listLockedDestinationSelectorItems(),
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  async function loadDestinationSelector() {
    setErrorMessage(null);
    setIsLoading(true);

    try {
      const selectorItems = await listDestinationSelectorItems();

      setAvailableDestinations(selectorItems.availableDestinations);
      setPublishedUnroutedDestinations(selectorItems.publishedUnroutedDestinations);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'The destination selector could not load the live catalog.',
      );
    } finally {
      setIsLoading(false);
    }
  }

  useEffect(() => {
    void loadDestinationSelector();
  }, []);

  return (
    <ScreenContainer>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.eyebrow}>Destinations</Text>
        <Text style={styles.title}>Choose the current MVP destination</Text>
        <Text style={styles.description}>
          This selector now reads the current playable destination from the live Worker API and
          keeps the next roadmap provinces visible as locked items in the mobile UI.
        </Text>

        {isLoading ? (
          <View style={styles.stateCard}>
            <ActivityIndicator color="#1d4f91" size="small" />
            <Text style={styles.stateTitle}>Loading destinations</Text>
            <Text style={styles.stateBody}>
              The app is reading the real published catalog from `GET /destinations`.
            </Text>
          </View>
        ) : null}

        {!isLoading && errorMessage ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>Catalog unavailable</Text>
            <Text style={styles.stateBody}>{errorMessage}</Text>
            <PrimaryButton label="Retry" onPress={() => void loadDestinationSelector()} />
          </View>
        ) : null}

        {!isLoading && !errorMessage
          ? availableDestinations.map((destination) => (
              <View key={destination.id} style={styles.card}>
                <Text style={styles.cardTitle}>{destination.name}</Text>
                <Text style={styles.cardBody}>{destination.description}</Text>
                <Text style={styles.metaLabel}>Current route</Text>
                <Text style={styles.metaValue}>{destination.routeTitle}</Text>
                <Text style={styles.metaHint}>Live API item from `GET /destinations`</Text>
                <PrimaryButton
                  label="Open Route"
                  onPress={() => onOpenRoute(destination.routeSlug)}
                />
              </View>
            ))
          : null}

        {!isLoading && !errorMessage && availableDestinations.length === 0 ? (
          <View style={styles.stateCard}>
            <Text style={styles.stateTitle}>No playable destinations yet</Text>
            <Text style={styles.stateBody}>
              The selector is working, but the backend did not return any published destinations.
            </Text>
          </View>
        ) : null}

        {!isLoading && !errorMessage && publishedUnroutedDestinations.length > 0 ? (
          <>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionEyebrow}>Published In API</Text>
              <Text style={styles.sectionTitle}>Not wired in mobile yet</Text>
            </View>

            {publishedUnroutedDestinations.map((destination) => (
              <View key={destination.id} style={styles.unroutedCard}>
                <Text style={styles.cardTitle}>{destination.name}</Text>
                <Text style={styles.cardBody}>{destination.description}</Text>
                <Text style={styles.unroutedBadge}>Published but not playable here yet</Text>
              </View>
            ))}
          </>
        ) : null}

        <View style={styles.sectionHeader}>
          <Text style={styles.sectionEyebrow}>Roadmap Provinces</Text>
          <Text style={styles.sectionTitle}>Locked for now</Text>
        </View>

        {lockedDestinations.map((destination) => (
          <View key={destination.slug} style={styles.lockedCard}>
            <Text style={styles.cardTitle}>{destination.name}</Text>
            <Text style={styles.cardBody}>{destination.teaser}</Text>
            <Text style={styles.lockedBadge}>Locked destination</Text>
          </View>
        ))}

        <PrimaryButton label="Back to Welcome" onPress={onBack} />
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
  card: {
    gap: 14,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#fff9f1',
    borderWidth: 1,
    borderColor: '#e6d5bf',
  },
  cardTitle: {
    color: '#1c1d21',
    fontSize: 24,
    fontWeight: '800',
  },
  cardBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 22,
  },
  metaHint: {
    color: '#7a6f61',
    fontSize: 13,
    lineHeight: 20,
  },
  metaLabel: {
    color: '#a45a2a',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  metaValue: {
    color: '#1c1d21',
    fontSize: 17,
    fontWeight: '700',
  },
  lockedBadge: {
    color: '#8a6d34',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  lockedCard: {
    gap: 12,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#f2ede4',
    borderWidth: 1,
    borderColor: '#dcccae',
    opacity: 0.92,
  },
  sectionEyebrow: {
    color: '#1d4f91',
    fontSize: 12,
    fontWeight: '700',
    letterSpacing: 1,
    textTransform: 'uppercase',
  },
  sectionHeader: {
    gap: 6,
    marginTop: 4,
  },
  sectionTitle: {
    color: '#1c1d21',
    fontSize: 24,
    fontWeight: '800',
  },
  stateBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 22,
    textAlign: 'center',
  },
  stateCard: {
    gap: 12,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#fff9f1',
    borderWidth: 1,
    borderColor: '#e6d5bf',
    alignItems: 'center',
  },
  stateTitle: {
    color: '#1c1d21',
    fontSize: 20,
    fontWeight: '800',
    textAlign: 'center',
  },
  unroutedBadge: {
    color: '#7a5c24',
    fontSize: 13,
    fontWeight: '700',
    textTransform: 'uppercase',
    letterSpacing: 0.8,
  },
  unroutedCard: {
    gap: 12,
    padding: 20,
    borderRadius: 24,
    backgroundColor: '#f7f0e5',
    borderWidth: 1,
    borderColor: '#e0c99c',
  },
});
