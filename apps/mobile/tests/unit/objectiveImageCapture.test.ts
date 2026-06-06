import { describe, expect, it, vi } from 'vitest';

import {
  captureObjectiveImage,
  mapPickedImageAsset,
  selectObjectiveImage,
} from '@/services/objectiveImageCapture';

vi.mock('expo-image-picker', () => ({
  CameraType: {
    back: 'back',
  },
  PermissionStatus: {
    DENIED: 'denied',
    GRANTED: 'granted',
    UNDETERMINED: 'undetermined',
  },
  launchCameraAsync: vi.fn(),
  launchImageLibraryAsync: vi.fn(),
  requestCameraPermissionsAsync: vi.fn(),
  requestMediaLibraryPermissionsAsync: vi.fn(),
}));

import * as ImagePicker from 'expo-image-picker';

describe('objectiveImageCapture', () => {
  it('maps a picked asset into the mobile capture shape', () => {
    expect(
      mapPickedImageAsset({
        assetId: 'asset-1',
        base64: null,
        duration: null,
        exif: null,
        file: undefined,
        fileName: 'capture.jpg',
        fileSize: 12345,
        height: 720,
        mimeType: 'image/jpeg',
        pairedVideoAsset: null,
        type: 'image',
        uri: 'file:///capture.jpg',
        width: 1280,
      }),
    ).toEqual({
      fileName: 'capture.jpg',
      height: 720,
      mimeType: 'image/jpeg',
      uri: 'file:///capture.jpg',
      width: 1280,
    });
  });

  it('returns null when no camera asset is chosen', async () => {
    vi.mocked(ImagePicker.requestCameraPermissionsAsync).mockResolvedValue({
      canAskAgain: true,
      expires: 'never',
      granted: true,
      status: ImagePicker.PermissionStatus.GRANTED,
    });
    vi.mocked(ImagePicker.launchCameraAsync).mockResolvedValue({
      assets: null,
      canceled: true,
    });

    await expect(captureObjectiveImage()).resolves.toBeNull();
  });

  it('throws when camera permission is denied', async () => {
    vi.mocked(ImagePicker.requestCameraPermissionsAsync).mockResolvedValue({
      canAskAgain: true,
      expires: 'never',
      granted: false,
      status: ImagePicker.PermissionStatus.DENIED,
    });

    await expect(captureObjectiveImage()).rejects.toThrow(
      'Camera permission is required to capture an objective image.',
    );
  });

  it('returns the first selected library image when permission is granted', async () => {
    vi.mocked(ImagePicker.requestMediaLibraryPermissionsAsync).mockResolvedValue({
      accessPrivileges: 'all',
      canAskAgain: true,
      expires: 'never',
      granted: true,
      status: ImagePicker.PermissionStatus.GRANTED,
    });
    vi.mocked(ImagePicker.launchImageLibraryAsync).mockResolvedValue({
      assets: [
        {
          assetId: 'asset-2',
          base64: null,
          duration: null,
          exif: null,
          file: undefined,
          fileName: 'library.jpg',
          fileSize: 22222,
          height: 800,
          mimeType: 'image/jpeg',
          pairedVideoAsset: null,
          type: 'image',
          uri: 'file:///library.jpg',
          width: 600,
        },
      ],
      canceled: false,
    });

    await expect(selectObjectiveImage()).resolves.toEqual({
      fileName: 'library.jpg',
      height: 800,
      mimeType: 'image/jpeg',
      uri: 'file:///library.jpg',
      width: 600,
    });
  });
});
