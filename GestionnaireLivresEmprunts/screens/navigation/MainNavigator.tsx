import React, { useContext } from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../Home';
import ListBook from '../Books/ListBooks';
import ProfileScreen from '../Profile';
import Header from './Header';
import { AuthContext } from '../../context/AuthContext';
import { Ionicons } from '@expo/vector-icons';
import { RouteProp } from '@react-navigation/native';

// Définir les types pour les paramètres de navigation
type RootTabParamList = {
  Home: undefined;
  Books: undefined;
  Profile: undefined;
};

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator<RootTabParamList>();

function TabNavigator() {
  return (
    <Tab.Navigator
      screenOptions={({ route }: { route: RouteProp<RootTabParamList, keyof RootTabParamList> }) => ({
        tabBarIcon: ({ size, color }: { size: number; color: string }) => {
          let iconName: 'home-outline' | 'book-outline' | 'person-outline';

          if (route.name === 'Home') {
            iconName = 'home-outline';
          } else if (route.name === 'Books') {
            iconName = 'book-outline';
          } else {
            iconName = 'person-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: 'blue',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} />
      <Tab.Screen name="Books" component={ListBook as React.ComponentType<any>} />
      <Tab.Screen name="Profile" component={ProfileScreen} />
    </Tab.Navigator>
  );
}

export default function MainNavigator() {
  const { logout } = useContext(AuthContext);

  return (
    <Stack.Navigator>
      <Stack.Screen
        name="Tabs"
        component={TabNavigator}
        options={{
          header: () => <Header title="Ma Bibliothèque" onLogout={logout} />,
        }}
      />
    </Stack.Navigator>
  );
}