import { StatusBar } from 'expo-status-bar';
import { ScrollView, StyleSheet, Text, View } from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { listCurrentDestinations } from '@/services/currentMvpCatalog';

type DestinationsScreenProps = {
  onBack: () => void;
  onOpenRoute: (routeSlug: string) => void;
};

export function DestinationsScreen({
  onBack,
  onOpenRoute,
}: DestinationsScreenProps): React.JSX.Element {
  const destinations = listCurrentDestinations();

  return (
    <ScreenContainer>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.eyebrow}>Destinations</Text>
        <Text style={styles.title}>Choose the current MVP destination</Text>
        <Text style={styles.description}>
          This navigation slice already matches the real backend structure behind `GET
          /destinations`. Today the live catalog is intentionally small: one published destination,
          one route, and two seeded POIs.
        </Text>

        {destinations.map((destination) => (
          <View key={destination.id} style={styles.card}>
            <Text style={styles.cardTitle}>{destination.name}</Text>
            <Text style={styles.cardBody}>{destination.description}</Text>
            <Text style={styles.metaLabel}>Current route</Text>
            <Text style={styles.metaValue}>{destination.routeTitle}</Text>
            <Text style={styles.metaHint}>API shape: `GET /destinations`</Text>
            <PrimaryButton label="Open Route" onPress={() => onOpenRoute(destination.routeSlug)} />
          </View>
        ))}

        <PrimaryButton label="Back to Welcome" onPress={onBack} />
      </ScrollView>
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
});
