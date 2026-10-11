import React, { useState } from 'react';

import {
  View,
  Text,
  Switch,
  StyleSheet
} from 'react-native';

export default function Settings() {

  const [notifications, setNotifications] = useState(true);
  const [darkMode, setDarkMode] = useState(false);

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Settings
      </Text>

      <View style={styles.settingRow}>

        <Text style={styles.text}>
          Notifications
        </Text>

        <Switch
          value={notifications}
          onValueChange={setNotifications}
        />

      </View>

      <View style={styles.settingRow}>

        <Text style={styles.text}>
          Dark Mode
        </Text>

        <Switch
          value={darkMode}
          onValueChange={setDarkMode}
        />

      </View>

      <View style={styles.info}>

        <Text style={styles.infoTitle}>
          About
        </Text>

        <Text style={styles.infoText}>
          Management System App
        </Text>

        <Text style={styles.infoText}>
          Built using React Native and Expo
        </Text>

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

  settingRow: {
    backgroundColor: 'white',
    padding: 18,
    borderRadius: 10,
    marginBottom: 15,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center'
  },

  text: {
    fontSize: 17
  },

  info: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
    marginTop: 15
  },

  infoTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10
  },

  infoText: {
    fontSize: 15,
    color: '#64748B',
    marginBottom: 5
  }

});