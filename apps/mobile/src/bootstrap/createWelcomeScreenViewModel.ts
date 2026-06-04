import { mobileAppConfig } from '@/config/appConfig';
import type { WelcomeScreenViewModel } from '@/types/welcome';

export function createWelcomeScreenViewModel(): WelcomeScreenViewModel {
  return {
    eyebrow: 'MVP mobile navigation',
    title: mobileAppConfig.appName,
    tagline: mobileAppConfig.appTagline,
    description:
      'The app can now move through the real CityQuest MVP flow: welcome, destinations, route detail, and current objective.',
    primaryActionLabel: 'Enter MVP Flow',
  };
}
