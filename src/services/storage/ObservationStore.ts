import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Observation, ObservationStore } from '../../types/observation';
import { generateId } from '../../utils/helpers';

/**
 * Zustand store for managing observations with persistence
 * Uses AsyncStorage to save data offline
 */
export const useObservationStore = create<ObservationStore>()(
  persist(
    (set, get) => ({
      // State
      observations: [],
      isLoading: false,
      error: null,

      // Actions
      addObservation: async (observation: Observation) => {
        set({ isLoading: true, error: null });
        try {
          const newObservation = {
            ...observation,
            id: observation.id || generateId(),
            timestamp: observation.timestamp || new Date().toISOString(),
            synced: false,
          };
          
          set((state) => ({
            observations: [newObservation, ...state.observations],
            isLoading: false,
          }));
          
          // Attempt to sync if online (optional)
          const { syncObservations } = get();
          await syncObservations();
          
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to add observation',
            isLoading: false,
          });
        }
      },

      deleteObservation: async (id: string) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            observations: state.observations.filter((obs) => obs.id !== id),
            isLoading: false,
          }));
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to delete observation',
            isLoading: false,
          });
        }
      },

      updateObservation: async (id: string, updates: Partial<Observation>) => {
        set({ isLoading: true, error: null });
        try {
          set((state) => ({
            observations: state.observations.map((obs) =>
              obs.id === id ? { ...obs, ...updates, synced: false } : obs
            ),
            isLoading: false,
          }));
          
          // Attempt to sync
          const { syncObservations } = get();
          await syncObservations();
          
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to update observation',
            isLoading: false,
          });
        }
      },

      loadObservations: async () => {
        set({ isLoading: true, error: null });
        try {
          // Loading is handled by persist middleware automatically
          // This is here for manual refresh if needed
          set({ isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to load observations',
            isLoading: false,
          });
        }
      },

      clearAllObservations: async () => {
        set({ isLoading: true, error: null });
        try {
          set({ observations: [], isLoading: false });
        } catch (error) {
          set({
            error: error instanceof Error ? error.message : 'Failed to clear observations',
            isLoading: false,
          });
        }
      },

      syncObservations: async () => {
        // Placeholder for cloud sync
        // In the future, this can sync to a backend API
        const { observations } = get();
        const unsynced = observations.filter((obs) => !obs.synced);
        
        if (unsynced.length === 0) return;
        
        try {
          // TODO: Implement API call to sync to backend
          // For now, just mark as synced locally
          set((state) => ({
            observations: state.observations.map((obs) =>
              !obs.synced ? { ...obs, synced: true } : obs
            ),
          }));
        } catch (error) {
          console.error('Sync failed:', error);
        }
      },
    }),
    {
      name: 'biodiversity-observations', // Unique storage key
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({
        observations: state.observations,
        // Don't persist isLoading or error
      }),
    }
  )
);