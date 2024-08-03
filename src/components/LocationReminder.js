import React, { useState, useEffect } from 'react';
import { View, Text, Button, Alert } from 'react-native';
import Geolocation from 'react-native-geolocation-service';
import { request, PERMISSIONS } from 'react-native-permissions';

const LocationReminder = () => {
  const [location, setLocation] = useState(null);

  useEffect(() => {
    requestLocationPermission();
  }, []);

  const requestLocationPermission = async () => {
    const permissionStatus = await request(
      Platform.OS === 'ios'
        ? PERMISSIONS.IOS.LOCATION_WHEN_IN_USE
        : PERMISSIONS.ANDROID.ACCESS_FINE_LOCATION,
    );

    if (permissionStatus === 'granted') {
      getCurrentLocation();
    } else {
      Alert.alert('Permission Denied', 'Location permission is required to use this feature');
    }
  };

  const getCurrentLocation = () => {
    Geolocation.getCurrentPosition(
      (position) => {
        setLocation(position.coords);
      },
      (error) => {
        Alert.alert('Error', `Location fetch failed: ${error.message}`);
      },
      { enableHighAccuracy: true, timeout: 15000, maximumAge: 10000 },
    );
  };

  return (
    <View>
      {location ? (
        <Text>Current Location: {location.latitude}, {location.longitude}</Text>
      ) : (
        <Text>Fetching location...</Text>
      )}
    </View>
  );
};

export default LocationReminder;
