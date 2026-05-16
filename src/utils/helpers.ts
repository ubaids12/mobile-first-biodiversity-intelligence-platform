/**
 * Helper utilities for the biodiversity platform
 */

/**
 * Format a confidence score as percentage
 * @param confidence - Value between 0 and 1
 * @returns Formatted string like "85.3%"
 */
export const formatConfidence = (confidence: number): string => {
  return `${Math.round(confidence * 100)}%`;
};

/**
 * Get color based on confidence level
 * @param confidence - Value between 0 and 1
 * @returns Hex color code
 */
export const getConfidenceColor = (confidence: number): string => {
  if (confidence >= 0.7) return '#2e7d32'; // Green - High confidence
  if (confidence >= 0.4) return '#ff9800'; // Orange - Medium confidence
  return '#f44336'; // Red - Low confidence
};

/**
 * Generate a unique ID for observations
 */
export const generateId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substring(2, 11)}`;
};

/**
 * Format date for display in history
 */
export const formatDate = (timestamp: string): string => {
  const date = new Date(timestamp);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);

  if (date.toDateString() === today.toDateString()) {
    return `Today at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else if (date.toDateString() === yesterday.toDateString()) {
    return `Yesterday at ${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}`;
  } else {
    return date.toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' });
  }
};

/**
 * Resize image to model input dimensions
 * @param uri - Image URI
 * @param width - Target width (224 for MobileNetV2)
 * @param height - Target height (224 for MobileNetV2)
 * @returns Resized image URI
 */
export const resizeImage = async (uri: string, width: number = 224, height: number = 224): Promise<string> => {
  // This will be implemented with expo-image-manipulator
  // For now, return the original URI
  return uri;
};

/**
 * Convert image to tensor for ML inference
 * This is a placeholder - actual implementation will use TF.js
 */
export const imageToTensor = async (uri: string): Promise<Float32Array> => {
  // Placeholder: returns random tensor data
  // Real implementation will resize, normalize, and convert to tensor
  return new Float32Array(224 * 224 * 3);
};

/**
 * Debounce function for performance
 */
export function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: ReturnType<typeof setTimeout> | null = null;
  return (...args: Parameters<T>) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

/**
 * Check if app is running in development mode
 */
export const isDev = (): boolean => {
  return __DEV__;
};