import React, { useEffect, useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet, Alert, Text, View, SafeAreaView, StatusBar as StatusBarNative, Platform, Image, TouchableOpacity, FlatList } from 'react-native';
import axios from 'axios';
import AddBalanceModal from '../components/AddBalanceModal';
import EditBalanceModal from '../components/EditBalanceModal';
import ExpenseCard from '../components/ExpenseCard';
import { Ionicons } from '@expo/vector-icons';
import EditExpenseModal from '../components/EditExpenseModal';
import { getData, removeData } from '../utils/Storage';
import AddExpenseModal from '../components/AddExpenseModal';



export default function App() {
  const [balanceData, setBalanceData] = useState();
  const [addModalVisible, setAddModalVisible] = useState(false);
  const [editModalVisible, setEditModalVisible] = useState(false); // State for edit modal
  const [editExpenseModalVisible, setEditExpenseModalVisible] = useState(false); // State for edit modal
  const [addExpenseModalVisible, setAddExpenseModalVisible] = useState(false); // State for edit modal
  const [expenses, setExpenses] = useState([]);
  const [editExpenseItem, setEditExpenseItem] = useState();
  const [loading, setLoading] = useState(true);
  



 
  const fetchBalance = async () => {
    const userData = await getData('userData');
    const id = userData.id
    try {
      const response = await fetch(`http://10.211.0.106:3000/api/balance/${userData.id}`);
      const data = await response.json();
      setBalanceData(data.balance);
      console.log(data.balance)
    } catch (error) {
      alert('Error fetching data:', error);
    }
  };

  const fetchExpenses = async () => {
    const userData = await getData('userData');
    const id = (userData.id)
    console.log(typeof(id))

    try {
        
        setLoading(true); // Start loading
        const response = await axios.get(`http://10.211.0.106:3000/api/expenses/${userData.id}?limit=10`);
        setExpenses(response.data.data); // Update state with fetched data
        console.log(response.data.data); // Update state with fetched data
    } catch (err) {
        alert(err.message || 'An error occurred while fetching expenses');
    } finally {
        setLoading(false); // End loading
    }
};

// useEffect to fetch expenses when component mounts
useEffect(() => {
    fetchBalance();
    fetchExpenses();
},  [addModalVisible, editModalVisible, editExpenseModalVisible, addExpenseModalVisible]);

  const toggleAddBalanceModal = () => {
    setAddModalVisible(!addModalVisible);
  };

  const toggleEditBalanceModal = () => {
    setEditModalVisible(!editModalVisible);
  };

  const toggleAddExpenseModal = () => {
    setAddExpenseModalVisible(!addExpenseModalVisible);
  };

  const toggleEditExpenseModal = (id, expense_title, expense_amount, expense_category) => {
    setEditExpenseModalVisible(!editExpenseModalVisible);
    setEditExpenseItem({id, expense_title, expense_amount, expense_category})
  }

  const handleDeleteExpense = async (id) => {
    try {
        const userData = await getData('userData');
        await axios.delete(`http://10.211.0.106:3000/api/expenses/${id}`);

        setExpenses(expenses.filter(expense => expense.id !== id));
        Alert.alert('Success', 'Expense deleted successfully');
    } catch (error) {
        Alert.alert('Error', 'Failed to delete the expense');
    }
};

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
        <TouchableOpacity style={{ top: 9, left: 50, position: 'absolute' }} onPress={toggleEditBalanceModal}>
          <Ionicons name="create-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
        <TouchableOpacity style={{ top: 10, right: 20, position: 'absolute' }} onPress={logout}>
          <Ionicons name="log-out-outline" size={20} color="#FFFFFF" />
        </TouchableOpacity>
      </View>

      <View style={styles.expensesArea}>
        <View style={{width: '100%', marginBottom: 10, justifyContent: 'space-between', alignItems: 'center', flexDirection: 'row' }}>
          <Text style={{color:'black', marginLeft:10, fontSize: 20, fontWeight: 700}}>Expenses</Text>
          <TouchableOpacity style={styles.addExpenseButton} onPress={toggleAddExpenseModal}>
            <Ionicons name="add" size={20} color="#FFFFFF" onPress={toggleAddExpenseModal}/>
            <Text style={styles.addExpenseText} >Add</Text>
          </TouchableOpacity>
        </View>
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
                            onLongPress={() => handleDeleteExpense(item.id)}
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
      {<AddExpenseModal 
       visible={addExpenseModalVisible} // Use edit modal state
       onClose={toggleAddExpenseModal}
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
  },
  expensesArea: {
    height: '80%',
    padding: 10,
    
    

  },
  addExpenseButton: {

    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: 'black', // Button color
    paddingVertical: 10, // Vertical padding
    paddingRight: 15,
    paddingLeft: 10, // Horizontal padding
    borderRadius: 20, // Rounded corners
    elevation: 3, // Shadow on Android
    shadowColor: '#000', // Shadow color for iOS
    shadowOffset: { width: 0, height: 2 }, // Shadow offset for iOS
    shadowOpacity: 0.2, // Shadow opacity for iOS
    shadowRadius: 2, // Shadow blur radius for iOS
    width: 80,

  },
  addExpenseText: {
    color: '#FFFFFF', // Text color
    marginLeft: 5, // Space between icon and text
    fontWeight: 'bold', // Bold text
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
