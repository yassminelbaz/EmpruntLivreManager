import React, { useEffect, useState } from 'react';
import { FlatList, StyleSheet, RefreshControl, View, TouchableOpacity, Alert, ImageBackground } from 'react-native';
import { Card, Text, ActivityIndicator, Button } from 'react-native-paper';
import axios from 'axios';
import { API_URL } from '@env';
import { useAuth } from '../../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';
import { RouteProp } from '@react-navigation/native';

interface Book {
  id: string;
  title: string;
  author: string;
  genre: string;
  description: string;
  available: boolean;
}



interface ListBookProps {
  navigation: StackNavigationProp<RootStackParamList, 'ListBooks'>;
  route: RouteProp<RootStackParamList, 'ListBooks'>;
}

const ListBook: React.FC<ListBookProps> = ({ navigation, route }) => {
  const { token, user } = useAuth();
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [refreshing, setRefreshing] = useState(false);

  const fetchBooks = async () => {
    try {
      const response = await axios.get(`${API_URL}/api/books`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });
      setBooks(response.data);
      setError('');
    } catch (err) {
      console.error('Fetch books error:', err);
      setError('Erreur lors du chargement des livres');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    if (route.params?.refresh) {
      fetchBooks();
      navigation.setParams({ refresh: false });
    }
  }, [route.params?.refresh]);

  useEffect(() => {
    fetchBooks();
  }, []);

  const handleBorrow = async (bookId: string) => {
    try {
      setRefreshing(true);
      await axios.post(`${API_URL}/api/books/borrow/${bookId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchBooks();
      Alert.alert('Succès', 'Livre emprunté avec succès');
    } catch (error: any) {
      console.error('Borrow error:', error);
      Alert.alert('Erreur', error.response?.data?.message || "Emprunt impossible");
    }
  };

  const handleReturn = async (bookId: string) => {
    try {
      setRefreshing(true);
      await axios.post(`${API_URL}/api/books/return/${bookId}`, {}, {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      await fetchBooks();
      Alert.alert('Succès', 'Livre retourné avec succès');
    } catch (error: any) {
      console.error('Return error:', error);
      Alert.alert('Erreur', error.response?.data?.message || "Retour impossible");
    }
  };

  const onRefresh = () => {
    setRefreshing(true);
    fetchBooks();
  };

  if (loading) {
    return (
      <View style={[styles.centered, styles.container]}>
        <ActivityIndicator animating={true} size="large" color="#6D4C41" />
      </View>
    );
  }

  if (error) {
    return (
      <View style={[styles.centered, styles.container]}>
        <Text style={styles.errorText}>{error}</Text>
        <Button 
          mode="contained" 
          onPress={fetchBooks}
          style={styles.button}
          labelStyle={styles.buttonText}
        >
          Réessayer
        </Button>
      </View>
    );
  }
  const isStudent = user?.role === 'etudiant';
  const isAdmin = user?.role === 'admin';
  return (
    <ImageBackground
    source={require('../../assets/images/library.png')} // your background image
    style={styles.background}
    resizeMode="cover"
  >
      {user?.role === 'admin' && (
        <Button 
          mode="contained" 
          onPress={() => navigation.navigate('AddBook')}
          style={styles.addButton}
          labelStyle={styles.buttonText}
        >
          Ajouter un livre
        </Button>
      )}
      <FlatList
        data={books}
        keyExtractor={(item) => item.id}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            colors={['#6D4C41']}
            tintColor="#6D4C41"
          />
        }
        renderItem={({item}) => (
          <TouchableOpacity 
            onPress={() => navigation.navigate('BookDetails', { book: item })}
          >
            <Card style={styles.bookCard}>
  <Card.Content>
    <Text style={styles.bookTitle}>{item.title}</Text>
    <Text style={styles.bookAuthor}>{item.author}</Text>
    <Text style={styles.bookGenre}>{item.genre}</Text>
    <Text style={styles.bookDescription}>{item.description}</Text>
    {isStudent && item.available && (
      <View style={styles.studentActions}>
        <Button 
          mode="contained" 
          onPress={() => handleBorrow(item.id)}
          style={styles.borrowButton}
        >
          Emprunter
        </Button>
      </View>
    )}
  </Card.Content>
</Card>
          </TouchableOpacity>
        )}
        ListEmptyComponent={
          <View style={[styles.centered, styles.container]}>
            <Text style={styles.emptyText}>Aucun livre disponible</Text>
          </View>
        }
        contentContainerStyle={styles.listContent}
      />
     </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', // optional: light overlay for readability
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#FFF8E1', // Fond beige
  },
  bookCard: {
    marginBottom: 16,
    elevation: 2,
    backgroundColor: 'white', // Fond blanc pour les cartes
    borderRadius: 8,
    padding: 16,
  },
  studentActions: {
    marginTop: 10,
  },
  borrowButton: {
    backgroundColor: '#6D4C41',
    marginTop: 10,
  },
  returnButton: {
    backgroundColor: '#8D6E63',
    marginTop: 10,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#6D4C41', // Marron
    marginBottom: 4,
  },
  bookAuthor: {
    fontSize: 16,
    color: '#5A4A42', // Marron clair
    marginBottom: 4,
  },
  bookGenre: {
    fontSize: 14,
    color: '#8D6E63', // Marron plus clair
    fontStyle: 'italic',
    marginBottom: 4,
  },
  bookDescription: {
    fontSize: 14,
    color: '#5A4A42',
    marginTop: 8,
    lineHeight: 20,
  },
  addButton: {
    backgroundColor: '#8D6E63',
    marginBottom: 16,
    marginTop: 16,
    width: '100%',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  errorText: {
    color: '#B00020',
    marginBottom: 16,
    fontSize: 16,
  },
  button: {
    backgroundColor: '#6D4C41',
    width: '50%',
  },
  buttonText: {
    color: 'white',
  },
  emptyText: {
    color: '#5A4A42',
    fontSize: 16,
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default ListBook;