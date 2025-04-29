import React from 'react';
import { useNavigation } from '@react-navigation/native';
import { useAuth } from '../context/AuthContext';
import { useEffect } from 'react';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../types/navigation';
import AdminLogsScreen from '../screens/Admin/Logs';
import Historique from '../screens/Historique';


;

const HistoryRedirector = () => {
  const { user } = useAuth();

  if (user?.role === 'admin') {
    return <AdminLogsScreen />;
  }
  return <Historique />;
};
 export default HistoryRedirector;
