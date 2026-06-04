import type { D1Database } from '../types/cloudflare';
import type { DestinationsListSnapshot } from '../models/destination';
import {
  mapDestinationRowToListItem,
  type DestinationRow,
} from './mapDestinationRowToListItem';

const LIST_PUBLISHED_DESTINATIONS_QUERY = `
  SELECT
    id,
    slug,
    name,
    description,
    status,
    cover_image_url,
    display_order
  FROM destinations
  WHERE status = ?
  ORDER BY display_order, name
`;

export type ListPublishedDestinationsService = {
  execute: (database: D1Database) => Promise<DestinationsListSnapshot>;
};

export function createListPublishedDestinationsService(): ListPublishedDestinationsService {
  return {
    async execute(database) {
      const result = await database
        .prepare(LIST_PUBLISHED_DESTINATIONS_QUERY)
        .bind('published')
        .all<DestinationRow>();

      return {
        destinations: (result.results ?? []).map(mapDestinationRowToListItem),
      };
    },
  };
}
