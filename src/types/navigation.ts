// src/types/navigation.ts
import { Prediction } from './observation';

export type RootStackParamList = {
  Camera: undefined;
  Results: {
    imageUri: string;
    predictions: Prediction[];
    processingTime: number;
    modelUsed: string;
  };
  History: undefined;
};