import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ActivityIndicator, ScrollView, ImageBackground } from 'react-native';
import { useAuth } from '../../context/AuthContext';
import api from '../../utils/api';
import { Ionicons } from '@expo/vector-icons';



interface AdminLog {
  id: number;
  actionType: string;
  details: string;
  createdAt: string;
  User: {
    name: string;
    email: string;
  };
  Book?: {
    title: string;
  };
}

const AdminLogsScreen = () => {
  const [logs, setLogs] = useState<AdminLog[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    if (user?.role === 'admin') {
      fetchLogs();
    }
  }, [user]);

  const fetchLogs = async () => {
    try {
      const response = await api.get('/api/admin/logs');
      setLogs(response.data?.logs || []);
    } catch (error) {
      console.error('Erreur:', error);
    } finally {
      setLoading(false);
    }
  };

  const formatActionType = (action: string) => {
    const actions: Record<string, string> = {
      'BOOK_CREATE': 'Création livre',
      'BOOK_UPDATE': 'Mise à jour livre',
      'BOOK_DELETE': 'Suppression livre',
      'USER_MODIFICATION': 'Modification utilisateur',
      'SYSTEM_ACTION': 'Action système'
    };
    return actions[action] || action;
  };

  const getActionIcon = (actionType: string) => {
    switch(actionType) {
      case 'BOOK_CREATE': return 'add-circle';
      case 'BOOK_UPDATE': return 'create';
      case 'BOOK_DELETE': return 'trash';
      default: return 'alert-circle';
    }
  };

  const getActionColor = (actionType: string) => {
    switch(actionType) {
      case 'BOOK_CREATE': return '#4CAF50';
      case 'BOOK_UPDATE': return '#2196F3';
      case 'BOOK_DELETE': return '#F44336';
      default: return '#FFA000';
    }
  };

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#8D6E63" />
      </View>
    );
  }

  return (
    <ImageBackground 
    source={require('../../assets/images/shelf.png')} 
    style={styles.backgroundImage}
    resizeMode="cover"
  >
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.title}>
        <Ionicons name="list" size={24} color="#5D4037" /> Journal des Activités
      </Text>

      {logs.length > 0 ? (
        logs.map((log) => (
          <View key={log.id} style={styles.logCard}>
            <View style={styles.cardHeader}>
              <Ionicons 
                name={getActionIcon(log.actionType)} 
                size={20} 
                color={getActionColor(log.actionType)} 
              />
              <Text style={styles.actionTitle}>{formatActionType(log.actionType)}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="person" size={16} color="#5D4037" />
              <Text style={styles.detailText}>Admin: {log.User.name} ({log.User.email})</Text>
            </View>
            
            {log.Book && (
              <View style={styles.detailRow}>
                <Ionicons name="book" size={16} color="#5D4037" />
                <Text style={styles.detailText}>Livre: {log.Book.title}</Text>
              </View>
            )}
            
            <View style={styles.detailRow}>
              <Ionicons name="information-circle" size={16} color="#5D4037" />
              <Text style={styles.detailText}>{log.details}</Text>
            </View>
            
            <View style={styles.detailRow}>
              <Ionicons name="calendar" size={16} color="#5D4037" />
              <Text style={styles.detailText}>
                {new Date(log.createdAt).toLocaleString('fr-FR')}
              </Text>
            </View>
          </View>
        ))
      ) : (
        <View style={styles.emptyState}>
          <Ionicons name="alert-circle" size={48} color="#BCAAA4" />
          <Text style={styles.emptyStateText}>Aucune activité récente</Text>
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
  logCard: {
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
  actionTitle: {
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

export default AdminLogsScreen;