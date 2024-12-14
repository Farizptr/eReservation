import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Image } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRole } from '../context/RoleContext';
import useLogout from '../hooks/useLogout';

export default function CustomDrawerContent(props) {
  const { role } = useRole();
  const handleLogout = useLogout();
  const navigation = useNavigation();
  const handleLogin = () => { navigation.navigate("Login") };
  const handleNavigateToHome = () => {
    navigation.navigate('Home');
  };

  const handleNavigateToAdmin = () => {
    navigation.navigate('Admin');
  };
  return (
    <DrawerContentScrollView {...props}>
      <View style={styles.header}>
        {role ? (
          <Text style={styles.headerText}>Welcome, {role}</Text>
        ) : (
          <Text style={styles.headerText}>Welcome Guest</Text>
        )}
      </View>
      
      <View style={styles.divider} />
      {/* <DrawerItemList {...props} /> */}
      <View style={styles.navigationButtons}>
        <TouchableOpacity onPress={handleNavigateToHome} style={styles.navigationButton}>
          <Text style={styles.navigationButtonText}>Back to Home Screen</Text>
        </TouchableOpacity>
        <TouchableOpacity onPress={handleNavigateToAdmin} style={styles.navigationButton}>
          <Text style={styles.navigationButtonText}>Back to Admin Screen</Text>
        </TouchableOpacity>
      </View>
      
      <View style={styles.footer}>
        {role ? (
          <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
            <Text style={styles.settingsText}>Logout</Text>
          </TouchableOpacity>
        ) : (
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.settingsText}>Login</Text>
          </TouchableOpacity>
          
        )}
      </View>
      
    </DrawerContentScrollView>
  );
  
}

const styles = StyleSheet.create({
  header: {
    padding: 20,
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
  headerText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#333',
  },
  navigationButtons: {
    padding: 10,
  },
  navigationButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: '#e0e0e0',
    borderRadius: 5,
    marginBottom: 10,
  },
  navigationButtonText: {
    fontSize: 16,
  },
  divider: {
    height: 1,
    backgroundColor: '#ddd',
    marginVertical: 10,
  },
  footer: {
    padding: 20,
    borderTopWidth: 1,
    borderTopColor: '#ddd',
    backgroundColor: '#f4f4f4',
    alignItems: 'center',
  },
  logoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  loginButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  settingsText: {
    color: '#fff',
    fontSize: 16,
  },
  imageContainer: {
    position: 'absolute',
    bottom: -10,
    right: -80,
    width: 393,
    height: 51,
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'contain',
  },
});
