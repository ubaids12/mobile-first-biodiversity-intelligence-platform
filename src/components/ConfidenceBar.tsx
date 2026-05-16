// @ts-nocheck
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function ConfidenceBar({ confidence, label, showPercentage = true }) {
  const percentage = Math.round(confidence * 100);
  const getColor = () => {
    if (percentage >= 70) return '#4caf50';
    if (percentage >= 40) return '#ff9800';
    return '#f44336';
  };

  return (
    <View style={styles.container}>
      {label && (
        <View style={styles.labelRow}>
          <Text style={styles.label}>{label}</Text>
          {showPercentage && <Text style={[styles.percentage, { color: getColor() }]}>{percentage}%</Text>}
        </View>
      )}
      <View style={styles.barBg}>
        <View style={[styles.barFill, { width: `${percentage}%`, backgroundColor: getColor() }]} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { marginVertical: 4 },
  labelRow: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  label: { fontSize: 14, color: '#333' },
  percentage: { fontSize: 14, fontWeight: '600' },
  barBg: { height: 8, backgroundColor: '#e0e0e0', borderRadius: 4, overflow: 'hidden' },
  barFill: { height: 8, borderRadius: 4 },
});