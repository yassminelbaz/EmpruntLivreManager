import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, Image, ImageBackground } from 'react-native';
import { Button, TextInput } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

interface LoginScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Login'>;
}

const LoginScreen: React.FC<LoginScreenProps> = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const { login } = useContext(AuthContext);

  const handleLogin = async () => {
    try {
      await login(email, password);
      Alert.alert('Succès', 'Vous êtes connecté avec succès!');
      navigation.navigate('Home');
    } catch (error: any) {
      const errorMessage =
    error?.response?.data?.error?.message || 'Erreur inconnue';
  Alert.alert('Erreur', errorMessage);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/images/library.png')}
      style={styles.background}
      resizeMode="cover"
    >
      <View style={styles.overlay}>
        <TextInput
          label="Email"
          value={email}
          onChangeText={setEmail}
          style={styles.input}
          keyboardType="email-address"
          mode="outlined"
          theme={{ colors: { primary: 'black' } }}
        />
        <TextInput
          label="Mot de passe"
          value={password}
          onChangeText={setPassword}
          secureTextEntry
          style={styles.input}
          mode="outlined"
          theme={{ colors: { primary: 'black' } }}
        />
        <Button mode="contained" onPress={handleLogin} style={styles.button} buttonColor="#6D4C41">
          Connexion
        </Button>
        <Button onPress={() => navigation.navigate('Signup')} textColor="#6D4C41">
          Créer un compte
        </Button>
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: 'center',
  },
  overlay: {
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.85)', 
    margin: 20,
    borderRadius: 10,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  button: {
    marginTop: 10,
  },
});

export default LoginScreen;
