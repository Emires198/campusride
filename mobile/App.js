import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { ActivityIndicator, View } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Ionicons } from '@expo/vector-icons';

// Auth Screens
import LoginScreen from './app/screens/LoginScreen';
// Main Screens
import BookingScreen from './app/screens/BookingScreen';
import TrackingScreen from './app/screens/TrackingScreen';
import WalletScreen from './app/screens/WalletScreen';
import ProfileScreen from './app/screens/ProfileScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

const AuthStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: false,
      animationEnabled: true,
    }}
  >
    <Stack.Screen name="Login" component={LoginScreen} />
  </Stack.Navigator>
);

const BookingStack = () => (
  <Stack.Navigator
    screenOptions={{
      headerShown: true,
      headerStyle: { backgroundColor: '#1a73e8' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' },
    }}
  >
    <Stack.Screen name="BookingHome" component={BookingScreen} options={{ title: 'Book a Ride' }} />
  </Stack.Navigator>
);

const AppStack = () => (
  <Tab.Navigator
    screenOptions={({ route }) => ({
      headerShown: true,
      headerStyle: { backgroundColor: '#1a73e8' },
      headerTintColor: '#fff',
      headerTitleStyle: { fontWeight: '600' },
      tabBarIcon: ({ focused, color, size }) => {
        let iconName;
        if (route.name === 'Booking') {
          iconName = focused ? 'bus' : 'bus-outline';
        } else if (route.name === 'Tracking') {
          iconName = focused ? 'locate' : 'locate-outline';
        } else if (route.name === 'Wallet') {
          iconName = focused ? 'wallet' : 'wallet-outline';
        } else if (route.name === 'Profile') {
          iconName = focused ? 'person' : 'person-outline';
        }
        return <Ionicons name={iconName} size={size} color={color} />;
      },
      tabBarActiveTintColor: '#1a73e8',
      tabBarInactiveTintColor: '#999',
    })}
  >
    <Tab.Screen
      name="Booking"
      component={BookingStack}
      options={{ title: 'Book' }}
    />
    <Tab.Screen
      name="Tracking"
      component={TrackingScreen}
      options={{ title: 'Track' }}
    />
    <Tab.Screen
      name="Wallet"
      component={WalletScreen}
      options={{ title: 'Wallet' }}
    />
    <Tab.Screen
      name="Profile"
      component={ProfileScreen}
      options={{ title: 'Profile' }}
    />
  </Tab.Navigator>
);

const RootNavigator = () => {
  const [authToken, setAuthToken] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    bootstrapAsync();
  }, []);

  const bootstrapAsync = async () => {
    try {
      const token = await AsyncStorage.getItem('authToken');
      setAuthToken(token);
    } catch (e) {
      console.error('Failed to restore token:', e);
    }
    setIsLoading(false);
  };

  if (isLoading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" color="#1a73e8" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {authToken === null ? <AuthStack /> : <AppStack />}
    </NavigationContainer>
  );
};

export default RootNavigator;
