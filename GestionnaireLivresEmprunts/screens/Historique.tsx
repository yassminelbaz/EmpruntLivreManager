import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';
import { useAuth } from '../context/AuthContext';
import api from '../utils/api';
import { Ionicons } from '@expo/vector-icons';

const Historique = () => {
  const { token } = useAuth();
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchHistoryData = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${token}` }
      };
      const logsRes = await api.get('/api/borrow/logs', config);
      setLogs(logsRes.data?.logs || []);
    } catch (error: any) {
      console.error('Erreur:', error.response?.data || error.message);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (token) {
      fetchHistoryData();
    }
  }, [token]);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8D6E63" />
      </View>
    );
  }
  const formatDate = (dateInput: any) => {
    if (!dateInput) return 'Date inconnue';
    
    // Si c'est déjà un objet Date valide
    if (dateInput instanceof Date && !isNaN(dateInput.getTime())) {
      return dateInput.toLocaleDateString('fr-FR');
    }
    
    // Si c'est une chaîne ISO (2023-06-15T10:00:00.000Z)
    if (typeof dateInput === 'string' && dateInput.includes('T')) {
      const date = new Date(dateInput);
      if (!isNaN(date.getTime())) return date.toLocaleDateString('fr-FR');
    }
    
    // Si c'est une chaîne de date simple (2023-06-15)
    if (typeof dateInput === 'string' && dateInput.includes('-')) {
      const parts = dateInput.split('-');
      if (parts.length === 3) {
        const date = new Date(`${parts[0]}-${parts[1]}-${parts[2]}`);
        if (!isNaN(date.getTime())) return date.toLocaleDateString('fr-FR');
      }
    }
    
    return 'Date inconnue';
  }

  return (
    <ImageBackground 
  source={require('../assets/images/shelf.png')} 
  style={styles.backgroundImage}
  resizeMode="cover"
>
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        <Ionicons name="time" size={24} color="#5D4037" /> Historique des Emprunts
      </Text>

      {logs.length > 0 ? (
        logs.map((log: any) => (
          <View key={log.id} style={styles.historyCard}>
            <View style={styles.cardHeader}>
              <Ionicons 
                name={log.return_date ? "checkmark-circle" : "time"} 
                size={20} 
                color={log.return_date ? "#4CAF50" : "#FFA000"} 
              />
              <Text style={styles.bookTitle}>{log.title}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="person" size={16} color="#5D4037" />
              <Text style={styles.detailText}>Auteur: {log.author}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="#5D4037" />
              <Text style={styles.detailText}>
                Emprunté le: {formatDate(log.borrow_date)}
              </Text>
            </View>
            
            
            {log.return_date && (
              <View style={styles.detailRow}>
                <Ionicons name="checkmark" size={16} color="#4CAF50" />
                <Text style={styles.detailText}>
                  Retourné le: {new Date(log.return_date).toLocaleDateString()}
                </Text>
              </View>
            )}
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle" size={48} color="#BCAAA4" />
          <Text style={styles.emptyStateText}>Aucun historique d'emprunt</Text>
        </View>
      )}
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
    //backgroundColor: '#FFF8E1',
    padding: 20,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F5F5DC',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 25,
    color: 'white',
    textAlign: 'center',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  historyCard: {
    backgroundColor: 'rgba(255, 253, 245, 0.9)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#5D4037',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 3,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#D7CCC8',
    paddingBottom: 8,
  },
  bookTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#5D4037',
    marginLeft: 8,
    flex: 1,
  },
  detailRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  detailText: {
    fontSize: 15,
    color: '#6D4C41',
    marginLeft: 8,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    color: '#8D6E63',
    marginTop: 16,
    textAlign: 'center',
  },
});

export default Historique;