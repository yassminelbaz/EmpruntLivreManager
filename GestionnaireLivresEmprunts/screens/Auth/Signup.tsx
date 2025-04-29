import React, { useState, useContext } from 'react';
import { View, StyleSheet, Alert, Image, ImageBackground  } from 'react-native';
import { Button, TextInput, RadioButton, Text } from 'react-native-paper';
import { AuthContext } from '../../context/AuthContext';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/navigation';

interface SignupScreenProps {
  navigation: StackNavigationProp<RootStackParamList, 'Signup'>;
}

const SignupScreen: React.FC<SignupScreenProps> = ({ navigation }) => {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [role, setRole] = useState<'admin' | 'etudiant'>('etudiant');
  const { register } = useContext(AuthContext);

  const handleSignup = async () => {
    const userData = { name, email, password, role };

    try {
      await register(userData);
      Alert.alert('Succès', 'Inscription réussie!');
      navigation.navigate('Login');
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
    <View style={styles.formContainer}>
      <TextInput
        label="Nom complet"
        value={name}
        onChangeText={setName}
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: '#6D4C41' } }}
      />
      <TextInput
        label="Email"
        value={email}
        onChangeText={setEmail}
        keyboardType="email-address"
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: '#6D4C41' } }}
      />
      <TextInput
        label="Mot de passe"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
        style={styles.input}
        mode="outlined"
        theme={{ colors: { primary: '#6D4C41' } }}
      />

      <Text style={styles.roleLabel}>Rôle</Text>
      <RadioButton.Group onValueChange={(value) => setRole(value as 'admin' | 'etudiant')} value={role}>
        <View style={styles.radioContainer}>
          <RadioButton 
          value="etudiant"
          theme={{ colors: { primary: '#6D4C41' } }}
           />
          <Text>Étudiant</Text>
        </View>
        <View style={styles.radioContainer}>
          <RadioButton 
          value="admin"
          theme={{ colors: { primary: '#6D4C41' } }}
           />
          <Text>Admin</Text>
        </View>
      </RadioButton.Group>

      <Button mode="contained" onPress={handleSignup} style={styles.button} buttonColor="#6D4C41">
        S'inscrire
      </Button>
      <Button onPress={() => navigation.navigate('Login')} textColor="#6D4C41">
        Déjà un compte ? Connexion
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
  formContainer: {
    marginTop: 60, 
    padding: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    marginHorizontal: 20,
    borderRadius: 20,
  },
  logo: {
    width: 120,
    height: 120,
    resizeMode: 'contain',
    alignSelf: 'center',
    marginBottom: 50,
  },
  input: {
    marginBottom: 15,
    backgroundColor: 'white',
  },
  roleLabel: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8,
    marginTop: 10,
  },
  radioContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 5,
    
  },
  button: {
    marginTop: 15,
  },
});



export default SignupScreen;
