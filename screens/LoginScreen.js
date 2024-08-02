'use client';
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const LoginScreen = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    const body = {
      email,
      password,
    };
  
    console.log("login hit");
  
    try {
      const response = await fetch('http://10.0.0.18:5000/studyPlanner/api/v1/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(body),
      });
  
      const data = await response.json();
      console.log(data);
  
      if (response.ok) {
        // Save the token
        await AsyncStorage.setItem('userToken', data.token);
        
        // Save the userId
        await AsyncStorage.setItem('userId', String(data.user.user_Id));
        
        // Save the displayName
        await AsyncStorage.setItem('userName', data.user.displayName);
  
        Alert.alert('Login successful');
        navigation.navigate('HomeScreen');
      } else {
        Alert.alert('Login failed', data.message || 'Unknown error');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Error', 'An error occurred during login');
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Email</Text>
      <TextInput
        style={styles.input}
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        autoCapitalize="none"
      />
      <Text style={styles.label}>Password</Text>
      <TextInput
        style={styles.input}
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />
      <Button title="Login" onPress={handleLogin} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 16,
  },
  label: {
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: '#ccc',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default LoginScreen;
