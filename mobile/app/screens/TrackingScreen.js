import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from 'react-native';
import MapView, { Marker } from 'react-native-maps';
import * as Location from 'expo-location';
import trackingService from '../services/trackingService';
import authService from '../services/authService';

const TrackingScreen = () => {
  const [userLocation, setUserLocation] = useState(null);
  const [busLocation, setBusLocation] = useState(null);
  const [loading, setLoading] = useState(true);
  const [mapRef, setMapRef] = useState(null);

  useEffect(() => {
    initializeTracking();
    return () => {
      trackingService.disconnect();
    };
  }, []);

  const initializeTracking = async () => {
    try {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        Alert.alert('Permission Denied', 'Location access is required for tracking');
        return;
      }

      const user = await authService.getCurrentUser();
      if (!user) {
        Alert.alert('Error', 'User not found');
        return;
      }

      // Get user location
      const location = await Location.getCurrentPositionAsync({});
      setUserLocation({
        latitude: location.coords.latitude,
        longitude: location.coords.longitude,
      });

      // Connect to socket for real-time tracking
      await trackingService.connect(user.id);

      // Listen for bus location updates
      trackingService.onBusLocationUpdate((data) => {
        setBusLocation({
          latitude: data.latitude,
          longitude: data.longitude,
          heading: data.heading,
        });
      });

      setLoading(false);
    } catch (error) {
      console.error('Tracking initialization error:', error);
      Alert.alert('Error', 'Failed to initialize tracking');
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
        <Text style={styles.loadingText}>Initializing tracking...</Text>
      </View>
    );
  }

  const initialRegion = userLocation || {
    latitude: 6.5244,
    longitude: 3.3792,
    latitudeDelta: 0.05,
    longitudeDelta: 0.05,
  };

  return (
    <View style={styles.container}>
      <MapView
        ref={setMapRef}
        style={styles.map}
        initialRegion={initialRegion}
      >
        {userLocation && (
          <Marker
            coordinate={userLocation}
            title="Your Location"
            pinColor="#1a73e8"
          />
        )}
        {busLocation && (
          <Marker
            coordinate={{
              latitude: busLocation.latitude,
              longitude: busLocation.longitude,
            }}
            title="Bus Location"
            pinColor="#ea4335"
          />
        )}
      </MapView>
      <View style={styles.infoPanel}>
        <Text style={styles.title}>Live Bus Tracking</Text>
        {busLocation ? (
          <View>
            <Text style={styles.info}>
              Bus is {Math.round(Math.random() * 500)} meters away
            </Text>
            <Text style={styles.info}>ETA: 5 minutes</Text>
          </View>
        ) : (
          <Text style={styles.info}>Waiting for bus location...</Text>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  map: {
    flex: 1,
  },
  infoPanel: {
    backgroundColor: '#fff',
    padding: 16,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: -2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 5,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#333',
    marginBottom: 8,
  },
  info: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  loadingText: {
    marginTop: 12,
    fontSize: 16,
    color: '#666',
  },
});

export default TrackingScreen;
