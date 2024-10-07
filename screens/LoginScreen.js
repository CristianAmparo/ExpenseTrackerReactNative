// Import necessary libraries
import React, { useEffect, useState } from 'react';
import { View, TextInput, Text, StyleSheet, TouchableOpacity, Alert } from 'react-native';
import axios from 'axios';
import { getData, storeData } from '../utils/Storage';

const LoginScreen = ({ navigation }) => {
  const [form, setForm] = useState({ username: '', password: '' });
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');

  const apiHost = 'http://10.211.0.106:3000/'; 

  useEffect(() => {
    // Optional: Check if user data already exists in storage on component mount
    const checkUserData = async () => {
      const userData = await getData('userData');
      if (userData) {
        // Navigate to the Main screen if user data exists
        navigation.navigate('Main');
      }
    };
    checkUserData();
  }, [navigation]);

  const handleSubmit = async () => {
    if (!form.username || !form.password) {
      setErrorMessage('Please type username and password');
      return; // Exit early if the form is not valid
    }

    try {
      // Perform login request
      const response = await axios.post(`${apiHost}api/users/login`, form);
      const { id, name, username, image } = response.data.user;
      const token = response.data.token;

      const userData = { id, name, username, image, token };
      // Store user data in AsyncStorage if needed
      setSuccessMessage('Login Successfully');
      setErrorMessage('');
      await storeData('userData', userData);


     
    } catch (error) {
      // Use optional chaining to safely access the error message
      const errorText = error?.response?.data?.error || 'An error occurred';

      setErrorMessage(errorText);
      setSuccessMessage('');

      // Show error alert
      Alert.alert('Error!', errorText, [{ text: 'OK' }]);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Expense Tracker</Text>
      <TextInput
        style={styles.input}
        placeholder="Enter your email"
        value={form.username}
        onChangeText={(text) => setForm({ ...form, username: text })}
      />
      <TextInput
        style={styles.input}
        placeholder="Enter your password"
        value={form.password}
        onChangeText={(text) => setForm({ ...form, password: text })}
        secureTextEntry
      />
      <View style={styles.messageContainer}>
        {successMessage ? <Text style={styles.successMessage}>{successMessage}</Text> : null}
        {errorMessage ? <Text style={styles.errorMessage}>{errorMessage}</Text> : null}
      </View>
      <TouchableOpacity style={styles.button} onPress={handleSubmit}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>
      <Text style={styles.registerText}>
        Don’t have an account yet?{' '}
        <TouchableOpacity onPress={() => navigation.navigate('Register')}>
          <Text style={styles.link}>Register!</Text>
        </TouchableOpacity>
      </Text>
    </View>
  );
};

// Styles for the component
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#F7FAFC',
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  input: {
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    paddingHorizontal: 10,
    marginVertical: 10,
    width: '100%',
  },
  messageContainer: {
    width: '100%',
    alignItems: 'center',
  },
  successMessage: {
    color: 'green',
    marginVertical: 5,
  },
  errorMessage: {
    color: 'red',
    marginVertical: 5,
  },
  button: {
    backgroundColor: 'black',
    borderRadius: 5,
    padding: 10,
    width: '100%',
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
  registerText: {
    marginTop: 20,
    textAlign: 'center',
  },
  link: {
    color: 'blue',
    textDecorationLine: 'underline',
  },
});

export default LoginScreen;
