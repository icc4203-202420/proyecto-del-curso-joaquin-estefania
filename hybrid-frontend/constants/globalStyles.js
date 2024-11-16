import { StyleSheet } from 'react-native';

const globalStyles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f5f5', // Fondo claro
    padding: 20,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#4CAF50', // Verde agradable
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: '#555',
    marginBottom: 30,
    textAlign: 'center',
  },
  button: {
    backgroundColor: '#4CAF50', // Verde atractivo
    paddingVertical: 15,
    paddingHorizontal: 25,
    borderRadius: 8,
    marginVertical: 10,
    width: '80%', // Botones más grandes
    alignItems: 'center',
    shadowColor: '#000', // Sombra para mayor efecto
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5, // Sombra en Android
  },
  buttonText: {
    color: '#fff', // Texto blanco
    fontSize: 16,
    fontWeight: '600',
  },
});

export default globalStyles;
