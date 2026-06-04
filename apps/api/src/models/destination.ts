export type DestinationListItem = {
  coverImageUrl: string | null;
  description: string | null;
  displayOrder: number;
  id: string;
  name: string;
  slug: string;
  status: string;
};

export type DestinationsListSnapshot = {
  destinations: DestinationListItem[];
};
