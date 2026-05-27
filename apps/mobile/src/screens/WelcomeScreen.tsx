import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Text, View } from 'react-native';

import { ScreenContainer } from '@/components/ScreenContainer';
import { mobileAppConfig } from '@/config/appConfig';

export function WelcomeScreen(): React.JSX.Element {
  return (
    <ScreenContainer>
      <StatusBar style="dark" />
      <View style={styles.wrapper}>
        <Text style={styles.eyebrow}>MVP mobile foundation</Text>
        <Text style={styles.title}>{mobileAppConfig.appName}</Text>
        <Text style={styles.tagline}>{mobileAppConfig.appTagline}</Text>
        <Text style={styles.description}>
          Expo is initialized and ready for the first CityQuest mobile vertical slice.
        </Text>
      </View>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
    backgroundColor: '#f8f4ec',
  },
  eyebrow: {
    marginBottom: 12,
    color: '#1d4f91',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    marginBottom: 8,
    color: '#1c1d21',
    fontSize: 40,
    fontWeight: '800',
    textAlign: 'center',
  },
  tagline: {
    marginBottom: 18,
    color: '#a45a2a',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  description: {
    maxWidth: 320,
    color: '#4f5663',
    fontSize: 16,
    lineHeight: 24,
    textAlign: 'center',
  },
});
