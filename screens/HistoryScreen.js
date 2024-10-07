import React from 'react';
import { View, Text, Button } from 'react-native';

const HistoryScreen = ({ navigation }) => { // Destructure navigation prop
  return (
    <View>
      <Text>History</Text>
      <Button
        title="Go to Home"
        onPress={() => navigation.navigate('Home')}
      />
    </View>
  );
};

export default HistoryScreen;
