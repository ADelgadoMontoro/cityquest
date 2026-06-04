export type ObjectiveUnlockSummary = {
  id: string;
  slug: string;
  title: string;
};

export type UnlockableContentItem = {
  audioUrl: string | null;
  contentType: string;
  displayOrder: number;
  id: string;
  imageUrl: string | null;
  longText: string | null;
  shortText: string | null;
  title: string;
};

export type ObjectiveUnlocksSnapshot = {
  objective: ObjectiveUnlockSummary;
  unlockableContents: UnlockableContentItem[];
};
