import React from 'react';
import { View, Text, StyleSheet, ImageBackground } from 'react-native';
import { Button, useTheme } from 'react-native-paper';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';

interface HomeScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Home'>;
}

const HomeScreen: React.FC<HomeScreenProps> = ({ navigation }) => {
  const theme = useTheme();

  return (
    <ImageBackground
      source={require('../assets/images/library.png')} // your background image
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <Text style={styles.welcomeText}>Bienvenue à la Bibliothèque </Text>

        <View style={styles.featuresContainer}>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Empruntez vos livres en ligne</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Retournez vos livres facilement</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Consultez les livres disponibles</Text>
          </View>
          <View style={styles.featureItem}>
            <Text style={styles.featureBullet}>•</Text>
            <Text style={styles.featureText}>Découvrez notre collection étendue</Text>
          </View>
        </View>

        <Button
          mode="contained"
          onPress={() => navigation.navigate('BooksTab')}
          style={styles.button}
          labelStyle={styles.buttonLabel}
        >
          Consulter notre catalogue
        </Button>
        <Button
          mode="contained"
          onPress={() => navigation.navigate('Search')}
          style={styles.testButton}
          labelStyle={styles.buttonLabel}
        >
          Chercher un livre spécifique
        </Button>
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
    //backgroundColor: 'rgba(255, 255, 255, 0.85)', // optional: light overlay for readability
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  welcomeText: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 30,
    textAlign: 'center',
    color: 'white',
  },
  featuresContainer: {
    marginBottom: 40,
    width: '100%',
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginVertical: 6,
    paddingHorizontal: 20,
  },
  featureBullet: {
    color: '#6D4C41',
    fontSize: 24,
    marginRight: 10,
  },
  featureText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
  },
  button: {
    width: '80%',
    marginTop: 20,
    backgroundColor: '#6D4C41',
  },
  buttonLabel: {
    color: 'white',
    fontSize: 16,
  },
  testButton: {
    width: '80%',
    marginTop: 15,
    backgroundColor: '#8D6E63',
  },
});

export default HomeScreen;
