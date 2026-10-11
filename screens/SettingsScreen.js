import React from 'react';

import {
  View,
  Text,
  Switch,
  StyleSheet
} from 'react-native';

export default function SettingsScreen() {

  return (

    <View style={styles.container}>

      <Text style={styles.title}>
        Settings
      </Text>

      <View style={styles.row}>

        <Text style={styles.text}>
          Notifications
        </Text>

        <Switch value={true} />

      </View>

      <View style={styles.row}>

        <Text style={styles.text}>
          Dark Mode
        </Text>

        <Switch value={false} />

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
    fontSize: 27,
    fontWeight: 'bold',
    marginBottom: 30
  },

  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: 'white',
    padding: 18,
    marginBottom: 15,
    borderRadius: 10
  },

  text: {
    fontSize: 17
  }

});