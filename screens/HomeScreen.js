import React, { useEffect, useState, useCallback } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Appbar, Checkbox, Card, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';
import { useFocusEffect } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons'; // Import icons from vector-icons

const HomeScreen = ({ navigation }) => {
  const [tasks, setTasks] = useState([]);
  const [totalTasks, setTotalTasks] = useState(0);
  const [completedTasks, setCompletedTasks] = useState(0);
  const [remainingTasks, setRemainingTasks] = useState(0);
  const [fromDate, setFromDate] = useState(new Date());
  const [toDate, setToDate] = useState(new Date());
  const [showFromDatePicker, setShowFromDatePicker] = useState(false);
  const [showToDatePicker, setShowToDatePicker] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [selectedTask, setSelectedTask] = useState(null);
  const [userName, setUserName] = useState('User');

  useEffect(() => {
    fetchTasks();
    getUserName();
  }, [fromDate, toDate]);

  useFocusEffect(
    useCallback(() => {
      fetchTasks();
    }, [])
  );

  const getUserName = async () => {
    const name = await AsyncStorage.getItem('userName');
    setUserName(name || 'User');
  };

  const fetchTasks = async () => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');
      
      if (!userId || !token) {
        console.error('User ID or token not found');
        return;
      }

      const response = await axios.post(
        'http://192.168.1.166:5000/studyPlanner/api/v1/getTask',
        {
          user_id: userId,
          fromDate: fromDate.toISOString().split('T')[0],
          toDate: toDate.toISOString().split('T')[0],
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );

      const data = response.data.data;
      setTasks(data);
      setTotalTasks(response.data.totalTasks);
      setCompletedTasks(data.filter(task => task.isDone).length);
      setRemainingTasks(response.data.totalTasks - data.filter(task => task.isDone).length);
    } catch (error) {
      console.error('Failed to fetch tasks:', error);
    }
  };

  const handleLogout = async () => {
    try {
      await AsyncStorage.removeItem('userToken');
      await AsyncStorage.removeItem('userId');
      navigation.navigate('LoginScreen');
    } catch (error) {
      console.error('Failed to logout:', error);
    }
  };

  const toggleTaskStatus = async (task) => {
    try {
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken');
      const payload = {
        user_id: userId,
        task_Id: task.task_Id,
        status: !task.isDone
      };
  
      console.log('Payload:', payload); // Log payload for debugging
  
      const response = await axios.post(
        'http://192.168.1.166:5000/studyPlanner/api/v1/toggleTask',
       
        payload,
        {
          headers: {
            'Authorization': `Bearer ${token}`,
                   
          },
        }
      );
      console.log('Response:', response.data);
      fetchTasks();
    } catch (error) {
      console.error('Failed to toggle task status:', error.response?.data || error.message);
    }
  };
  

  const deleteTask = async (task) => {
    try {
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        'http://192.168.1.166:5000/studyPlanner/api/v1/deleteTask',
        {
          user_id: task.user_id,
          task_Id: task.task_Id,
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`,
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Failed to delete task:', error);
    }
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString() : 'Select Date';
  };

  const renderTask = ({ item }) => (

    <Card style={styles.taskCard}>
      <Card.Content style={styles.taskContent}>
        <Text style={styles.taskTitle}>{item.title}</Text>
        <View style={styles.taskActions}>
          <Checkbox
            status={item.isDone ? 'checked' : 'unchecked'}
            onPress={() => toggleTaskStatus(item)}
          />
          <IconButton
            icon="delete"
            color="red"
            size={20}
            onPress={() => deleteTask(item)}
          />
        </View>
      </Card.Content>
    </Card>
  );

  return (
    <View style={styles.container}>
      <Appbar.Header>
        <Appbar.Content title={`Hello, ${userName}`} />
        <Appbar.Action icon="logout" onPress={handleLogout} />
      </Appbar.Header>
      <View style={styles.filterContainer}>
        <Button title={`From Date: ${formatDate(fromDate)}`} onPress={() => setShowFromDatePicker(true)} />
        {showFromDatePicker && (
          <DateTimePicker
            value={fromDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowFromDatePicker(false);
              setFromDate(selectedDate || fromDate);
            }}
          />
        )}

        <Button title={`To Date: ${formatDate(toDate)}`} onPress={() => setShowToDatePicker(true)} />
        {showToDatePicker && (
          <DateTimePicker
            value={toDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowToDatePicker(false);
              setToDate(selectedDate || toDate);
            }}
          />
        )}
      </View>
      <View style={styles.summaryContainer}>
        <Text>Total Tasks: {totalTasks}</Text>
        <Text>Completed: {completedTasks}</Text>
        <Text>Remaining: {remainingTasks}</Text>
      </View>
      <Button title="Add Task" onPress={() => navigation.navigate('AddTask')} />
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
  filterContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    padding: 10,
  },
  summaryContainer: {
    padding: 10,
    backgroundColor: '#f8f8f8',
  },
  taskCard: {
    margin: 10,
  },
  taskContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  taskTitle: {
    fontSize: 18,
    flex: 1,
  },
  taskActions: {
    flexDirection: 'row',
    alignItems: 'center',
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

export default HomeScreen;
