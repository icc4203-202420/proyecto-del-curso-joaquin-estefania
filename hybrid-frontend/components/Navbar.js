// /hybridFrontend/components/Navbar.js
import React from 'react';
import { View, Text, Button, StyleSheet } from 'react-native';
import { useRouter } from 'expo-router';

export default function Navbar({ onLogout }) {
  const router = useRouter();

  return (
    <View style={styles.navbar}>
      <Text style={styles.title}>Cervecería</Text>
      <Button
        title="Home"
        onPress={() => router.push('/home')}
        style={styles.button}
      />
      <Button
        title="Logout"
        onPress={onLogout}
        style={styles.button}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  navbar: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 10,
    backgroundColor: '#f8f8f8',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  button: {
    marginHorizontal: 5,
  },
});
