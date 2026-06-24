import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import bookingService from '../services/bookingService';

const BookingScreen = ({ navigation, route }) => {
  const [routes, setRoutes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRoute, setSelectedRoute] = useState(null);

  useEffect(() => {
    fetchRoutes();
  }, []);

  const fetchRoutes = async () => {
    try {
      setLoading(true);
      const data = await bookingService.getRoutes();
      setRoutes(data);
    } catch (error) {
      Alert.alert('Error', 'Failed to load routes');
    } finally {
      setLoading(false);
    }
  };

  const handleSelectRoute = (route) => {
    setSelectedRoute(route);
    navigation.navigate('BusSelection', { route });
  };

  const renderRoute = ({ item }) => (
    <TouchableOpacity
      style={styles.routeCard}
      onPress={() => handleSelectRoute(item)}
    >
      <View>
        <Text style={styles.routeName}>{item.name}</Text>
        <Text style={styles.routeInfo}>
          {item.departure} → {item.arrival}
        </Text>
        <Text style={styles.routeTime}>Next departure: {item.nextDeparture}</Text>
      </View>
      <View style={styles.priceContainer}>
        <Text style={styles.price}>₦{item.fare}</Text>
      </View>
    </TouchableOpacity>
  );

  if (loading) {
    return (
      <View style={styles.centerContainer}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Available Routes</Text>
      <FlatList
        data={routes}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderRoute}
        contentContainerStyle={styles.list}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f5f5f5',
  },
  centerContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#333',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#fff',
  },
  list: {
    padding: 12,
  },
  routeCard: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  routeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#333',
    marginBottom: 4,
  },
  routeInfo: {
    fontSize: 14,
    color: '#666',
    marginBottom: 4,
  },
  routeTime: {
    fontSize: 12,
    color: '#999',
  },
  priceContainer: {
    backgroundColor: '#e8f0fe',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 6,
  },
  price: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1a73e8',
  },
});

export default BookingScreen;
