import type {
  ObjectiveUnlockSummary,
  UnlockableContentItem,
} from '../models/unlock';

export type ObjectiveUnlockRow = {
  id: string;
  slug: string;
  title: string;
};

export type UnlockableContentRow = {
  audio_url: string | null;
  content_type: string;
  display_order: number;
  id: string;
  image_url: string | null;
  long_text: string | null;
  objective_id: string;
  short_text: string | null;
  title: string;
};

export function mapObjectiveUnlockRowToSummary(row: ObjectiveUnlockRow): ObjectiveUnlockSummary {
  return {
    id: row.id,
    slug: row.slug,
    title: row.title,
  };
}

export function mapUnlockableContentRowToItem(
  row: UnlockableContentRow,
): UnlockableContentItem {
  return {
    audioUrl: row.audio_url,
    contentType: row.content_type,
    displayOrder: row.display_order,
    id: row.id,
    imageUrl: row.image_url,
    longText: row.long_text,
    shortText: row.short_text,
    title: row.title,
  };
}
