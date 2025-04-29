import React, { useState, useEffect } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import { TextInput, Button, Text } from 'react-native-paper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { RootStackParamList } from '../../types/navigation';
import api from '../../utils/api';

type RouteParams = {
  book?: {
    id: string;
    title: string;
    author: string;
    genre: string;
    description: string;
  };
};

const AddEditBookScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  const { book } = (route.params || {}) as RouteParams;

  const [formData, setFormData] = useState({
    title: book?.title || '',
    author: book?.author || '',
    genre: book?.genre || '',
    description: book?.description || '',
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    setLoading(true);
    try {
      if (book?.id) {
        
        await api.patch(`/api/books/${book.id}`, formData);
        Alert.alert('Succès', 'Livre mis à jour avec succès');
      } else {
        
        await api.post('/api/books', formData);
        Alert.alert('Succès', 'Livre ajouté avec succès');
      }
      navigation.goBack();
    } catch (error) {
      Alert.alert('Erreur', "Une erreur s'est produite");
      console.error(error);
    } finally {
      setLoading(false);
    }
  };
  

  return (
    <View style={styles.container}>
      <Text style={styles.title}>
        {book?.id ? 'Modifier le livre' : 'Ajouter un nouveau livre'}
      </Text>

      <TextInput
        label="Titre"
        value={formData.title}
        onChangeText={(text) => setFormData({...formData, title: text})}
        style={styles.input}
      />

      <TextInput
        label="Auteur"
        value={formData.author}
        onChangeText={(text) => setFormData({...formData, author: text})}
        style={styles.input}
      />

      <TextInput
        label="Genre"
        value={formData.genre}
        onChangeText={(text) => setFormData({...formData, genre: text})}
        style={styles.input}
      />

      <TextInput
        label="Description"
        value={formData.description}
        onChangeText={(text) => setFormData({...formData, description: text})}
        multiline
        numberOfLines={4}
        style={[styles.input, styles.descriptionInput]}
      />

      <Button
        mode="contained"
        onPress={handleSubmit}
        loading={loading}
        disabled={loading}
        style={styles.button}
      >
        {book?.id ? 'Mettre à jour' : 'Ajouter'}
      </Button>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#FFF8E1',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 20,
    color: '#5D4037',
    textAlign: 'center',
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  descriptionInput: {
    height: 100,
  },
  button: {
    marginTop: 20,
    backgroundColor: '#5D4037',
  },
});

export default AddEditBookScreen;