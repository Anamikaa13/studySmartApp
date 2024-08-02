import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, FlatList, Modal, TouchableOpacity, Button } from 'react-native';
import { Appbar, Card, Checkbox } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';

const RemindersScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);

  useEffect(() => {
    fetchTasks();
  }, []);

  const fetchTasks = async () => {
    try {
      const response = await axios.post('https://api.example.com/tasks', {
        user_id: '2',
        fromDate: new Date().toISOString().split('T')[0], // Current date
        toDate: '9999-12-31', // Far future date to get all upcoming tasks
      });

      const data = response.data.data.filter(task => new Date(task.fromDate) > new Date());
      setTasks(data);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      await axios.post('https://api.example.com/toggleTask', {
        user_id: task.user_id,
        task_Id: task.task_Id,
        status: !task.isDone
      });
      fetchTasks();
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    }
  };

  const renderTask = ({ item }) => (
    <TouchableOpacity onPress={() => { setSelectedTask(item); setModalVisible(true); }}>
      <Card style={styles.taskCard}>
        <Card.Content>
          <Text>{item.title}</Text>
          <Checkbox
            status={item.isDone ? 'checked' : 'unchecked'}
            onPress={() => toggleTaskStatus(item)}
          />
        </Card.Content>
      </Card>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title="Reminders" />
      </Appbar.Header>
      <FlatList
        data={tasks}
        renderItem={renderTask}
        keyExtractor={item => item.task_Id.toString()}
      />
      {selectedTask && (
        <Modal
          animationType="slide"
          transparent={true}
          visible={modalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
          <View style={styles.modalView}>
            <Text style={styles.modalTitle}>{selectedTask.title}</Text>
            <Text>{selectedTask.description}</Text>
            <Text>{`From: ${new Date(selectedTask.fromDate).toLocaleDateString()}`}</Text>
            <Text>{`To: ${new Date(selectedTask.toDate).toLocaleDateString()}`}</Text>
            <Button title="Close" onPress={() => setModalVisible(false)} />
          </View>
        </Modal>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  taskCard: {
    margin: 10,
  },
  modalView: {
    margin: 20,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  modalTitle: {
    fontSize: 24,
    marginBottom: 15,
  },
});

export default RemindersScreen;
