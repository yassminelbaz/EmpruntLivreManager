import React from 'react';
import { View, Text, TouchableOpacity, Image, StyleSheet, SafeAreaView } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import { Ionicons } from '@expo/vector-icons';
import { NativeStackNavigationProp } from '@react-navigation/native-stack';
import { RootStackParamList } from '../../types/navigation';

type HeaderProps = {
  title: string;
  onLogout?: () => void;
  showSearchIcon?: boolean;
  onSearchPress?: () => void;
};

type ProfileScreenNavigationProp = NativeStackNavigationProp<RootStackParamList, 'Profile'>;

export default function Header({ title, onLogout, showSearchIcon = false, onSearchPress }: HeaderProps) {
  const navigation = useNavigation<ProfileScreenNavigationProp>();

  return (
    <SafeAreaView style={styles.safeArea}>
    <View style={styles.container}>
      {/* Logo à gauche */}
      <Image 
        source={require('../../assets/logo.png')} 
        style={styles.logo} 
      />
      
      {/* Titre au centre */}
      <Text style={styles.title}>{title}</Text>
      
      {/* Icônes à droite */}
      <View style={styles.rightContainer}>
        {showSearchIcon && (
          <TouchableOpacity onPress={onSearchPress} style={styles.iconButton}>
            <Ionicons name="search-outline" size={24} />
          </TouchableOpacity>
        )}
        
        <TouchableOpacity onPress={() => navigation.navigate('Profile')} style={styles.iconButton}>
          <Ionicons name="person-circle-outline" size={24} />
        </TouchableOpacity>
        
        {onLogout && (
          <TouchableOpacity onPress={onLogout} style={styles.iconButton}>
            <Ionicons name="log-out-outline" size={24} />
          </TouchableOpacity>
        )}
      </View>
    </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#5D4037',
  },
  container: {
    height: 90,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  logo: {
    width: 30,
    height: 30,
  },
  title: {
    fontSize: 18,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginHorizontal: 10,
  },
  rightContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  iconButton: {
    marginLeft: 15,
  },
});