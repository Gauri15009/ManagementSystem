import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet
} from 'react-native';

export default function AddEmployeeScreen({ addEmployee }) {

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  const handleAddEmployee = () => {

    if (name === '' || department === '') {

      Alert.alert(
        'Error',
        'Please enter all details'
      );

      return;
    }

    addEmployee(name, department);

    Alert.alert(
      'Success',
      'Employee added successfully'
    );

    setName('');
    setDepartment('');
  };

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Add Employee
      </Text>

      <Text style={styles.label}>
        Employee Name
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter employee name"
        value={name}
        onChangeText={setName}
      />

      <Text style={styles.label}>
        Department
      </Text>

      <TextInput
        style={styles.input}
        placeholder="Enter department"
        value={department}
        onChangeText={setDepartment}
      />

      <Button
        title="Add Employee"
        onPress={handleAddEmployee}
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
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 30
  },

  label: {
    fontSize: 16,
    marginBottom: 7,
    fontWeight: 'bold'
  },

  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 12,
    marginBottom: 20
  }

});