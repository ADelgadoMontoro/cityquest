import type { MobileObjectiveCaptureAsset } from '@/types/objectiveCapture';
import type { MobileObjectiveVisualValidationResult } from '@/types/objectiveVisualValidation';
import type { MobileCurrentObjectiveSnapshot } from '@/types/route';

export function validateObjectiveImageMock(
  currentObjective: MobileCurrentObjectiveSnapshot | null,
  selectedImage: MobileObjectiveCaptureAsset | null,
): MobileObjectiveVisualValidationResult {
  if (!currentObjective) {
    return {
      message: 'The objective context must be loaded before running the visual mock.',
      status: 'blocked',
    };
  }

  if (!selectedImage?.uri) {
    return {
      message: 'Capture or choose an image before running the visual mock.',
      status: 'blocked',
    };
  }

  return {
    confidence: 0.86,
    message:
      'Mock visual validation passed. This only confirms that an image is ready for the future recognition step.',
    status: 'passed',
  };
}
