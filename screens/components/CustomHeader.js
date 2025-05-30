import React from 'react';
import { View, Text, Image, StyleSheet } from 'react-native';

const CustomHeader = () => (
  <View style={styles.navbar}>
    <View style={styles.navbarContent}>
      <View style={styles.leftSection}>
        <Image
          source={require('../../assets/images/logo_Ready2Cook.png')} 
          style={styles.logo}
          resizeMode="contain"
        />
        <Text style={styles.navbarTitle}>Ready2Cook</Text>
      </View>
    </View>
  </View>
);

const styles = StyleSheet.create({
  navbar: {
    width: '100%',
    height: 120,
    backgroundColor: '#333',
    justifyContent: 'center',
    alignItems: 'center',
    flexDirection: 'row',
  },
  navbarContent: {
    marginTop: 30,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: '100%',
    paddingHorizontal: 10,
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  navbarTitle: {
    color: 'white',
    fontSize: 25,
    paddingLeft: 5,
  },
  logo: {
    width: 100,
    height: 100,
  },
});

export default CustomHeader;
