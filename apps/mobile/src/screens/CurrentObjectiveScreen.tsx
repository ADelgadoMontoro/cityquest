import { useEffect, useState } from 'react';

import { StatusBar } from 'expo-status-bar';
import {
  ActivityIndicator,
  Image,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { PrimaryButton } from '@/components/PrimaryButton';
import { ScreenContainer } from '@/components/ScreenContainer';
import { getCurrentObjectiveSnapshot } from '@/services/getCurrentObjectiveSnapshot';
import { getObjectiveUnlockSnapshot } from '@/services/getObjectiveUnlockSnapshot';
import {
  captureObjectiveImage,
  selectObjectiveImage,
} from '@/services/objectiveImageCapture';
import type { MobileObjectiveCaptureAsset } from '@/types/objectiveCapture';
import type { MobileCurrentObjectiveSnapshot } from '@/types/route';

type CurrentObjectiveScreenProps = {
  objectiveSlug?: string;
  onBack: () => void;
  onOpenUnlockedStory: (routeSlug: string, objectiveSlug?: string) => void;
  routeSlug: string;
};

export function CurrentObjectiveScreen({
  objectiveSlug,
  onBack,
  onOpenUnlockedStory,
  routeSlug,
}: CurrentObjectiveScreenProps): React.JSX.Element {
  const [currentObjective, setCurrentObjective] = useState<MobileCurrentObjectiveSnapshot | null>(
    null,
  );
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isMockValidating, setIsMockValidating] = useState(false);
  const [mockValidationError, setMockValidationError] = useState<string | null>(null);
  const [captureError, setCaptureError] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<MobileObjectiveCaptureAsset | null>(null);
  const [isCapturing, setIsCapturing] = useState(false);
  const [isSelectingFromLibrary, setIsSelectingFromLibrary] = useState(false);

  async function loadCurrentObjective() {
    setErrorMessage(null);
    setIsLoading(true);
    setMockValidationError(null);

    try {
      const snapshot = await getCurrentObjectiveSnapshot(routeSlug, objectiveSlug);
      setCurrentObjective(snapshot);
    } catch (error) {
      setErrorMessage(
        error instanceof Error
          ? error.message
          : 'The current objective screen could not load the live route payload.',
      );
      setCurrentObjective(null);
    } finally {
      setIsLoading(false);
    }
  }

  async function handleCaptureImage() {
    setCaptureError(null);
    setIsCapturing(true);

    try {
      const image = await captureObjectiveImage();

      if (image) {
        setSelectedImage(image);
      }
    } catch (error) {
      setCaptureError(
        error instanceof Error
          ? error.message
          : 'The app could not open the camera for this objective.',
      );
    } finally {
      setIsCapturing(false);
    }
  }

  async function handleSelectImageFromLibrary() {
    setCaptureError(null);
    setIsSelectingFromLibrary(true);

    try {
      const image = await selectObjectiveImage();

      if (image) {
        setSelectedImage(image);
      }
    } catch (error) {
      setCaptureError(
        error instanceof Error
          ? error.message
          : 'The app could not open the media library for this objective.',
      );
    } finally {
      setIsSelectingFromLibrary(false);
    }
  }

  function clearSelectedImage() {
    setCaptureError(null);
    setMockValidationError(null);
    setSelectedImage(null);
  }

  async function runMockValidationFlow() {
    if (!currentObjective || !selectedImage) {
      return;
    }

    setMockValidationError(null);
    setIsMockValidating(true);

    try {
      const rewardSnapshot = await getObjectiveUnlockSnapshot(
        routeSlug,
        currentObjective.objective.slug,
      );

      if (!rewardSnapshot || rewardSnapshot.unlockableContents.length === 0) {
        setMockValidationError(
          'The mocked success flow resolved the objective, but no published reward is available yet.',
        );

        return;
      }

      onOpenUnlockedStory(routeSlug, currentObjective.objective.slug);
    } catch (error) {
      setMockValidationError(
        error instanceof Error
          ? error.message
          : 'The mocked validation step could not confirm reward delivery from the live backend.',
      );
    } finally {
      setIsMockValidating(false);
    }
  }

  useEffect(() => {
    setCaptureError(null);
    setMockValidationError(null);
    setSelectedImage(null);
    void loadCurrentObjective();
  }, [objectiveSlug, routeSlug]);

  if (isLoading) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Current Objective</Text>
          <ActivityIndicator color="#1d4f91" size="small" />
          <Text style={styles.title}>Loading objective</Text>
          <Text style={styles.description}>
            The app is resolving the selected objective from the live route payload.
          </Text>
        </View>
      </ScreenContainer>
    );
  }

  if (errorMessage) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Current Objective</Text>
          <Text style={styles.title}>Objective unavailable</Text>
          <Text style={styles.description}>{errorMessage}</Text>
          <PrimaryButton label="Retry" onPress={() => void loadCurrentObjective()} />
          <PrimaryButton label="Back to Route Detail" onPress={onBack} />
        </View>
      </ScreenContainer>
    );
  }

  if (!currentObjective) {
    return (
      <ScreenContainer>
        <StatusBar style="dark" />
        <View style={styles.wrapper}>
          <Text style={styles.eyebrow}>Current Objective</Text>
          <Text style={styles.title}>Objective not available</Text>
          <Text style={styles.description}>
            This screen is reserved for the gameplay slice, but the requested objective does not
            exist in the current MVP catalog.
          </Text>
          <PrimaryButton label="Back to Route Detail" onPress={onBack} />
        </View>
      </ScreenContainer>
    );
  }

  return (
    <ScreenContainer>
      <StatusBar style="dark" />
      <ScrollView contentContainerStyle={styles.wrapper}>
        <Text style={styles.eyebrow}>Current Objective</Text>
        <Text style={styles.title}>{currentObjective.objective.title}</Text>
        <Text style={styles.description}>
          {currentObjective.objective.description ||
            'This objective is now sourced from the live route payload and acts as the gameplay-prep landing point for the MVP.'}
        </Text>

        <View style={styles.heroCard}>
          <Text style={styles.heroLabel}>Focus location</Text>
          <Text style={styles.objectiveTitle}>{currentObjective.poiName}</Text>
          <Text style={styles.objectiveValue}>{currentObjective.routeTitle}</Text>
          <Text style={styles.objectiveBody}>Destination: {currentObjective.destinationName}</Text>
          <Text style={styles.objectiveBody}>
            Difficulty: {currentObjective.objective.difficulty}
          </Text>
          <Text style={styles.objectiveBody}>
            Mode: {currentObjective.objective.indoorMode ? 'indoor' : 'outdoor'}
          </Text>
          <Text style={styles.objectiveBody}>
            Target type: {currentObjective.objective.targetType}
          </Text>
          <Text style={styles.objectiveBody}>
            GPS radius:{' '}
            {currentObjective.objective.gpsRadiusMeters
              ? `${currentObjective.objective.gpsRadiusMeters} meters`
              : 'not defined yet'}
          </Text>
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Objective image</Text>
          <Text style={styles.supportBody}>
            This is the first real native input for the gameplay loop. Capture a photo or choose
            one from the device so the future validation pipeline has an image-ready step to build
            on.
          </Text>

          {captureError ? <Text style={styles.errorText}>{captureError}</Text> : null}

          {selectedImage ? (
            <View style={styles.previewCard}>
              <Image source={{ uri: selectedImage.uri }} style={styles.previewImage} />
              <Text style={styles.previewTitle}>Image ready for validation</Text>
              <Text style={styles.metaText}>
                {selectedImage.fileName
                  ? `File: ${selectedImage.fileName}`
                  : 'No filename metadata is available for this image.'}
              </Text>
              <Text style={styles.metaText}>
                {selectedImage.width && selectedImage.height
                  ? `Dimensions: ${selectedImage.width} x ${selectedImage.height}`
                  : 'Image dimensions were not provided by the device.'}
              </Text>
              <Text style={styles.metaText}>
                {selectedImage.mimeType
                  ? `Type: ${selectedImage.mimeType}`
                  : 'The device did not report a mime type for this image.'}
              </Text>
              <PrimaryButton
                disabled={isCapturing}
                label={isCapturing ? 'Retaking Photo...' : 'Retake Photo'}
                onPress={() => void handleCaptureImage()}
              />
              <PrimaryButton
                disabled={isSelectingFromLibrary}
                label={isSelectingFromLibrary ? 'Replacing from Library...' : 'Choose Different Image'}
                onPress={() => void handleSelectImageFromLibrary()}
              />
              <PrimaryButton label="Remove Image" onPress={clearSelectedImage} />
            </View>
          ) : (
            <View style={styles.actionStack}>
              <PrimaryButton
                disabled={isCapturing}
                label={isCapturing ? 'Opening Camera...' : 'Open Camera'}
                onPress={() => void handleCaptureImage()}
              />
              <PrimaryButton
                disabled={isSelectingFromLibrary}
                label={isSelectingFromLibrary ? 'Opening Library...' : 'Choose from Library'}
                onPress={() => void handleSelectImageFromLibrary()}
              />
            </View>
          )}
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Mock validation flow</Text>
          <Text style={styles.supportBody}>
            This temporary action now assumes an image is ready. It still does not judge the photo,
            but it makes the future GPS and visual validation seam much more concrete.
          </Text>
          {mockValidationError ? (
            <Text style={styles.errorText}>{mockValidationError}</Text>
          ) : (
            <Text style={styles.metaText}>
              {selectedImage
                ? 'The selected image stays local to the device for now. No completion is persisted yet.'
                : 'Capture or choose an image first to unlock the temporary mocked-success transition.'}
            </Text>
          )}
          <PrimaryButton
            disabled={isMockValidating || !selectedImage}
            label={isMockValidating ? 'Validating Mock Success...' : 'Validate Objective (Mock)'}
            onPress={() => void runMockValidationFlow()}
          />
        </View>

        <View style={styles.supportCard}>
          <Text style={styles.supportTitle}>Progressive hints</Text>
          <Text style={styles.supportBody}>
            Hints are already seeded in D1 and exposed by the Worker API. The reveal interaction for
            this screen is still the next missing slice.
          </Text>
          <PrimaryButton disabled label="Hints Coming Soon" onPress={() => undefined} />
        </View>

        <PrimaryButton label="Back to Route Detail" onPress={onBack} />
      </ScrollView>
    </ScreenContainer>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingVertical: 32,
    gap: 18,
    backgroundColor: '#f8f4ec',
  },
  eyebrow: {
    color: '#1d4f91',
    fontSize: 14,
    fontWeight: '700',
    letterSpacing: 1.2,
    textTransform: 'uppercase',
  },
  title: {
    color: '#1c1d21',
    fontSize: 32,
    fontWeight: '800',
  },
  description: {
    color: '#4f5663',
    fontSize: 16,
    lineHeight: 24,
  },
  heroCard: {
    gap: 10,
    padding: 22,
    borderRadius: 24,
    backgroundColor: '#fff9f1',
    borderWidth: 1,
    borderColor: '#e6d5bf',
  },
  heroLabel: {
    color: '#a45a2a',
    fontSize: 13,
    fontWeight: '700',
    letterSpacing: 0.8,
    textTransform: 'uppercase',
  },
  objectiveTitle: {
    color: '#1c1d21',
    fontSize: 18,
    fontWeight: '800',
  },
  objectiveValue: {
    color: '#a45a2a',
    fontSize: 15,
    fontWeight: '700',
  },
  objectiveBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 22,
  },
  supportCard: {
    gap: 14,
    padding: 22,
    borderRadius: 24,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#e6d5bf',
  },
  supportTitle: {
    color: '#1c1d21',
    fontSize: 18,
    fontWeight: '800',
  },
  supportBody: {
    color: '#4f5663',
    fontSize: 15,
    lineHeight: 22,
  },
  actionStack: {
    gap: 12,
  },
  previewCard: {
    gap: 12,
  },
  previewImage: {
    width: '100%',
    aspectRatio: 4 / 3,
    borderRadius: 20,
    backgroundColor: '#e8edf4',
  },
  previewTitle: {
    color: '#1c1d21',
    fontSize: 16,
    fontWeight: '800',
  },
  metaText: {
    color: '#4f5663',
    fontSize: 14,
    lineHeight: 21,
  },
  errorText: {
    color: '#9c2f28',
    fontSize: 14,
    lineHeight: 21,
  },
});
