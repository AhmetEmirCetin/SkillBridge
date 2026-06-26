import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ScrollView, ActivityIndicator, Alert
} from 'react-native';
import { generateRoadmap } from '../services/claudeApi';
import { supabase } from '../supabaseClient';

export default function OnboardingScreen({ navigation }) {
  const [goal, setGoal] = useState('');
  const [level, setLevel] = useState('');
  const [hoursPerDay, setHoursPerDay] = useState('');
  const [location, setLocation] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    if (!goal || !level || !hoursPerDay) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }

    setLoading(true);
    try {
      const content = await generateRoadmap({ goal, level, hoursPerDay, location });

      const { data: { user } } = await supabase.auth.getUser();

      await supabase.from('roadmaps').insert({
        user_id: user.id,
        goal,
        level,
        hours_per_day: hoursPerDay,
        location,
        content,
      });

      navigation.navigate('Roadmap', { roadmap: content });
    } catch (error) {
      Alert.alert('Hata', error.message || 'Bir şeyler ters gitti.');
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    await supabase.auth.signOut();
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>SkillBridge AI</Text>
        <View style={styles.headerButtons}>
          <TouchableOpacity onPress={() => navigation.navigate('History')} style={styles.historyButton}>
            <Text style={styles.historyText}>Geçmiş</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={handleLogout}>
            <Text style={styles.logoutText}>Çıkış</Text>
          </TouchableOpacity>
        </View>
      </View>

      <Text style={styles.subtitle}>Sana özel öğrenme yol haritanı oluşturalım 🚀</Text>

      <Text style={styles.label}>Ne öğrenmek istiyorsun?</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: Embedded Systems, Web Geliştirme, Fotoğrafçılık"
        placeholderTextColor="#888"
        value={goal}
        onChangeText={setGoal}
      />

      <Text style={styles.label}>Mevcut seviyeni tarif et</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: Hiç bilmiyorum, Temel Python bilgim var"
        placeholderTextColor="#888"
        value={level}
        onChangeText={setLevel}
      />

      <Text style={styles.label}>Günlük kaç saatin var?</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: 2"
        placeholderTextColor="#888"
        value={hoursPerDay}
        onChangeText={setHoursPerDay}
        keyboardType="numeric"
      />

      <Text style={styles.label}>Şehrin (opsiyonel)</Text>
      <TextInput
        style={styles.input}
        placeholder="Örn: Ankara"
        placeholderTextColor="#888"
        value={location}
        onChangeText={setLocation}
      />

      <TouchableOpacity style={styles.button} onPress={handleSubmit} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Yol Haritamı Oluştur ✨</Text>
        }
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
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  headerButtons: {
    flexDirection: 'row',
    gap: 16,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#fff',
  },
  historyButton: {},
  historyText: {
    color: '#6c47ff',
    fontSize: 15,
    fontWeight: 'bold',
  },
  logoutText: {
    color: '#ff4444',
    fontSize: 15,
    fontWeight: 'bold',
  },
  subtitle: {
    fontSize: 15,
    color: '#aaa',
    marginBottom: 40,
  },
  label: {
    fontSize: 14,
    color: '#ccc',
    marginBottom: 8,
    marginTop: 16,
  },
  input: {
    backgroundColor: '#1e1e1e',
    color: '#fff',
    borderRadius: 12,
    padding: 14,
    fontSize: 15,
    borderWidth: 1,
    borderColor: '#333',
  },
  button: {
    backgroundColor: '#6c47ff',
    borderRadius: 14,
    padding: 18,
    alignItems: 'center',
    marginTop: 40,
    marginBottom: 40,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});