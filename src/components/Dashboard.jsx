import React from 'react';
import {View, Text, Button, StyleSheet} from 'react-native';
const Dashboard = ({navigation}) => {
  return (
    <View style={styles.container}>
      <Text style={styles.heading}>Welcome to my dashboard!</Text>
      <View style={styles.buttonSpacing} />
      <Button title="Log out" onPress={() => navigation.navigate('Login')} />
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#fff', // or any other background color
  },
  heading: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  buttonSpacing: {
    marginVertical: 10, // Adjust this value for the space between buttons
  },
});
export default Dashboard;
