// Type definitions for the biodiversity platform

/**
 * Represents a single prediction from the ML model
 */
export interface Prediction {
  /** Plant species name */
  species: string;
  /** Confidence score between 0 and 1 */
  confidence: number;
  /** Unique class ID (0-24 for 25 classes) */
  classId?: number;
}

/**
 * Represents a complete observation saved by the user
 */
export interface Observation {
  /** Unique identifier (timestamp based) */
  id: string;
  /** When the observation was created */
  timestamp: string;
  /** Local URI of the captured image */
  imageUri: string;
  /** Top prediction (highest confidence) */
  topPrediction: Prediction;
  /** All predictions returned by the model (top K) */
  allPredictions: Prediction[];
  /** GPS coordinates (optional, for field work) */
  location?: {
    latitude: number;
    longitude: number;
    altitude?: number;
  };
  /** Any notes added by the user */
  notes?: string;
  /** Whether the observation was synced to cloud */
  synced?: boolean;
}

/**
 * State for the observation store (Zustand)
 */
export interface ObservationStoreState {
  observations: Observation[];
  isLoading: boolean;
  error: string | null;
}

/**
 * Actions for the observation store
 */
export interface ObservationStoreActions {
  addObservation: (observation: Observation) => Promise<void>;
  deleteObservation: (id: string) => Promise<void>;
  updateObservation: (id: string, updates: Partial<Observation>) => Promise<void>;
  loadObservations: () => Promise<void>;
  clearAllObservations: () => Promise<void>;
  syncObservations: () => Promise<void>;
}

/**
 * Combined store interface
 */
export interface ObservationStore extends ObservationStoreState, ObservationStoreActions {}

/**
 * Camera related types
 */
export interface CameraState {
  hasPermission: boolean | null;
  isReady: boolean;
  type: 'front' | 'back';
}

/**
 * Inference result from ML model
 */
export interface InferenceResult {
  predictions: Prediction[];
  processingTimeMs: number;
  modelUsed: string;
}

/**
 * App configuration
 */
export interface AppConfig {
  modelName: string;
  inputSize: number;
  topK: number;
  confidenceThreshold: number;
}