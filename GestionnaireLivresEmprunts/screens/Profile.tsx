import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, TouchableOpacity, Alert, ScrollView, ImageBackground } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { useNavigation } from '@react-navigation/native';
import { RootStackParamList } from '../types/navigation'; 
import LogoutButton from './Auth/Logout';



const Profile = () => {
  const { user, token, logout } = useAuth();
  const [activeBorrows, setActiveBorrows] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchProfileData = async () => {
    try {
      setRefreshing(true);
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };

      const activeRes = await api.get('/api/borrow/active', config);
      setActiveBorrows(activeRes.data || []);
    } catch (error: any) {
      console.error('Erreur:', error.response?.data || error.message);
      Alert.alert('Erreur', 'Impossible de charger les données du profil');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchProfileData();
    }
  }, [token]);

  const handleReturnBook = async (bookId: number) => {
    try {
      await api.post(`/api/books/return/${bookId}`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      Alert.alert('Succès', 'Livre retourné avec succès');
      fetchProfileData();
    } catch (error) {
      Alert.alert('Erreur', 'Échec du retour du livre');
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8B4513" />
      </View>
    );
  }

  return (
    <ImageBackground 
  source={require('../assets/images/shelf.png')} 
  style={styles.backgroundImage}
  resizeMode="cover"
>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>Profil Utilisateur</Text>

      {/* Section Informations */}
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Informations Personnelles</Text>
        {user ? (
          <>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Nom:</Text>
              <Text style={styles.infoValue}>{user.name}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Email:</Text>
              <Text style={styles.infoValue}>{user.email}</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Rôle:</Text>
              <Text style={styles.infoValue}>{user.role}</Text>
            </View>
          </>
        ) : (
          <Text style={styles.noDataText}>Informations non disponibles</Text>
        )}
      </View>

      {/* Section Emprunts */}
      {user?.role !== 'admin' && (
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Mes Emprunts Actuels</Text>
        {activeBorrows.length > 0 ? (
          activeBorrows.map((borrow: any) => (
            <View key={borrow.id} style={styles.borrowCard}>
              <Text style={styles.bookTitle}>{borrow.Book?.title || 'Titre inconnu'}</Text>
              <Text style={styles.bookDetail}>Auteur: {borrow.Book?.author || 'Inconnu'}</Text>
              <Text style={styles.bookDetail}>
                Emprunté le: {new Date(borrow.borrow_date).toLocaleDateString()}
              </Text>
              <TouchableOpacity
                style={styles.returnButton}
                onPress={() => handleReturnBook(borrow.book_id)}
              >
                <Text style={styles.returnButtonText}>Retourner ce livre</Text>
              </TouchableOpacity>
            </View>
          ))
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>Aucun livre emprunté actuellement</Text>
          </View>
        )}
      </View>
      )} 
      
      
 {/* Bouton de déconnexion */}
 <LogoutButton  />

    </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    width: '100%',
    height: '100%',
  },  
  container: {
    flexGrow: 1,
   // backgroundColor: '#FFF8E1', 
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 30,
    color: 'white',
    textAlign: 'center',
  },
  section: {
    marginBottom: 30,
    backgroundColor: 'rgba(255, 253, 245, 0.9)',
    borderRadius: 15,
    padding: 20,
    shadowColor: '#5D4037',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 20,
    color: '#5D4037',
    borderBottomWidth: 1,
    borderBottomColor: '#D7CCC8',
    paddingBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    marginBottom: 15,
    alignItems: 'flex-start',
  },
  infoLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: '#5D4037',
    width: 80,
  },
  infoValue: {
    fontSize: 16,
    color: '#795548',
    flex: 1,
  },
  borrowCard: {
    marginBottom: 20,
    padding: 15,
    backgroundColor: 'white',
    borderRadius: 10,
    borderLeftWidth: 5,
    borderLeftColor: '#A1887F',
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#5D4037',
    marginBottom: 8,
  },
  bookDetail: {
    fontSize: 15,
    color: '#6D4C41',
    marginBottom: 5,
  },
  returnButton: {
    backgroundColor: '#8D6E63',
    padding: 12,
    borderRadius: 8,
    alignItems: 'center',
    marginTop: 10,
  },
  returnButtonText: {
    color: '#FFF8E1',
    fontWeight: 'bold',
    fontSize: 15,
  },
  noDataText: {
    fontSize: 16,
    color: '#8D6E63',
    fontStyle: 'italic',
    textAlign: 'center',
  },
  emptyState: {
    padding: 20,
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'rgba(239, 235, 233, 0.7)',
    borderRadius: 10,
  },
  emptyStateText: {
    fontSize: 16,
    color: '#8D6E63',
    textAlign: 'center',
  },
  logoutButton: {
    backgroundColor: '#6D4C41',
    padding: 15,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 20,
  },
  logoutButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: 'bold',
  },
});

export default Profile;