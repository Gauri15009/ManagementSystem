import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';

import DashboardScreen from './screens/DashboardScreen';
import EmployeesScreen from './screens/EmployeesScreen';
import AddEmployeeScreen from './screens/AddEmployeeScreen';
import SettingsScreen from './screens/SettingsScreen';

const Tab = createBottomTabNavigator();

export default function App() {

  const [employees, setEmployees] = useState([
    {
      id: '1',
      name: 'Rahul Sharma',
      department: 'IT'
    },
    {
      id: '2',
      name: 'Priya Patil',
      department: 'HR'
    }
  ]);

  const addEmployee = (name, department) => {

    const newEmployee = {
      id: Date.now().toString(),
      name: name,
      department: department
    };

    setEmployees([...employees, newEmployee]);
  };

  return (
    <NavigationContainer>

      <Tab.Navigator>

        <Tab.Screen name="Dashboard">
          {() => (
            <DashboardScreen
              employees={employees}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Employees">
          {() => (
            <EmployeesScreen
              employees={employees}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Add Employee">
          {() => (
            <AddEmployeeScreen
              addEmployee={addEmployee}
            />
          )}
        </Tab.Screen>

        <Tab.Screen name="Settings">
          {() => (
            <SettingsScreen />
          )}
        </Tab.Screen>

      </Tab.Navigator>

    </NavigationContainer>
  );
}