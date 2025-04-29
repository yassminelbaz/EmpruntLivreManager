import React, { useState, useEffect } from 'react';
import { View, StyleSheet, ScrollView, Alert, ImageBackground } from 'react-native';
import { Text, Button, Card } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RouteProp } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';

type BookDetailsRouteProp = RouteProp<RootStackParamList, 'BookDetails'>;

interface BookDetailsProps {
  navigation: StackNavigationProp<RootStackParamList, 'BookDetails'>;
  route: BookDetailsRouteProp;
}


const BookDetails: React.FC<BookDetailsProps> = ({ navigation, route }) => {
  const { book } = route.params;
  const { user } = useAuth();
  const [bookData, setBookData] = useState(book);
  const [isLoading, setIsLoading] = useState(false);
  const [isBorrowedByCurrentUser, setIsBorrowedByCurrentUser] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);

  useEffect(() => {
    if (user?.role === 'admin') {
      setIsAdmin(true);
      return;
    }

    const checkBorrowStatus = async () => {
      try {
        const response = await api.get('/api/borrow/active');
        const activeBorrows = response.data || [];
        const userBorrow = activeBorrows.find((b: any) => b.book_id === book.id);
        setIsBorrowedByCurrentUser(!!userBorrow);
      } catch (error) {
        console.error("Erreur lors de la vérification de l'emprunt:", error);
      }
    };

    if (!book.available) {
      checkBorrowStatus();
    }
  }, [book.id, book.available, user]);

  const handleUpdate = () => {
    navigation.navigate('UpdateBook', { book });
  };

  const handleDelete = async () => {
    Alert.alert(
      'Confirmation',
      'Êtes-vous sûr de vouloir supprimer ce livre?',
      [
        { text: 'Annuler', style: 'cancel' },
        {
          text: 'Supprimer',
          onPress: async () => {
            setIsLoading(true);
            try {
              await api.delete(`/api/books/${book.id}`);
              navigation.goBack();
            } catch (error) {
              console.error("Erreur lors de la suppression:", error);
              Alert.alert('Erreur', "Impossible de supprimer le livre");
            } finally {
              setIsLoading(false);
            }
          },
        },
      ],
    );
  };

  const handleBorrow = async () => {
    setIsLoading(true);
    try {
      await api.post(`/api/books/borrow/${book.id}`);
      Alert.alert('Succès', 'Livre emprunté avec succès, Vous pouvez le recuperer dans votre Bibliotheque');
      setBookData({ ...bookData, available: false });
      setIsBorrowedByCurrentUser(true); 
    } catch (error: any) {
        Alert.alert('Erreur', error.response?.data?.message || "Emprunt impossible");
    }finally {
      setIsLoading(false);
    }
  };
      
      
    

    const handleReturn = async () => {
      setIsLoading(true);
      try {
        
        
        await api.post(`/api/books/return/${book.id}`);
        Alert.alert('Succès', 'Livre retourné avec succès');
        setBookData({ ...bookData, available: true });
        setIsBorrowedByCurrentUser(false);
      } catch (error: any) {
        Alert.alert('Erreur', error.response?.data?.message || "Retour impossible");
      } finally {
        setIsLoading(false);
      }
    };
      
      
     

    return (
      <ImageBackground
      source={require('../../assets/images/library.png')} // your background image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Card style={styles.card}>
          <Card.Content>
            <Text style={styles.title}>{book.title}</Text>
            <Text style={styles.label}>Auteur:</Text>
            <Text style={styles.value}>{book.author}</Text>
            
            <Text style={styles.label}>Genre:</Text>
            <Text style={styles.value}>{book.genre}</Text>
            
            <Text style={styles.label}>Disponibilité:</Text>
            <Text style={book.available ? styles.available : styles.unavailable}>
              {book.available ? 'Disponible' : 'Indisponible'}
            </Text>
            
            <Text style={styles.label}>Description:</Text>
            <Text style={styles.description}>{book.description}</Text>

            {isAdmin ? (
              <View style={styles.adminActions}>
                <Button 
                  mode="contained" 
                  onPress={handleUpdate}
                  style={styles.updateButton}
                  labelStyle={styles.buttonText}
                >
                  Modifier
                </Button>
                <Button 
                  mode="contained" 
                  onPress={handleDelete}
                  style={styles.deleteButton}
                  labelStyle={styles.buttonText}
                  loading={isLoading}
                  disabled={isLoading}
                >
                  Supprimer
                </Button>
              </View>
            ) : book.available ? (
              <Button 
                mode="contained" 
                onPress={handleBorrow}
                style={styles.borrowButton}
                labelStyle={styles.buttonText}
                loading={isLoading}
                disabled={isLoading}
              >
                Emprunter
              </Button>
            ) : isBorrowedByCurrentUser ? (
              <Button 
                mode="contained" 
                onPress={handleReturn}
                style={styles.returnButton}
                labelStyle={styles.buttonText}
                loading={isLoading}
                disabled={isLoading}
              >
                Retourner
              </Button>
            ) : (
              <Text style={styles.unavailableText}>
                Ce livre est actuellement emprunté
              </Text>
            )}
          </Card.Content>
        </Card>
        </View>
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
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  container: {
    flex: 1,
    backgroundColor: '#FFF8E1',
    padding: 16,
  },
  card: {
    backgroundColor: 'white',
    borderRadius: 8,
    padding: 20,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#6D4C41',
    marginBottom: 20,
    textAlign: 'center',
  },
  label: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#6D4C41',
    marginTop: 10,
  },
  value: {
    fontSize: 16,
    color: '#5A4A42',
    marginBottom: 10,
  },
  description: {
    fontSize: 16,
    color: '#5A4A42',
    lineHeight: 24,
    marginBottom: 20,
  },
  available: {
    color: '#388E3C',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  unavailable: {
    color: '#B00020',
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  borrowButton: {
    backgroundColor: '#6D4C41',
    marginTop: 20,
  },
  returnButton: {
    backgroundColor: '#8D6E63',
    marginTop: 20,
  },
  adminActions: {
    marginTop: 20,
    gap: 10,
  },
  updateButton: {
    backgroundColor: '#8D6E63',
  },
  deleteButton: {
    backgroundColor: '#6D4C41',
  },
  unavailableText: {
    color: '#B00020',
    fontSize: 16,
    textAlign: 'center',
    marginTop: 20,
  },
  buttonText: {
    color: 'white',
    fontSize: 16,
  },
});

export default BookDetails;