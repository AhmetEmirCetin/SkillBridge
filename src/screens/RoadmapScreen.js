import React from 'react';
import {
  View, Text, ScrollView,
  TouchableOpacity, StyleSheet
} from 'react-native';

export default function RoadmapScreen({ navigation, route }) {
  const { roadmap } = route.params;

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Geri Dön</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Yol Haritanız 🗺️</Text>

      <View style={styles.card}>
        <Text style={styles.roadmapText}>{roadmap}</Text>
      </View>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('Onboarding')}
      >
        <Text style={styles.buttonText}>Yeni Plan Oluştur</Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f0f0f',
    padding: 24,
    paddingTop: 60,
  },
  backButton: {
    marginBottom: 20,
  },
  backText: {
    color: '#6c47ff',
    fontSize: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 24,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  roadmapText: {
    color: '#ddd',
    fontSize: 15,
    lineHeight: 26,
  },
  button: {
    backgroundColor: '#6c47ff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 32,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});