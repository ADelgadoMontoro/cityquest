export const mobileAppConfig = {
  appName: 'CityQuest',
  appTagline: 'Gamified cultural exploration',
  apiBaseUrl: process.env.EXPO_PUBLIC_API_BASE_URL ?? 'http://127.0.0.1:8787',
} as const;
