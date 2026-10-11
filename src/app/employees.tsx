import React from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet
} from 'react-native';

import { useEmployees } from '../context/EmployeeContext';

export default function Employees() {

  const { employees } = useEmployees();

  return (
    <View style={styles.container}>

      <Text style={styles.title}>
        Employee List
      </Text>

      <Text style={styles.count}>
        Total Employees: {employees.length}
      </Text>

      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (

          <View style={styles.employeeCard}>

            <View style={styles.circle}>
              <Text style={styles.circleText}>
                {item.name.charAt(0)}
              </Text>
            </View>

            <View style={styles.details}>

              <Text style={styles.name}>
                {item.name}
              </Text>

              <Text style={styles.department}>
                Department: {item.department}
              </Text>

            </View>

          </View>

        )}
      />

    </View>
  );
}

const styles = StyleSheet.create({

  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#F1F5F9'
  },

  title: {
    fontSize: 27,
    fontWeight: 'bold',
    color: '#1D4ED8'
  },

  count: {
    fontSize: 16,
    color: '#64748B',
    marginTop: 5,
    marginBottom: 20
  },

  employeeCard: {
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 12,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center'
  },

  circle: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#DBEAFE',
    justifyContent: 'center',
    alignItems: 'center'
  },

  circleText: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#1D4ED8'
  },

  details: {
    marginLeft: 15
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  department: {
    marginTop: 5,
    color: '#64748B'
  }

});