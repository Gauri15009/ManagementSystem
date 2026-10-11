import React from 'react';
import {
  View,
  Text,
  StyleSheet
} from 'react-native';

export default function DashboardScreen({ employees }) {

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Management System
      </Text>

      <Text style={styles.subtitle}>
        Welcome to the Dashboard
      </Text>

      <View style={styles.cardContainer}>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>
            {employees.length}
          </Text>

          <Text style={styles.cardTitle}>
            Employees
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.cardNumber}>
            4
          </Text>

          <Text style={styles.cardTitle}>
            Departments
          </Text>
        </View>

      </View>

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5'
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 8
  },

  subtitle: {
    fontSize: 17,
    marginBottom: 25
  },

  cardContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  card: {
    width: '48%',
    padding: 25,
    backgroundColor: 'white',
    borderRadius: 12,
    alignItems: 'center'
  },

  cardNumber: {
    fontSize: 30,
    fontWeight: 'bold'
  },

  cardTitle: {
    fontSize: 16,
    marginTop: 8
  }

});