import React from 'react';
import { Tabs } from 'expo-router';
import { EmployeeProvider } from '../context/EmployeeContext';

export default function RootLayout() {
  return (
    <EmployeeProvider>
      <Tabs
        screenOptions={{
          headerStyle: {
            backgroundColor: '#1D4ED8'
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold'
          },
          tabBarActiveTintColor: '#1D4ED8',
          tabBarInactiveTintColor: '#64748B',
          tabBarStyle: {
            height: 60,
            paddingBottom: 5
          }
        }}
      >

        <Tabs.Screen
          name="index"
          options={{
            title: 'Dashboard',
            tabBarLabel: 'Dashboard'
          }}
        />

        <Tabs.Screen
          name="employees"
          options={{
            title: 'Employees',
            tabBarLabel: 'Employees'
          }}
        />

        <Tabs.Screen
          name="add-employee"
          options={{
            title: 'Add Employee',
            tabBarLabel: 'Add'
          }}
        />

        <Tabs.Screen
          name="settings"
          options={{
            title: 'Settings',
            tabBarLabel: 'Settings'
          }}
        />

<Tabs.Screen
  name="features"
  options={{
    title: 'Features',
    tabBarLabel: 'Features'
  }}
/>

      </Tabs>
    </EmployeeProvider>
  );
}