// screens/HomeScreen.js
import React from 'react';
import { View, Text, Button } from 'react-native';

const ExpensesScreen = ({ navigation }) => {
  return (
    <View>
      <Text>Expenses Screem</Text>
      <Button
        title="Go to Details"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

export default ExpensesScreen;
