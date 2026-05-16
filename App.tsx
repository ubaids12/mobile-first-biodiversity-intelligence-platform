import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { View, Text, ActivityIndicator } from 'react-native';

// Import Screens
import CameraScreen from './src/screens/CameraScreen';
import ResultsScreen from './src/screens/ResultsScreen';
import HistoryScreen from './src/screens/HistoryScreen';

// Import Store
import { useObservationStore } from './src/services/storage/ObservationStore';

// Import Model Service
import ModelLoaderService from './src/services/ml/ModelLoader';

// Import Types
import { RootStackParamList } from './src/types/navigation';

// Create Stack Navigator
const Stack = createNativeStackNavigator<RootStackParamList>();

// Loading Screen Component
function LoadingScreen() {
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setProgress(ModelLoaderService.getLoadingProgress());
    }, 100);
    return () => clearInterval(interval);
  }, []);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: '#f5f5f5' }}>
      <Text style={{ fontSize: 48, marginBottom: 20 }}>🌿</Text>
      <Text style={{ fontSize: 24, fontWeight: 'bold', color: '#2e7d32', marginBottom: 10 }}>
        Darukaa Biodiversity
      </Text>
      <Text style={{ fontSize: 16, color: '#666', marginBottom: 30 }}>
        Mobile-First Intelligence Platform
      </Text>
      
      <View style={{ width: '80%', height: 4, backgroundColor: '#e0e0e0', borderRadius: 2, overflow: 'hidden' }}>
        <View style={{ width: `${progress}%`, height: '100%', backgroundColor: '#2e7d32' }} />
      </View>
      
      <Text style={{ marginTop: 10, color: '#666' }}>Loading AI Model... {progress}%</Text>
      <Text style={{ marginTop: 5, color: '#999', fontSize: 12 }}>Initializing plant identification engine</Text>
    </View>
  );
}

// Main App Component
export default function App() {
  const [isReady, setIsReady] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { loadObservations } = useObservationStore();

  useEffect(() => {
    const initializeApp = async () => {
      try {
        await loadObservations();
        console.log('✅ Observations loaded');

        // Load model
        const loaded = await ModelLoaderService.loadModel();
        console.log('✅ Model loaded:', loaded);

        setIsReady(true);
      } catch (err) {
        console.error('❌ Initialization error:', err);
        setError(err instanceof Error ? err.message : 'Failed to initialize app');
      }
    };

    initializeApp();
  }, []);

  if (error) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20, backgroundColor: '#f5f5f5' }}>
        <Text style={{ fontSize: 48, marginBottom: 20 }}>⚠️</Text>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: '#f44336', marginBottom: 10, textAlign: 'center' }}>
          Initialization Failed
        </Text>
        <Text style={{ fontSize: 14, color: '#666', textAlign: 'center', marginBottom: 20 }}>
          {error}
        </Text>
        <Text style={{ fontSize: 12, color: '#999', textAlign: 'center' }}>
          Please restart the app.
        </Text>
      </View>
    );
  }

  if (!isReady) {
    return <LoadingScreen />;
  }

  return (
    <>
      <StatusBar style="light" />
      <NavigationContainer>
        <Stack.Navigator
          initialRouteName="Camera"
          screenOptions={{
            headerStyle: {
              backgroundColor: '#2e7d32',
            },
            headerTintColor: 'white',
            headerTitleStyle: {
              fontWeight: 'bold',
            },
            headerBackTitle: 'Back',
          }}
        >
          <Stack.Screen 
            name="Camera" 
            component={CameraScreen} 
            options={{ headerShown: false }}
          />
          <Stack.Screen 
            name="Results" 
            component={ResultsScreen} 
            options={{ title: 'Identification Results' }}
          />
          <Stack.Screen 
            name="History" 
            component={HistoryScreen} 
            options={{ title: 'Observation History' }}
          />
        </Stack.Navigator>
      </NavigationContainer>
    </>
  );
}