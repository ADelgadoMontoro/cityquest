import { describe, expect, it, vi } from 'vitest';

import {
  MVP_DEMO_ACTOR_ID,
  registerObjectiveCompletion,
} from '@/services/registerObjectiveCompletion';

function createJsonResponse(payload: unknown, status = 200): Response {
  return new Response(JSON.stringify(payload), {
    headers: {
      'content-type': 'application/json',
    },
    status,
  });
}

describe('registerObjectiveCompletion', () => {
  it('posts the MVP completion payload with the default demo actor', async () => {
    const fetchMock = vi.fn().mockResolvedValue(
      createJsonResponse(
        {
          data: {
            completion: {
              actorId: MVP_DEMO_ACTOR_ID,
              completedAt: '2026-07-19T12:00:00.000Z',
              gpsStatus: 'within_radius',
              id: 'completion-estatua-san-fernando-dcfcf308',
              objectiveSlug: 'estatua-san-fernando',
              routeSlug: 'jaen-echoes-of-stone',
              validationMode: 'mock_visual',
              visualStatus: 'passed',
            },
          },
          meta: {},
          success: true,
        },
      ),
    );

    vi.stubGlobal('fetch', fetchMock);

    await expect(
      registerObjectiveCompletion({
        gpsStatus: 'within_radius',
        objectiveSlug: 'estatua-san-fernando',
        routeSlug: 'jaen-echoes-of-stone',
        validationMode: 'mock_visual',
        visualStatus: 'passed',
      }),
    ).resolves.toEqual({
      actorId: MVP_DEMO_ACTOR_ID,
      completedAt: '2026-07-19T12:00:00.000Z',
      gpsStatus: 'within_radius',
      id: 'completion-estatua-san-fernando-dcfcf308',
      objectiveSlug: 'estatua-san-fernando',
      routeSlug: 'jaen-echoes-of-stone',
      validationMode: 'mock_visual',
      visualStatus: 'passed',
    });

    expect(fetchMock).toHaveBeenCalledWith(
      'http://127.0.0.1:8787/objectives/estatua-san-fernando/completions',
      expect.objectContaining({
        body: JSON.stringify({
          actorId: MVP_DEMO_ACTOR_ID,
          gpsStatus: 'within_radius',
          routeSlug: 'jaen-echoes-of-stone',
          validationMode: 'mock_visual',
          visualStatus: 'passed',
        }),
        method: 'POST',
      }),
    );
  });

  it('throws a useful error when completion persistence fails', async () => {
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('failure', { status: 500 })));

    await expect(
      registerObjectiveCompletion({
        gpsStatus: 'within_radius',
        objectiveSlug: 'estatua-san-fernando',
        routeSlug: 'jaen-echoes-of-stone',
        validationMode: 'mock_visual',
        visualStatus: 'passed',
      }),
    ).rejects.toThrow('Failed to register objective completion: 500');
  });
});
