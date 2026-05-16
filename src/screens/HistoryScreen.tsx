// @ts-nocheck
import React, { useState, useCallback } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  Image,
  TouchableOpacity,
  Alert,
  RefreshControl,
  Modal,
  ScrollView,
} from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { useObservationStore } from '../services/storage/ObservationStore';
import { formatDate, formatConfidence } from '../utils/helpers';

export default function HistoryScreen() {
  const navigation = useNavigation();
  const { observations, loadObservations, deleteObservation, clearAllObservations } = useObservationStore();
  const [refreshing, setRefreshing] = useState(false);
  const [selectedObservation, setSelectedObservation] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useFocusEffect(
    useCallback(() => {
      loadObservations();
    }, [])
  );

  const onRefresh = async () => {
    setRefreshing(true);
    await loadObservations();
    setRefreshing(false);
  };

  const handleDelete = (id, species) => {
    Alert.alert('Delete', `Delete ${species}?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete', style: 'destructive', onPress: () => deleteObservation(id) },
    ]);
  };

  const handleClearAll = () => {
    if (observations.length === 0) return;
    Alert.alert('Clear All', `Delete all ${observations.length} observations?`, [
      { text: 'Cancel', style: 'cancel' },
      { text: 'Delete All', style: 'destructive', onPress: () => clearAllObservations() },
    ]);
  };

  const renderItem = ({ item }) => (
    <TouchableOpacity style={styles.card} onPress={() => {
      setSelectedObservation(item);
      setModalVisible(true);
    }}>
      <Image source={{ uri: item.imageUri }} style={styles.thumbnail} />
      <View style={styles.content}>
        <Text style={styles.species}>{item.topPrediction.species}</Text>
        <Text style={styles.confidence}>{formatConfidence(item.topPrediction.confidence)}</Text>
        <Text style={styles.date}>{formatDate(item.timestamp)}</Text>
      </View>
      <TouchableOpacity onPress={() => handleDelete(item.id, item.topPrediction.species)}>
        <Text style={styles.delete}>🗑️</Text>
      </TouchableOpacity>
    </TouchableOpacity>
  );

  if (observations.length === 0) {
    return (
      <View style={styles.emptyContainer}>
        <Text style={styles.emptyIcon}>🌿</Text>
        <Text style={styles.emptyTitle}>No Observations</Text>
        <Text style={styles.emptyText}>Take a photo of a plant to get started</Text>
        <TouchableOpacity style={styles.emptyButton} onPress={() => navigation.navigate('Camera')}>
          <Text style={styles.emptyButtonText}>Take First Photo</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>📋 Observation History</Text>
        {observations.length > 0 && (
          <TouchableOpacity onPress={handleClearAll} style={styles.clearButton}>
            <Text style={styles.clearButtonText}>Clear All</Text>
          </TouchableOpacity>
        )}
      </View>
      <FlatList
        data={observations}
        renderItem={renderItem}
        keyExtractor={(item) => item.id}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} colors={['#2e7d32']} />}
      />
      
      <Modal visible={modalVisible} animationType="slide" transparent={false}>
        {selectedObservation && (
          <ScrollView style={styles.modalContainer}>
            <View style={styles.modalHeader}>
              <TouchableOpacity onPress={() => setModalVisible(false)}>
                <Text style={styles.closeButton}>← Back</Text>
              </TouchableOpacity>
              <Text style={styles.modalTitle}>Details</Text>
              <View style={{ width: 60 }} />
            </View>
            <Image source={{ uri: selectedObservation.imageUri }} style={styles.modalImage} />
            <View style={styles.modalContent}>
              <Text style={styles.modalSpecies}>{selectedObservation.topPrediction.species}</Text>
              <Text style={styles.modalConfidence}>{formatConfidence(selectedObservation.topPrediction.confidence)}</Text>
              <Text style={styles.modalDate}>{new Date(selectedObservation.timestamp).toLocaleString()}</Text>
              <TouchableOpacity style={styles.modalDelete} onPress={() => {
                setModalVisible(false);
                handleDelete(selectedObservation.id, selectedObservation.topPrediction.species);
              }}>
                <Text style={styles.modalDeleteText}>🗑️ Delete</Text>
              </TouchableOpacity>
            </View>
          </ScrollView>
        )}
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, backgroundColor: '#f5f5f5' },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 16, paddingBottom: 12, backgroundColor: 'white', borderBottomWidth: 1, borderBottomColor: '#e0e0e0' },
  headerTitle: { fontSize: 20, fontWeight: 'bold', color: '#2e7d32' },
  clearButton: { paddingHorizontal: 12, paddingVertical: 6, borderRadius: 8, backgroundColor: '#ffebee' },
  clearButtonText: { color: '#f44336', fontSize: 14, fontWeight: '500' },
  card: { flexDirection: 'row', backgroundColor: 'white', marginHorizontal: 16, marginTop: 12, padding: 12, borderRadius: 12, alignItems: 'center' },
  thumbnail: { width: 60, height: 60, borderRadius: 8, marginRight: 12 },
  content: { flex: 1 },
  species: { fontSize: 16, fontWeight: '600', color: '#333' },
  confidence: { fontSize: 14, color: '#4caf50', marginTop: 4 },
  date: { fontSize: 12, color: '#999', marginTop: 4 },
  delete: { fontSize: 20, padding: 8 },
  emptyContainer: { flex: 1, justifyContent: 'center', alignItems: 'center', padding: 40 },
  emptyIcon: { fontSize: 64, marginBottom: 20 },
  emptyTitle: { fontSize: 22, fontWeight: 'bold', color: '#333', marginBottom: 10 },
  emptyText: { fontSize: 16, color: '#666', textAlign: 'center', marginBottom: 30 },
  emptyButton: { backgroundColor: '#2e7d32', paddingHorizontal: 30, paddingVertical: 12, borderRadius: 25 },
  emptyButtonText: { color: 'white', fontSize: 16, fontWeight: '600' },
  modalContainer: { flex: 1, backgroundColor: 'white' },
  modalHeader: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingHorizontal: 16, paddingTop: 50, paddingBottom: 16, backgroundColor: '#2e7d32' },
  closeButton: { color: 'white', fontSize: 16, fontWeight: '600' },
  modalTitle: { fontSize: 18, fontWeight: 'bold', color: 'white' },
  modalImage: { width: '100%', height: 300, resizeMode: 'cover' },
  modalContent: { padding: 20, alignItems: 'center' },
  modalSpecies: { fontSize: 24, fontWeight: 'bold', color: '#2e7d32', textAlign: 'center' },
  modalConfidence: { fontSize: 18, color: '#4caf50', marginTop: 8 },
  modalDate: { fontSize: 14, color: '#666', marginTop: 8 },
  modalDelete: { backgroundColor: '#ffebee', padding: 16, borderRadius: 12, marginTop: 20, width: '100%', alignItems: 'center' },
  modalDeleteText: { color: '#f44336', fontSize: 16, fontWeight: '600' },
});