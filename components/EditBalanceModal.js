import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import axios from 'axios';
import AlertModal from './AlertModal';
import { getData } from '../utils/Storage';
const EditBalanceModal = ({ visible, onClose}) => {
    const [editInputBalance, setEditInputBalance] = useState('')
    const [alertVisible, setAlertVisible] = useState(false)
    const [alertMessage, setAlertMessage] = useState('')
    const [error, setError] = useState('');
    const [isFocused, setIsFocused] = useState(false);
  
    const [id, setId] = useState(null)

    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getData('userData');
                setId(userData.id) // Assuming getData is defined
    
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        if (visible) {
            fetchUserData();
        }
    }, [visible]);
    const handleEditInputChange = (text) => {
        setEditInputBalance(text);
      };
      const editBalance = async () => {
        if (!editInputBalance || editInputBalance <= 0) {
          setError('Invalid Input');
          return;
        }
        
        try {
          const response = await axios.put(`http://10.211.0.106:3000/api/balance/${id}`, {
            new_balance: editInputBalance,
          });
          setAlertVisible(true)
          setAlertMessage(response.data.message);
          setError('');
          setEditInputBalance('');
          onClose();
        } catch (error) {
          setError(error.response?.data?.error || 'Failed to Update Balance');
        }
      };
   

    return (
        <>
        <Modal
            animationType="fade"
            transparent={true}
            visible={visible}
            onRequestClose={onClose}
        >
            <View style={styles.modalBackground}>
                <View style={styles.modalContainer}>
                    <Text style={styles.modalTitle}>Edit Balance</Text>

                    {/* Input Field for Balance */}
                    <View style={{ width: '100%', position: 'relative' }}>
                        <TextInput
                            style={styles.input}
                            keyboardType="numeric"
                            value={String(editInputBalance)}
                            onChangeText={handleEditInputChange}
                            onFocus={() => setIsFocused(true)} // Set focused state
                            onBlur={() => setIsFocused(false)} // Reset focused state
                            />
                        <Text style={isFocused ? styles.placeHolderFocus : styles.placeHolder1}>
                            Enter New Balance
                        </Text>
                    </View>
                    

                            {error && <Text style={{justifyContent: 'center', marginTop: -15, marginBottom:10, color: 'red'}}>{error}</Text>}
                    <View style={styles.buttonContainer}>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={styles.saveButton} onPress={editBalance}>
                                <Text style={styles.saveButtonText}>Update</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.buttonWrapper}>
                            <TouchableOpacity style={styles.cancelButton} onPress={onClose}>
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </View>
            </View>
        </Modal>
        <AlertModal
          visible={alertVisible}
          onClose={()=>setAlertVisible(false)}
          title="Success"
          message={alertMessage}
          duration={2000}
        />
        </>
    );
};

const styles = StyleSheet.create({
    modalBackground: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    modalContainer: {
        width: 300,
        padding: 20,
        backgroundColor: 'white',
        borderRadius: 10,
        alignItems: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 10,
    },
    input: {
        width: '100%',
        padding: 10,
        borderWidth: 1,
        borderColor: '#ccc',
        borderRadius: 5,
        marginBottom: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%', // Make sure the container uses full width
    },
    buttonWrapper: {
        flex: 1, // Allow buttons to take equal space
        marginHorizontal: 5, // Add margin between buttons
    },
    placeHolder1: {
        color: 'gray',
        position: 'absolute',
        top: 16,
        left: 10,
    },
    placeHolderFocus: {
        color: 'black',
        position: 'absolute',
        top: -13,
        left: 10,
        backgroundColor: 'white',
        padding: 5,
    },
    cancelButton: {
        backgroundColor: 'white',
        borderColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    cancelButtonText: {
        color: 'black',
        fontWeight: 'bold',
    },
    saveButton: {
        backgroundColor: 'black', // Change this to your desired background color
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: 'white', // Change this to your desired text color
        fontWeight: 'bold',
    },
});

export default EditBalanceModal;
