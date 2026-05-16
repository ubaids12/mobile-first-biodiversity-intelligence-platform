// @ts-nocheck
import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Image,
  ScrollView,
  TouchableOpacity,
  Alert,
  Share,
  ActivityIndicator,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import PredictionCard from '../components/PredictionCard';
import { useObservationStore } from '../services/storage/ObservationStore';
import { formatConfidence, generateId } from '../utils/helpers';

export default function ResultsScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const { imageUri, predictions, processingTime, modelUsed } = route.params;
  const { addObservation } = useObservationStore();
  const [isSaving, setIsSaving] = useState(false);
  const [isSharing, setIsSharing] = useState(false);

  const topPrediction = predictions[0];
  const alternativePredictions = predictions.slice(1);

  const handleSaveObservation = async () => {
    setIsSaving(true);
    try {
      await addObservation({
        id: generateId(),
        timestamp: new Date().toISOString(),
        imageUri: imageUri,
        topPrediction: topPrediction,
        allPredictions: predictions,
        synced: false,
      });
      Alert.alert('✅ Saved', 'Observation saved to history', [{ text: 'OK' }]);
    } catch (error) {
      Alert.alert('Error', 'Failed to save');
    } finally {
      setIsSaving(false);
    }
  };

  const handleShareResults = async () => {
    setIsSharing(true);
    try {
      const message = `🌿 Plant Identification Results 🌿\n\nTop Match: ${topPrediction.species}\nConfidence: ${formatConfidence(topPrediction.confidence)}\n\nOther possibilities:\n${alternativePredictions.map(p => `• ${p.species} (${formatConfidence(p.confidence)})`).join('\n')}\n\n📱 ${modelUsed}\n⏱️ ${processingTime}ms`;
      await Share.share({ title: 'Plant Identification Results', message: message });
    } catch (error) {
      Alert.alert('Error', 'Failed to share');
    } finally {
      setIsSharing(false);
    }
  };

  return (
    <ScrollView style={styles.container}>
      <Image source={{ uri: imageUri }} style={styles.image} />
      <View style={styles.card}>
        <Text style={styles.title}>🌿 Top Match</Text>
        <Text style={styles.species}>{topPrediction.species}</Text>
        <Text style={styles.confidence}>{formatConfidence(topPrediction.confidence)} confidence</Text>
        
        <Text style={styles.subtitle}>Other possibilities</Text>
        {alternativePredictions.map((p, i) => (
          <View key={i} style={styles.alternative}>
            <Text>{p.species}</Text>
            <Text style={styles.alternativeConfidence}>{formatConfidence(p.confidence)}</Text>
          </View>
        ))}
        
        <TouchableOpacity style={styles.saveButton} onPress={handleSaveObservation} disabled={isSaving}>
          <Text style={styles.buttonText}>{isSaving ? 'Saving...' : '💾 Save Observation'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.shareButton} onPress={handleShareResults} disabled={isSharing}>
          <Text style={[styles.buttonText, { color: '#2e7d32' }]}>{isSharing ? 'Sharing...' : '📤 Share Results'}</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.newButton} onPress={() => navigation.navigate('Camera')}>
          <Text style={styles.buttonText}>📷 Take Another Photo</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.historyButton} onPress={() => navigation.navigate('History')}>
          <Text style={styles.buttonText}>📋 View History</Text>
        </TouchableOpacity>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  image: { width: '100%', height: 300 },
  card: { backgroundColor: 'white', margin: 16, padding: 20, borderRadius: 12 },
  title: { fontSize: 18, fontWeight: '600', color: '#666', marginBottom: 8 },
  species: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32', marginBottom: 8 },
  confidence: { fontSize: 16, color: '#4caf50', marginBottom: 20 },
  subtitle: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 12 },
  alternative: { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 8, borderBottomWidth: 1, borderBottomColor: '#eee' },
  alternativeConfidence: { color: '#4caf50', fontWeight: '500' },
  saveButton: { backgroundColor: '#2e7d32', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 20 },
  shareButton: { backgroundColor: 'white', borderWidth: 2, borderColor: '#2e7d32', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  newButton: { backgroundColor: '#2196f3', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  historyButton: { backgroundColor: '#ff9800', padding: 14, borderRadius: 8, alignItems: 'center', marginTop: 12 },
  buttonText: { color: 'white', fontSize: 16, fontWeight: '600' },
});