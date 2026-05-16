// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import ConfidenceBar from './ConfidenceBar';

export default function PredictionCard({ prediction, isPrimary = false, rank = 1 }) {
  const rankIcon = rank === 1 ? '🥇' : rank === 2 ? '🥈' : rank === 3 ? '🥉' : `${rank}`;

  return (
    <View style={[styles.container, isPrimary && styles.primaryContainer]}>
      <View style={[styles.rankBadge, isPrimary && styles.primaryRankBadge]}>
        <Text style={[styles.rankText, isPrimary && styles.primaryRankText]}>{rankIcon}</Text>
      </View>
      <View style={styles.content}>
        <Text style={[styles.species, isPrimary && styles.primarySpecies]}>{prediction.species}</Text>
        <ConfidenceBar confidence={prediction.confidence} showPercentage={true} />
        {isPrimary && (
          <View style={styles.badge}>
            <Text style={styles.badgeText}>🌿 Top Match</Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: 'row', backgroundColor: 'white', borderRadius: 12, padding: 12, marginBottom: 10, marginHorizontal: 16 },
  primaryContainer: { backgroundColor: '#f1f8e9', borderLeftWidth: 4, borderLeftColor: '#2e7d32' },
  rankBadge: { width: 36, height: 36, borderRadius: 18, backgroundColor: '#f5f5f5', justifyContent: 'center', alignItems: 'center', marginRight: 12 },
  primaryRankBadge: { backgroundColor: '#2e7d32' },
  rankText: { fontSize: 18, fontWeight: 'bold', color: '#666' },
  primaryRankText: { color: 'white' },
  content: { flex: 1 },
  species: { fontSize: 16, fontWeight: '600', color: '#333', marginBottom: 8 },
  primarySpecies: { fontSize: 18, fontWeight: 'bold', color: '#2e7d32' },
  badge: { marginTop: 8, backgroundColor: '#e8f5e9', paddingHorizontal: 10, paddingVertical: 4, borderRadius: 12, alignSelf: 'flex-start' },
  badgeText: { fontSize: 12, color: '#2e7d32', fontWeight: '600' },
});