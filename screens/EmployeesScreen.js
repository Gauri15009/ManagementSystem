import React from 'react';

import {
  View,
  Text,
  FlatList,
  StyleSheet
} from 'react-native';

export default function EmployeesScreen({ employees }) {

  const renderEmployee = ({ item }) => (

    <View style={styles.employeeCard}>

      <Text style={styles.name}>
        {item.name}
      </Text>

      <Text style={styles.department}>
        Department: {item.department}
      </Text>

    </View>

  );

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Employee List
      </Text>

      <FlatList
        data={employees}
        keyExtractor={(item) => item.id}
        renderItem={renderEmployee}
      />

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
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20
  },

  employeeCard: {
    backgroundColor: 'white',
    padding: 18,
    marginBottom: 12,
    borderRadius: 10
  },

  name: {
    fontSize: 18,
    fontWeight: 'bold'
  },

  department: {
    fontSize: 15,
    marginTop: 5
  }

});