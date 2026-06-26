import React, { useState, useEffect } from 'react';
import {
  View, Text, ScrollView, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert
} from 'react-native';
import { supabase } from '../supabaseClient';

export default function HistoryScreen({ navigation }) {
  const [roadmaps, setRoadmaps] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchRoadmaps();
  }, []);

  const fetchRoadmaps = async () => {
    const { data, error } = await supabase
      .from('roadmaps')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      Alert.alert('Hata', error.message);
    } else {
      setRoadmaps(data);
    }
    setLoading(false);
  };

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('roadmaps')
      .delete()
      .eq('id', id);

    if (error) {
      Alert.alert('Hata', error.message);
    } else {
      setRoadmaps(roadmaps.filter(r => r.id !== id));
    }
  };

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#6c47ff" />
      </View>
    );
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
        <Text style={styles.backText}>← Geri Dön</Text>
      </TouchableOpacity>

      <Text style={styles.title}>Geçmiş Yol Haritaları 📚</Text>

      {roadmaps.length === 0 ? (
        <View style={styles.empty}>
          <Text style={styles.emptyText}>Henüz yol haritası oluşturmadın.</Text>
        </View>
      ) : (
        roadmaps.map((item) => (
          <View key={item.id} style={styles.card}>
            <View style={styles.cardHeader}>
              <Text style={styles.cardGoal}>{item.goal}</Text>
              <TouchableOpacity onPress={() => handleDelete(item.id)}>
                <Text style={styles.deleteText}>Sil</Text>
              </TouchableOpacity>
            </View>
            <Text style={styles.cardMeta}>
              {item.hours_per_day} saat/gün • {item.level}
            </Text>
            <Text style={styles.cardDate}>
              {new Date(item.created_at).toLocaleDateString('tr-TR')}
            </Text>
            <TouchableOpacity
              style={styles.viewButton}
              onPress={() => navigation.navigate('Roadmap', { roadmap: item.content })}
            >
              <Text style={styles.viewButtonText}>Görüntüle →</Text>
            </TouchableOpacity>
          </View>
        ))
      )}
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
  centered: {
    flex: 1,
    backgroundColor: '#0f0f0f',
    justifyContent: 'center',
    alignItems: 'center',
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
  empty: {
    alignItems: 'center',
    marginTop: 60,
  },
  emptyText: {
    color: '#888',
    fontSize: 16,
  },
  card: {
    backgroundColor: '#1e1e1e',
    borderRadius: 16,
    padding: 18,
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  cardHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardGoal: {
    color: '#fff',
    fontSize: 17,
    fontWeight: 'bold',
    flex: 1,
  },
  deleteText: {
    color: '#ff4444',
    fontSize: 14,
  },
  cardMeta: {
    color: '#aaa',
    fontSize: 13,
    marginBottom: 4,
  },
  cardDate: {
    color: '#666',
    fontSize: 12,
    marginBottom: 12,
  },
  viewButton: {
    backgroundColor: '#6c47ff22',
    borderRadius: 8,
    padding: 10,
    alignItems: 'center',
  },
  viewButtonText: {
    color: '#6c47ff',
    fontWeight: 'bold',
  },
});