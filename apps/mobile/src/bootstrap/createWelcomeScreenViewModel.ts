import { mobileAppConfig } from '@/config/appConfig';
import type { WelcomeScreenViewModel } from '@/types/welcome';

export function createWelcomeScreenViewModel(): WelcomeScreenViewModel {
  return {
    eyebrow: 'MVP mobile foundation',
    title: mobileAppConfig.appName,
    tagline: mobileAppConfig.appTagline,
    description: 'Expo is initialized and ready for the first CityQuest mobile vertical slice.',
  };
}
