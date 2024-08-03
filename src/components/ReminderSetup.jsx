import React, { useState } from 'react';
import { View, Text, TextInput, Button, Alert } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';

const ReminderSetup = ({ route, navigation }) => {
  const { location } = route.params;
  const [reminderText, setReminderText] = useState('');

  const saveReminder = async () => {
    const reminder = {
      text: reminderText,
      location,
    };
    await AsyncStorage.setItem('reminder', JSON.stringify(reminder));
    Alert.alert('Reminder saved');
    navigation.goBack();
  };

  return (
    <View>
      <Text>Set a reminder for this location:</Text>
      <TextInput
        placeholder="Enter reminder"
        value={reminderText}
        onChangeText={setReminderText}
      />
      <Button title="Save Reminder" onPress={saveReminder} />
    </View>
  );
};

export default ReminderSetup;
