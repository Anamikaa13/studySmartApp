'use client';
import React, {useState} from 'react';
import {View, Text, TextInput, Button, StyleSheet, Alert} from 'react-native';
import {useNavigation} from '@react-navigation/native';

const Login = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigation = useNavigation();

  const validateEmail = email => {
    // Simple email validation
    return /\S+@\S+\.\S+/.test(email);
  };

  const validatePassword = password => {
    // Password validation: at least 6 characters, one special character, one digit, one lowercase, one uppercase letter
    const passwordRegex =
      /^(?=.*[a-z])/;
    return passwordRegex.test(password);
  };

  const handleLogin = () => {
    if (!validateEmail(email)) {
      Alert.alert('Invalid Email', 'Please enter a valid email address.');
      return;
    }

    if (!validatePassword(password)) {
      Alert.alert(
        'Invalid Password',
        'Password must be at least 6 characters long and include one special character, one digit, one lowercase letter, and one uppercase letter.',
      );
      return;
    }

    // Handle login logic here
    console.log('Logged in with:', email, password);

    // Clear the input fields after successful login
    setEmail('');
    setPassword('');

    navigation.navigate('HomeScreen');
  };

  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Login</Text>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Email Address</Text>
        <TextInput
          style={styles.input}
          value={email}
          onChangeText={text => setEmail(text)}
          placeholder="Enter your email"
          keyboardType="email-address"
          autoCapitalize="none"
          textContentType="emailAddress"
        />
      </View>

      <View style={styles.inputGroup}>
        <Text style={styles.label}>Password</Text>
        <TextInput
          style={styles.input}
          value={password}
          onChangeText={text => setPassword(text)}
          placeholder="Enter your password"
          secureTextEntry
          textContentType="password"
        />
      </View>

      <View style={styles.buttonContainer}>
        <Button title="Login" onPress={handleLogin} />
        <View style={styles.buttonSpacing} />
        <Button title="Sign Up" onPress={() => navigation.navigate('SignUp')} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 20,
  },
  heading: {
    fontSize: 24,
    marginBottom: 20,
    textAlign: 'center',
    fontWeight: 'bold',
  },
  inputGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: '#333',
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingLeft: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
  buttonSpacing: {
    marginVertical: 10, // Adjust this value for the space between buttons
  },
});

export default Login;
