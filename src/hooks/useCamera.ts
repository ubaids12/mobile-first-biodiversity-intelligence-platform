import { useState, useRef } from 'react';
import { Camera } from 'expo-camera';
import * as ImageManipulator from 'expo-image-manipulator';

export const useCamera = () => {
  const [hasPermission, setHasPermission] = useState<boolean | null>(null);
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  // Use 'any' type to avoid TypeScript complexity with Camera
  const cameraRef = useRef<any>(null);

  const requestPermission = async () => {
    try {
      const { status } = await Camera.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
      if (status === 'granted') {
        setIsReady(true);
      } else {
        setError('Camera permission denied');
      }
    } catch (err) {
      setError('Failed to request camera permission');
    }
  };

  const takePicture = async (): Promise<string | null> => {
    if (!cameraRef.current) {
      setError('Camera not ready');
      return null;
    }

    try {
      const photo = await cameraRef.current.takePictureAsync({
        quality: 0.8,
        base64: false,
        skipProcessing: false,
      });

      if (!photo || !photo.uri) {
        throw new Error('No photo captured');
      }

      // Resize image to 224x224 for ML model
      const processedImage = await ImageManipulator.manipulateAsync(
        photo.uri,
        [{ resize: { width: 224, height: 224 } }],
        { compress: 0.8, format: ImageManipulator.SaveFormat.JPEG }
      );

      return processedImage.uri;
    } catch (err) {
      setError('Failed to take picture');
      return null;
    }
  };

  return {
    hasPermission,
    cameraRef,
    takePicture,
    requestPermission,
    isReady,
    error,
  };
};