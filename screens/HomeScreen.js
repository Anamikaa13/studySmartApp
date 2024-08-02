import React, { useEffect, useState } from 'react';
import { View, Text, Button, StyleSheet, FlatList, Modal, TouchableOpacity } from 'react-native';
import { Appbar, Checkbox, Card } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import DateTimePicker from '@react-native-community/datetimepicker';

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

  const getUserName = async () => {
    const name = await AsyncStorage.getItem('userName');
    setUserName(name || 'User');
  };

  const fetchTasks = async () => {
    try {
      // Retrieve user ID and token from AsyncStorage
      const userId = await AsyncStorage.getItem('userId');
      const token = await AsyncStorage.getItem('userToken'); // Make sure the key matches what you used when saving
      
      if (!userId || !token) {
        console.error('User ID or token not found');
        return;
      }

      const response = await axios.post(
        'http://10.0.0.18:5000/studyPlanner/api/v1/getTask',
        {
          user_id: userId,
          fromDate: fromDate.toISOString().split('T')[0],
          toDate: toDate.toISOString().split('T')[0],
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
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
    console.log("working");
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
      const token = await AsyncStorage.getItem('userToken');
      await axios.post(
        'http://10.0.0.18:5000/studyPlanner/api/v1/toggleTask',
        {
          user_id: task.user_id,
          task_Id: task.task_Id,
          status: !task.isDone
        },
        {
          headers: {
            'Authorization': `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      fetchTasks();
    } catch (error) {
      console.error('Failed to toggle task status:', error);
    }
  };

  const formatDate = (date) => {
    return date ? date.toLocaleDateString() : 'Select Date';
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
