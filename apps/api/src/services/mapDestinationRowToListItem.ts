import type { DestinationListItem } from '../models/destination';

export type DestinationRow = {
  cover_image_url: string | null;
  description: string | null;
  display_order: number;
  id: string;
  name: string;
  slug: string;
  status: string;
};

export function mapDestinationRowToListItem(row: DestinationRow): DestinationListItem {
  return {
    coverImageUrl: row.cover_image_url,
    description: row.description,
    displayOrder: row.display_order,
    id: row.id,
    name: row.name,
    slug: row.slug,
    status: row.status,
  };
}
