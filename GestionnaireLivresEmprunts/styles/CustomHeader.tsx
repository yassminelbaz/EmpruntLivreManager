// utils/navigationHeader.tsx
import React from 'react';
import Header from '../screens/navigation/Header';

export const withCustomHeader = ({
  title,
  showSearchIcon = false,
  onSearchPress,
  onLogout
}: {
  title: string,
  showSearchIcon?: boolean,
  onSearchPress?: () => void,
  onLogout?: () => void
}) => ({
  header: () => (
    <Header 
      title={title} 
      showSearchIcon={showSearchIcon} 
      onSearchPress={onSearchPress} 
      onLogout={onLogout} 
    />
  )
});
