'use client'
import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const SignUp = () => {
    const [name, setName] = useState('');
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const navigation = useNavigation();

    const validateEmail = (email) => {
        // Simple email validation
        return /\S+@\S+\.\S+/.test(email);
    };

    const validatePassword = (password) => {
        // Password validation: at least 6 characters, one special character, one digit, one lowercase, one uppercase letter
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{6,}$/;
        return passwordRegex.test(password);
    };

    const handleSignUp = () => {
        if (!name.trim()) {
            Alert.alert("Invalid Name", "Please enter a valid name.");
            return;
        }

        if (!validateEmail(email)) {
            Alert.alert("Invalid Email", "Please enter a valid email address.");
            return;
        }

        if (!validatePassword(password)) {
            Alert.alert("Invalid Password", "Password must be at least 6 characters long and include one special character, one digit, one lowercase letter, and one uppercase letter.");
            return;
        }

        if (password !== confirmPassword) {
            Alert.alert("Password Mismatch", "The passwords do not match. Please re-enter the passwords.");
            return;
        }

        // Handle sign up logic here
        console.log("Signed up with:", name, email, password);
        
        // Clear the input fields after successful sign-up
        setName('');
        setEmail('');
        setPassword('');
        setConfirmPassword('');
        
        navigation.navigate('Login');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.heading}>Sign Up</Text>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Name</Text>
                <TextInput
                    style={styles.input}
                    value={name}
                    onChangeText={(text) => setName(text)}
                    placeholder="Enter your name"
                    autoCapitalize="words"
                />
            </View>
            
            <View style={styles.inputGroup}>
                <Text style={styles.label}>Email Address</Text>
                <TextInput
                    style={styles.input}
                    value={email}
                    onChangeText={(text) => setEmail(text)}
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
                    onChangeText={(text) => setPassword(text)}
                    placeholder="Enter your password"
                    secureTextEntry
                    textContentType="newPassword"
                />
            </View>

            <View style={styles.inputGroup}>
                <Text style={styles.label}>Confirm Password</Text>
                <TextInput
                    style={styles.input}
                    value={confirmPassword}
                    onChangeText={(text) => setConfirmPassword(text)}
                    placeholder="Re-enter your password"
                    secureTextEntry
                    textContentType="newPassword"
                />
            </View>

            <Button title="Sign Up" onPress={handleSignUp} />
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
});

export default SignUp;
