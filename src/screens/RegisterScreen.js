import React, { useState } from 'react';
import {
  View, Text, TextInput, TouchableOpacity,
  StyleSheet, ActivityIndicator, Alert, ScrollView
} from 'react-native';
import { supabase } from '../supabaseClient';

export default function RegisterScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const handleRegister = async () => {
    if (!fullName || !email || !password) {
      Alert.alert('Hata', 'Lütfen tüm alanları doldurun.');
      return;
    }
    if (password.length < 6) {
      Alert.alert('Hata', 'Şifre en az 6 karakter olmalı.');
      return;
    }

    setLoading(true);
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { full_name: fullName } }
    });

    if (error) {
      Alert.alert('Hata', error.message);
    } else {
      await supabase.from('profiles').insert({
        id: data.user.id,
        email: email,
        full_name: fullName,
      });
      Alert.alert('Başarılı', 'Hesabın oluşturuldu! Giriş yapabilirsin.');
      navigation.navigate('Login');
    }
    setLoading(false);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Hesap Oluştur 🚀</Text>
      <Text style={styles.subtitle}>Yol haritanı oluşturmaya başla</Text>

      <Text style={styles.label}>Ad Soyad</Text>
      <TextInput
        style={styles.input}
        placeholder="Adın Soyadın"
        placeholderTextColor="#888"
        value={fullName}
        onChangeText={setFullName}
      />

      <Text style={styles.label}>E-posta</Text>
      <TextInput
        style={styles.input}
        placeholder="ornek@email.com"
        placeholderTextColor="#888"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />

      <Text style={styles.label}>Şifre</Text>
      <TextInput
        style={styles.input}
        placeholder="En az 6 karakter"
        placeholderTextColor="#888"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleRegister} disabled={loading}>
        {loading
          ? <ActivityIndicator color="#fff" />
          : <Text style={styles.buttonText}>Kayıt Ol</Text>
        }
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Login')}>
        <Text style={styles.linkText}>Zaten hesabın var mı? <Text style={styles.link}>Giriş Yap</Text></Text>
      </TouchableOpacity>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    backgroundColor: '#0f0f0f',
    padding: 24,
    paddingTop: 80,
  },
  title: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
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
    marginBottom: 20,
  },
  buttonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: 'bold',
  },
  linkText: {
    color: '#aaa',
    textAlign: 'center',
    fontSize: 14,
  },
  link: {
    color: '#6c47ff',
    fontWeight: 'bold',
  },
});