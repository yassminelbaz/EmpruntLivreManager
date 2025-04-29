import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Modal,
  ScrollView,
  FlatList,
  ActivityIndicator,
  StyleSheet,
  Button,
  Alert
} from 'react-native';

import { Ionicons } from '@expo/vector-icons';
import api from '../utils/api';
import { AxiosError } from 'axios';

interface SearchBarreProps {
  searchText: string;
  onSearchTextChange: (text: string) => void;
  onFilterApply: (filters: { genre?: string; availableOnly: boolean }) => void;
  genres: string[];
  isLoading?: boolean;
}

type Book = {
  id: string;
  title: string;
  author: string;
  genre: string;
  available: boolean;
  description?: string;
};

type Filters = {
  genre?: string;
  availableOnly: boolean;
};

const SearchBarre = () => {
  const [books, setBooks] = useState<Book[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [showFilters, setShowFilters] = useState(false);
  const [searchText, setSearchText] = useState('');
  const [filters, setFilters] = useState<Filters>({ availableOnly: false });
  const genres = ['Mathematique', 'Physique', 'Informatique'];

  const fetchBooks = async (): Promise<Book[]> => {
    try {
      const response = await api.get('/api/books');
      return response.data;
    } catch (error) {
      const err = error as AxiosError<{ message?: string }>;
      Alert.alert('Erreur', err.response?.data?.message || 'Échec du chargement');
      return [];
    }
  };

  const handleSearch = async (text: string) => {
    setSearchText(text);
    setIsLoading(true);
    try {
      const allBooks = await fetchBooks();
      const filtered = allBooks.filter(book => 
        book.title.toLowerCase().includes(text.toLowerCase()) ||
        book.author.toLowerCase().includes(text.toLowerCase())
      );
      setBooks(filtered);
    } catch (error) {
      console.error('Search error:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const applyFilters = async (newFilters: Filters) => {
    setIsLoading(true);
    setFilters(newFilters);
    setShowFilters(false);
    
    try {
      let filtered: Book[] = [];
      
      if (newFilters.genre && newFilters.availableOnly) {
        const genreBooks = await api.get(`/api/books/genre/${newFilters.genre}`);
        filtered = genreBooks.data.filter((b: Book) => b.available);
      } else if (newFilters.genre) {
        const res = await api.get(`/api/books/genre/${newFilters.genre}`);
        filtered = res.data;
      } else if (newFilters.availableOnly) {
        const res = await api.get('/api/books/availability/true');
        filtered = res.data;
      } else {
        const res = await api.get('/api/books');
        filtered = res.data;
      }
      
      // Applique aussi la recherche textuelle si elle existe
      if (searchText) {
        filtered = filtered.filter(book => 
          book.title.toLowerCase().includes(searchText.toLowerCase()) ||
          book.author.toLowerCase().includes(searchText.toLowerCase())
        );
      }
      
      setBooks(filtered);
    } catch (error) {
      const err = error as AxiosError;
      Alert.alert('Erreur', err.message);
    } finally {
      setIsLoading(false);
    }
  };

  const renderBookItem = ({ item }: { item: Book }) => (
    <View style={styles.bookItem}>
      <Text style={styles.title}>{item.title}</Text>
      <Text>Auteur: {item.author}</Text>
      <Text>Genre: {item.genre}</Text>
      <Text>Disponible: {item.available ? 'Oui' : 'Non'}</Text>
      {item.description && <Text>Description: {item.description}</Text>}
    </View>
  );

  return (
    <View style={styles.container}>
      {/* Barre de recherche */}
      <View style={styles.searchContainer}>
        <TextInput
          style={styles.input}
          placeholder="Rechercher..."
          value={searchText}
          onChangeText={handleSearch}
          onSubmitEditing={({ nativeEvent: { text } }) => handleSearch(text)}
        />
        <TouchableOpacity 
          onPress={() => setShowFilters(true)}
          style={styles.filterButton}
        >
          <Ionicons name="filter" size={24} color="gray" />
        </TouchableOpacity>
      </View>

      {/* Filtres */}
      <Modal visible={showFilters} animationType="slide" transparent>
        <View style={styles.modalOverlay}>
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>Filtres</Text>
            
            <Text style={styles.label}>Genre:</Text>
            <ScrollView style={styles.genreList}>
              {genres.map(genre => (
                <TouchableOpacity
                  key={genre}
                  style={[
                    styles.genreItem,
                    filters.genre === genre && styles.selectedGenre
                  ]}
                  onPress={() => setFilters({...filters, genre})}
                >
                  <Text>{genre}</Text>
                </TouchableOpacity>
              ))}
            </ScrollView>

            <View style={styles.checkboxContainer}>
              <Text>Disponible seulement:</Text>
              <TouchableOpacity 
                style={styles.checkbox}
                onPress={() => setFilters({
                  ...filters, 
                  availableOnly: !filters.availableOnly
                })}
              >
                {filters.availableOnly && (
                  <Ionicons name="checkmark" size={20} color="green" />
                )}
              </TouchableOpacity>
            </View>

            <View style={styles.buttonRow}>
              <Button 
                title="Annuler" 
                onPress={() => setShowFilters(false)} 
              />
              <Button 
                title="Appliquer" 
                onPress={() => applyFilters(filters)} 
              />
            </View>
          </View>
        </View>
      </Modal>

      {/* Résultats */}
      {isLoading ? (
        <ActivityIndicator size="large" style={styles.loader} />
      ) : books.length > 0 ? (
        <FlatList
          data={books}
          renderItem={renderBookItem}
          keyExtractor={item => item.id}
          contentContainerStyle={styles.listContent}
        />
      ) : (
        <Text style={styles.noResults}>Aucun résultat trouvé</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
    backgroundColor: '#fff',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 8,
    paddingHorizontal: 12,
  },
  input: {
    flex: 1,
    height: 40,
    paddingVertical: 8,
  },
  filterButton: {
    padding: 8,
  },
  modalOverlay: {
    flex: 1,
    justifyContent: 'center',
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  modalContent: {
    backgroundColor: 'white',
    marginHorizontal: 20,
    padding: 20,
    borderRadius: 8,
    maxHeight: '80%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    textAlign: 'center',
  },
  label: {
    fontWeight: 'bold',
    marginBottom: 8,
  },
  genreList: {
    maxHeight: 150,
    marginBottom: 16,
  },
  genreItem: {
    padding: 12,
    borderWidth: 1,
    borderColor: '#eee',
    borderRadius: 4,
    marginBottom: 8,
  },
  selectedGenre: {
    backgroundColor: '#e3f2fd',
    borderColor: '#64b5f6',
  },
  checkboxContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 1,
    borderColor: '#999',
    borderRadius: 4,
    marginLeft: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
  },
  bookItem: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
  },
  title: {
    fontWeight: 'bold',
    fontSize: 16,
    marginBottom: 4,
  },
  loader: {
    marginTop: 20,
  },
  noResults: {
    textAlign: 'center',
    marginTop: 20,
    color: '#666',
  },
  listContent: {
    paddingBottom: 16,
  },
});

export default SearchBarre;