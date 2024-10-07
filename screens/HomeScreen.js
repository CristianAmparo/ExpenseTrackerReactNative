import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert, Text, View, SafeAreaView, StatusBar as StatusBarNative, Platform, Image, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import AddBalanceModal from '../components/AddBalanceModal';
import EditBalanceModal from '../components/EditBalanceModal';
import ExpenseCard from '../components/ExpenseCard';
import { Ionicons } from '@expo/vector-icons';

import addIcon from '../assets/add.png';
import editIcon from '../assets/edit.png';
import EditExpenseModal from '../components/EditExpenseModal';
import { getData, removeData } from '../utils/Storage';



export default function App() {
  const [balanceData, setBalanceData] = useState();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false); // State for edit modal
  const [editExpenseModalVisible, setEditExpenseModalVisible] = useState(false); // State for edit modal
  const [expenses, setExpenses] = useState([]);
  const [editExpenseItem, setEditExpenseItem] = useState();
  const [loading, setLoading] = useState(true);
  const userData = getData('userData');



 
  const fetchBalance = async () => {
    try {
      const response = await fetch(`http://10.211.0.106:3000/api/balance/${userData.id}`);
      const data = await response.json();
      setBalanceData(data.balance);
    } catch (error) {
      console.error('Error fetching data:', error);
      setError(error.response.data.error)
    }
  };

  const fetchExpenses = async () => {
    try {
        setLoading(true); // Start loading
        const response = await axios.get(`http://10.211.0.106:3000/api/expenses/${userData.id}?limit=10`);
        setExpenses(response.data.data); // Update state with fetched data
    } catch (err) {
        setError(err.message || 'An error occurred while fetching expenses');
    } finally {
        setLoading(false); // End loading
    }
};

// useEffect to fetch expenses when component mounts
useEffect(() => {
    fetchBalance();
    fetchExpenses();
},  [addModalVisible, editModalVisible, editExpenseModalVisible]);

  const toggleAddBalanceModal = () => {
    setAddModalVisible(!addModalVisible);
  };

  const toggleEditBalanceModal = () => {
    setEditModalVisible(!editModalVisible);
  };

  const toggleEditExpenseModal = (id, expense_title, expense_amount, expense_category) => {
    setEditExpenseModalVisible(!editExpenseModalVisible);
    setEditExpenseItem({id, expense_title, expense_amount, expense_category})
  }

  const logout = () => {
    removeData('userData');
  }

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="auto" />
      <View style={styles.balanceContainer}>
        <Text style={[styles.balanceText, { fontSize: 20, fontWeight: 'bold' }]}>Total Balance</Text>
        <Text style={styles.balanceText}>₱{balanceData || 0}</Text>

        {/* Clickable Add Icon */}
        <TouchableOpacity style={{ top: 10, left: 20, position: 'absolute' }} onPress={toggleAddBalanceModal}>
          <Ionicons name="add-circle-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>

        {/* Clickable Edit Icon */}
        <TouchableOpacity style={{ top: 10, left: 50, position: 'absolute' }} onPress={toggleEditBalanceModal}>
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={{ top: 10, right: 20, position: 'absolute' }} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.expensesArea}>
            {expenses.length > 0 ? (
                <FlatList
                    data={expenses}
                    renderItem={({ item }) => (
                        <ExpenseCard
                            title={item.expense_title}
                            category={item.expense_category}
                            amount={item.expense_amount}
                            date={item.expense_date}
                            onPress={() => toggleEditExpenseModal(item.id, item.expense_title, item.expense_amount, item.expense_category)} // Pass the ID to the modal toggle function
                        />
                    )}
                    keyExtractor={(item) => item.id.toString()} // Make sure to convert id to string
                />
            ) : (
                <Text>No expenses available</Text> // Handle the case where there are no expenses
            )}
        </View>

      {/* Include the BalanceModal here */}
      <AddBalanceModal
        visible={addModalVisible}
        onClose={toggleAddBalanceModal}
      />

      {/* Include the EditBalanceModal here */}
      <EditBalanceModal
        visible={editModalVisible} // Use edit modal state
        onClose={toggleEditBalanceModal}
      />
      {<EditExpenseModal 
       visible={editExpenseModalVisible} // Use edit modal state
       onClose={toggleEditExpenseModal}
       item={editExpenseItem}
      />}

    </SafeAreaView>
  
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: 'white',
    padding: 10,
  },
  balanceContainer: {
    height: 100,
    backgroundColor: 'black',
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 10,
  },
  expensesArea: {
    height: '80%',
    padding: 10,
  },
  
  balanceText: {
    color: 'white',
    fontSize: 18,
  },
  addIcon: {
    width: 15,
    height: 15,
    padding: 5,
  },
  editIcon: {
    width: 15,
    height: 15,
    padding: 5,
  },
});
