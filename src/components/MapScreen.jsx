import React, { useState } from 'react';
import MapView, { Marker } from 'react-native-maps';
import { View, Button } from 'react-native';

const MapScreen = ({ navigation }) => {
  const [selectedLocation, setSelectedLocation] = useState(null);

  const handleSelectLocation = (event) => {
    setSelectedLocation(event.nativeEvent.coordinate);
  };

  const handleSaveLocation = () => {
    navigation.navigate('ReminderSetup', { location: selectedLocation });
  };

  return (
    <View style={{ flex: 1 }}>
      <MapView
        style={{ flex: 1 }}
        onPress={handleSelectLocation}
      >
        {selectedLocation && <Marker coordinate={selectedLocation} />}
      </MapView>
      <Button title="Save Location" onPress={handleSaveLocation} />
    </View>
  );
};

export default MapScreen;
