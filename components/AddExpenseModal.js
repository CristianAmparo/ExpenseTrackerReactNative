import React, { useEffect, useState } from 'react';
import { Modal, StyleSheet, Text, View, TextInput, TouchableOpacity } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import AlertModal from './AlertModal'; // Assuming this is the same AlertModal used in your EditExpenseModal
import axios from 'axios';
import { getData } from '../utils/Storage';

const AddExpenseModal = ({ visible, onClose }) => {
    const [titleFocus, setTitleFocus] = useState(false);
    const [amountFocus, setAmountFocus] = useState(false);
    const [categoryFocus, setCategoryFocus] = useState(false);
    const [title, setTitle] = useState('');
    const [amount, setAmount] = useState('');
    const [category, setCategory] = useState('');
    const [error, setError] = useState('');
    const [alertVisible, setAlertVisible] = useState(false);
    const [alertMessage, setAlertMessage] = useState('');
    const [userId, setUserId] =  useState(null)

    
    useEffect(() => {
        const fetchUserData = async () => {
            try {
                const userData = await getData('userData');
                setUserId(userData.id) // Assuming getData is defined
    
            } catch (error) {
                console.error("Failed to fetch user data:", error);
            }
        };
        if (visible) {
            fetchUserData();
        }else {
            setTitle('');
            setAmount('');
            setCategory('');
        }
    }, [visible]);

    const handleAdd = async () => {
        if (!title || !amount || !category) {
            setError('Invalid Input, Please fill out all fields');
            return;
        }
        try {
            const response = await axios.post(`http://10.211.0.106:3000/api/expenses`, {
                userId,
                title,
                amount,
                category,
            });
            setAlertVisible(true);
            setAlertMessage(response.data.message);
            console.log(response.data.message);
            onClose(); // Close the modal after 
            
        } catch (error) {
            alert(error.response?.data?.error || "Failed to add expense");
            console.log(error.response.data.error);
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
                        <Text style={styles.modalTitle}>Add Expense</Text>

                        {/* Input Field for Title */}
                        <View style={{ width: '100%', position: 'relative' }}>
                            <TextInput
                                style={styles.input}
                                keyboardType="default"
                                value={title}
                                onChangeText={setTitle}
                                onFocus={() => setTitleFocus(true)}
                                onBlur={() => setTitleFocus(false)}
                            />
                            <Text style={titleFocus || title ? styles.placeHolderFocus : styles.placeHolder1}>
                                Title
                            </Text>
                        </View>

                        {/* Input Field for Amount */}
                        <View style={{ width: '100%', position: 'relative' }}>
                            <TextInput
                                style={styles.input}
                                keyboardType="numeric"
                                value={String(amount)}
                                onChangeText={setAmount}
                                onFocus={() => setAmountFocus(true)}
                                onBlur={() => setAmountFocus(false)}
                            />
                            <Text style={amountFocus || amount ? styles.placeHolderFocus : styles.placeHolder1}>
                                Amount
                            </Text>
                        </View>

                        {/* Picker for Category */}
                        <View style={{ width: '100%', position: 'relative' }}>
                            <View style={styles.input}>
                                <Picker
                                    selectedValue={category}
                                    onValueChange={(itemValue) => setCategory(itemValue)}
                                    onFocus={() => setCategoryFocus(true)}
                                    onBlur={() => setCategoryFocus(false)}
                                    style={styles.picker}
                                >
                                    <Picker.Item label="" value="" />
                                    <Picker.Item label="Food & Dining" value="food-dining" />
                                    <Picker.Item label="Transportation" value="transportation" />
                                    <Picker.Item label="Housing" value="housing" />
                                    <Picker.Item label="Utilities" value="utilities" />
                                    <Picker.Item label="Insurance" value="insurance" />
                                    <Picker.Item label="Healthcare" value="healthcare" />
                                    <Picker.Item label="Entertainment" value="entertainment" />
                                    <Picker.Item label="Personal Care" value="personal-care" />
                                    <Picker.Item label="Education" value="education" />
                                    <Picker.Item label="Clothing" value="clothing" />
                                    <Picker.Item label="Gifts & Donations" value="gifts-donations" />
                                    <Picker.Item label="Travel" value="travel" />
                                    <Picker.Item label="Savings & Investments" value="savings-investments" />
                                    <Picker.Item label="Miscellaneous" value="miscellaneous" />
                                </Picker>
                            </View>
                            <Text style={categoryFocus || category ? styles.placeHolderFocus : styles.placeHolder1}>
                                Category
                            </Text>
                        </View>

                        {error && <Text style={{ justifyContent: 'center', marginTop: -15, marginBottom: 10, color: 'red' }}>{error}</Text>}

                        <View style={styles.buttonContainer}>
                            <View style={styles.buttonWrapper}>
                                <TouchableOpacity style={styles.saveButton} onPress={handleAdd}>
                                    <Text style={styles.saveButtonText}>Add</Text>
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
                onClose={() => setAlertVisible(false)}
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
        alignItems: 'center',
        justifyContent: 'center',
        height: 50,
        color: 'black',
    },
    buttonContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        width: '100%',
    },
    buttonWrapper: {
        flex: 1,
        marginHorizontal: 5,
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
        left: 5,
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
        backgroundColor: 'black',
        borderWidth: 1,
        borderRadius: 5,
        paddingVertical: 10,
        alignItems: 'center',
        justifyContent: 'center',
    },
    saveButtonText: {
        color: 'white',
        fontWeight: 'bold',
    },
    picker: {
        width: '113%',
        justifyContent: 'start',
        alignContent: 'center',
        position: 'absolute',
        left: -5,
        right: 0,
    },
});

export default AddExpenseModal;
