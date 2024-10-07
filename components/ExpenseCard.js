import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { formatDate } from "../utils/DateFormat"; // Make sure to adapt this import as needed
import { TruncatedString } from "../utils/TruncateString"; // Make sure to adapt this import as needed

const ExpenseCard = ({ title, category, amount, date, onPress, onLongPress }) => {
    const formatter = new Intl.NumberFormat("en-US");

    return (
        <TouchableOpacity onPress={onPress} onLongPress={onLongPress} style={styles.card}>
            <View style={styles.content}>
                <View style={styles.textContainer}>
                    <Text style={styles.title}>{TruncatedString(title)}</Text>
                    <Text style={styles.category}>{category}</Text>
                </View>
                <View style={styles.amountContainer}>
                    <Text style={styles.amount}>₱{formatter.format(amount)}.00</Text>
                    <Text style={styles.date}>{formatDate(date)}</Text>
                </View>
            </View>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        height: 75,
        backgroundColor: 'white',
        borderRadius: 12,
        paddingHorizontal: 10,
        paddingVertical: 5,
        flexDirection: 'row',
        justifyContent: 'space-between',
        shadowColor: '#000',
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        borderColor: '#e5e7eb',
        borderWidth: 1,
        marginBottom: 10,
    },
    content: {
        flex: 1,
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    textContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
    },
    title: {
        fontWeight: 'bold',
        fontSize: 16, // Adjust based on your design
    },
    category: {
        fontSize: 12,
        color: 'gray', // Adjust based on your design
    },
    amountContainer: {
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'flex-end',
    },
    amount: {
        fontWeight: 'bold',
        fontSize: 16, // Adjust based on your design
    },
    date: {
        fontSize: 12,
        color: 'gray', // Adjust based on your design
    },
});

export default ExpenseCard;
