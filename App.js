import React from 'react';
import { StyleSheet, Text, View } from 'react-native';
import BottomTab from './navigation/bottomTab'

export default function App() {
  return (
    <BottomTab />
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});
