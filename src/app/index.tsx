import React from 'react';

import {
  View,
  Text,
  StyleSheet,
  ScrollView
} from 'react-native';

import { useEmployees } from '../context/EmployeeContext';

export default function Dashboard() {

  const { employees } = useEmployees();

  return (
    <ScrollView
      contentContainerStyle={styles.container}
    >

      <Text style={styles.title}>
        Management System
      </Text>

      <Text style={styles.subtitle}>
        Welcome to your employee dashboard
      </Text>

      <View style={styles.row}>

        <View style={styles.card}>
          <Text style={styles.number}>
            {employees.length}
          </Text>

          <Text style={styles.cardText}>
            Employees
          </Text>
        </View>

        <View style={styles.card}>
          <Text style={styles.number}>
            4
          </Text>

          <Text style={styles.cardText}>
            Departments
          </Text>
        </View>

      </View>

      <View style={styles.infoCard}>

        <Text style={styles.heading}>
          System Features
        </Text>

        <Text style={styles.feature}>
          • Employee Management
        </Text>

        <Text style={styles.feature}>
          • Employee Registration
        </Text>

        <Text style={styles.feature}>
          • Employee List
        </Text>

        <Text style={styles.feature}>
          • Responsive Layout
        </Text>

        <Text style={styles.feature}>
          • State Management
        </Text>

      </View>

    </ScrollView>
  );
}

const styles = StyleSheet.create({

  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: '#F1F5F9'
  },

  title: {
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 8
  },

  subtitle: {
    fontSize: 16,
    color: '#475569',
    marginBottom: 25
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between'
  },

  card: {
    width: '48%',
    backgroundColor: 'white',
    padding: 25,
    borderRadius: 12,
    alignItems: 'center'
  },

  number: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#1D4ED8'
  },

  cardText: {
    fontSize: 16,
    marginTop: 8
  },

  infoCard: {
    backgroundColor: 'white',
    marginTop: 25,
    padding: 20,
    borderRadius: 12
  },

  heading: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 15
  },

  feature: {
    fontSize: 16,
    marginBottom: 10,
    color: '#475569'
  }

});