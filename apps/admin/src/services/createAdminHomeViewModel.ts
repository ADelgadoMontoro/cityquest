import type { AdminHomeViewModel } from '@/types/admin-home';

export function createAdminHomeViewModel(): AdminHomeViewModel {
  return {
    eyebrow: 'CityQuest Control Room',
    title: 'Admin panel foundation for the CityQuest platform.',
    subtitle:
      'This workspace is ready to grow into the internal tool for managing destinations, routes, POIs, visual validation targets, unlocked content, and operational insight.',
    stack: ['Next.js', 'TypeScript', 'App Router', 'Monorepo-ready'],
    statusCard: {
      title: 'Current scope',
      description:
        'The admin application is intentionally lightweight at this stage. It confirms that the web runtime is working and that CityQuest includes a dedicated administrative surface, not just fixed demo data.',
      nextMilestone:
        'Connect authentication, compose authoring flows, and integrate the backend API.',
    },
    featureCards: [
      {
        label: 'Why it matters',
        title: 'Platform credibility',
        description:
          'The admin panel is part of the professional value of CityQuest. It shows the project can evolve into a real content platform rather than a single-path prototype.',
      },
      {
        label: 'Planned modules',
        title: 'Authoring-first roadmap',
        items: [
          'Destinations and route publishing',
          'POI and visual objective authoring',
          'Unlockable content and storytelling review',
        ],
      },
      {
        label: 'Bootstrap status',
        title: 'Ready for vertical slices',
        items: [
          'Next.js App Router foundation inside the CityQuest monorepo',
          'TypeScript-ready workspace aligned with shared repository conventions',
          'A clear UI structure for future admin modules, services, types, and utilities',
        ],
      },
    ],
  };
}
