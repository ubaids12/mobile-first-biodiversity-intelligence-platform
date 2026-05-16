// @ts-nocheck
import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ActivityIndicator, Alert, Image } from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { useNavigation } from '@react-navigation/native';

export default function CameraScreen() {
  const navigation = useNavigation();
  const [processing, setProcessing] = useState(false);
  const [hasPermission, setHasPermission] = useState(null);

  React.useEffect(() => {
    (async () => {
      const { status } = await ImagePicker.requestCameraPermissionsAsync();
      setHasPermission(status === 'granted');
    })();
  }, []);

  const pickImage = async () => {
    if (hasPermission === false) {
      Alert.alert('Permission required', 'Please grant camera permission');
      return;
    }

    setProcessing(true);
    try {
      const result = await ImagePicker.launchCameraAsync({
        quality: 0.8,
        base64: false,
      });

      if (!result.canceled && result.assets && result.assets[0]) {
        const photo = result.assets[0];
        
        // Mock predictions
        const plants = ['Neem', 'Tulsi', 'Banyan', 'Mango', 'Rose', 'Coconut', 'Banana'];
        const randomPlant = plants[Math.floor(Math.random() * plants.length)];
        const mockPredictions = [
          { species: randomPlant, confidence: 0.85 },
          { species: plants[Math.floor(Math.random() * plants.length)], confidence: 0.10 },
          { species: plants[Math.floor(Math.random() * plants.length)], confidence: 0.05 },
        ];
        
        navigation.navigate('Results', {
          imageUri: photo.uri,
          predictions: mockPredictions,
          processingTime: 1500,
          modelUsed: 'Mock Plant Identifier',
        });
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to take photo');
    } finally {
      setProcessing(false);
    }
  };

  if (hasPermission === null) {
    return (
      <View style={styles.container}>
        <Text>Requesting permission...</Text>
      </View>
    );
  }

  if (hasPermission === false) {
    return (
      <View style={styles.container}>
        <Text>No camera access</Text>
        <TouchableOpacity onPress={async () => {
          const { status } = await ImagePicker.requestCameraPermissionsAsync();
          setHasPermission(status === 'granted');
        }}>
          <Text style={styles.buttonText}>Grant Permission</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>📸 Plant Identifier</Text>
        <Text style={styles.subtitle}>Take a photo of any plant to identify it</Text>
        
        <TouchableOpacity style={styles.captureButton} onPress={pickImage} disabled={processing}>
          {processing ? (
            <ActivityIndicator size="large" color="#2e7d32" />
          ) : (
            <Text style={styles.captureText}>Take Photo</Text>
          )}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  content: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 20 },
  title: { fontSize: 28, fontWeight: 'bold', color: '#2e7d32', marginBottom: 10 },
  subtitle: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 40 },
  captureButton: { backgroundColor: '#2e7d32', paddingHorizontal: 40, paddingVertical: 15, borderRadius: 30, elevation: 3 },
  captureText: { color: 'white', fontSize: 18, fontWeight: '600' },
  buttonText: { color: '#2e7d32', marginTop: 20, fontSize: 16 },
});