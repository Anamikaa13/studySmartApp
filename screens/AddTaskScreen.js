import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const AddTaskScreen = ({ navigation }) => {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [fromDate, setFromDate] = useState(new Date().toISOString().split('T')[0]);
  const [toDate, setToDate] = useState(new Date().toISOString().split('T')[0]);

  const handleAddTask = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');
      const task = {
        user_id: userId,
        title,
        description,
        isDone: false,
        fromDate,
        toDate,
      };

      await axios.post('http://192.168.1.166:5000/studyPlanner/api/v1/addTask', task, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      navigation.goBack(); // Navigate back to HomeScreen
    } catch (error) {
      console.error('Failed to add task:', error);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Title</Text>
      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      
      <Text style={styles.label}>Description</Text>
      <TextInput style={styles.input} value={description} onChangeText={setDescription} />
      
      <Text style={styles.label}>From Date</Text>
      <TextInput style={styles.input} value={fromDate} onChangeText={setFromDate} />
      
      <Text style={styles.label}>To Date</Text>
      <TextInput style={styles.input} value={toDate} onChangeText={setToDate} />
      
      <Button title="Add Task" onPress={handleAddTask} />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
});

export default AddTaskScreen;
