import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AuthProvider, useAuth } from './context/AuthContext'; // Ajoutez useAuth
import LoginScreen from './screens/Auth/Login';
import SignupScreen from './screens/Auth/Signup';
import ListBook from './screens/Books/ListBooks';
import HomeScreen from './screens/Home';
import BookDetails from './screens/Books/BookDetails';
import { RootStackParamList } from './types/navigation';
import SearchBarre from './screens/SearchBarre';
import ProfileScreen from './screens/Profile';
import { Ionicons } from '@expo/vector-icons';
import HistoryRedirector from './components/HistoryRedirector';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import AdminLogsScreen from './screens/Admin/Logs';
import Historique from './screens/Historique';
import EditEtAdd from './screens/Admin/EditEtAdd';
import Header from './screens/navigation/Header';
import { withCustomHeader } from './styles/CustomHeader';




const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator();

// Créez votre navigateur d'onglets
function MainTabs() {
  const { user } = useAuth();

  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        headerShown: true, // 👈 Ajoute ça pour afficher les headers natifs dans les tabs
        tabBarIcon: ({ focused, color, size }) => {
          let iconName: keyof typeof Ionicons.glyphMap;

          switch (route.name) {
            case 'HomeTab':
              iconName = focused ? 'home' : 'home-outline';
              break;
            case 'BooksTab':
              iconName = focused ? 'book' : 'book-outline';
              break;
            case 'HistoryTab':
              iconName = focused ? 'time' : 'time-outline';
              break;
            case 'ProfileTab':
              iconName = focused ? 'person' : 'person-outline';
              break;
            default:
              iconName = 'help-outline';
          }

          return <Ionicons name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#5D4037',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen
        name="HomeTab"
        component={HomeScreen}
        options={{ title: 'Accueil' }}
      />
      <Tab.Screen
        name="BooksTab"
        component={ListBook as React.ComponentType<any>}
        options={{ title: 'Nos Livres' }}
      />
      <Tab.Screen
        name="HistoryTab"
        component={HistoryRedirector}
        options={{
          title: user?.role === 'admin' ? 'Journal admin' : 'Mes emprunts',
        }}
      />
      <Tab.Screen
        name="ProfileTab" // 👈 cohérence
        component={ProfileScreen}
        options={{ title: 'Profil' }}
      />
    </Tab.Navigator>
  );
}


export default function App() {
  return (
    <SafeAreaProvider>
      <AuthProvider>
        <NavigationContainer>
        <Stack.Navigator>
  <Stack.Screen 
    name="Login" 
    component={LoginScreen} 
    options={{ headerShown: false }} 
  />
  <Stack.Screen 
    name="Signup" 
    component={SignupScreen} 
    options={{ title: 'Inscription' }} 
  />
  <Stack.Screen 
    name="Home" 
    component={MainTabs} 
    options={{ headerShown: false }} 
  />
  <Stack.Screen 
    name="BookDetails" 
    component={BookDetails} 
    options={{ title: 'Détails du Livre' }} 
  />
  <Stack.Screen 
    name="Search" 
    component={SearchBarre} 
    options={{ title: 'Chercher un livre spécifique' }} 
  />
  <Stack.Screen 
    name="AddBook" 
    component={EditEtAdd} 
    options={{ title: 'Ajouter un livre' }} 
  />
  <Stack.Screen 
    name="UpdateBook" 
    component={EditEtAdd} 
    options={{ title: 'Modifier le livre' }} 
  />
</Stack.Navigator>
        </NavigationContainer>
      </AuthProvider>
    </SafeAreaProvider>
  );
}