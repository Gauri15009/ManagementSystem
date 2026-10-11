import React, { useState } from 'react';

import {
  View,
  Text,
  TextInput,
  Button,
  Alert,
  StyleSheet
} from 'react-native';

import { useEmployees } from '../context/EmployeeContext';

export default function AddEmployee() {

  const [name, setName] = useState('');
  const [department, setDepartment] = useState('');

  const { addEmployee } = useEmployees();

  const handleAddEmployee = () => {

    if (!name.trim() || !department.trim()) {

      Alert.alert(
        'Error',
        'Please enter employee name and department'
      );

      return;
    }

    addEmployee(
      name.trim(),
      department.trim()
    );

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

      <View style={styles.button}>
        <Button
          title="Add Employee"
          onPress={handleAddEmployee}
        />
      </View>

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
    fontSize: 28,
    fontWeight: 'bold',
    color: '#1D4ED8',
    marginBottom: 30
  },

  label: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 8
  },

  input: {
    backgroundColor: 'white',
    borderWidth: 1,
    borderColor: '#CBD5E1',
    borderRadius: 8,
    padding: 13,
    marginBottom: 20,
    fontSize: 16
  },

  button: {
    marginTop: 5
  }

});