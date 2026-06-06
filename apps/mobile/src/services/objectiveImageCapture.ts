import * as ImagePicker from 'expo-image-picker';

import type { MobileObjectiveCaptureAsset } from '@/types/objectiveCapture';

function mapPickedImageAsset(
  asset: ImagePicker.ImagePickerAsset | undefined,
): MobileObjectiveCaptureAsset | null {
  if (!asset) {
    return null;
  }

  return {
    fileName: asset.fileName ?? null,
    height: typeof asset.height === 'number' ? asset.height : null,
    mimeType: asset.mimeType ?? null,
    uri: asset.uri,
    width: typeof asset.width === 'number' ? asset.width : null,
  };
}

export async function captureObjectiveImage(): Promise<MobileObjectiveCaptureAsset | null> {
  const permission = await ImagePicker.requestCameraPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Camera permission is required to capture an objective image.');
  }

  const result = await ImagePicker.launchCameraAsync({
    allowsEditing: false,
    cameraType: ImagePicker.CameraType.back,
    mediaTypes: ['images'] as ImagePicker.MediaType[],
    quality: 1,
  });

  if (result.canceled) {
    return null;
  }

  return mapPickedImageAsset(result.assets[0]);
}

export async function selectObjectiveImage(): Promise<MobileObjectiveCaptureAsset | null> {
  const permission = await ImagePicker.requestMediaLibraryPermissionsAsync();

  if (!permission.granted) {
    throw new Error('Media library permission is required to choose an objective image.');
  }

  const result = await ImagePicker.launchImageLibraryAsync({
    allowsEditing: false,
    mediaTypes: ['images'] as ImagePicker.MediaType[],
    quality: 1,
    selectionLimit: 1,
  });

  if (result.canceled) {
    return null;
  }

  return mapPickedImageAsset(result.assets[0]);
}

export { mapPickedImageAsset };
