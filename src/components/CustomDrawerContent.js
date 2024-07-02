import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';
import { useNavigation } from '@react-navigation/native';
import { useRole } from '../context/RoleContext';
import useLogout from '../hooks/useLogout';

export default function CustomDrawerContent(props) {
  const {role} = useRole();
  const handleLogout = useLogout();
  const navigation = useNavigation();
  const handleLogin = () => { navigation.navigate("Login") };
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
      <DrawerItemList {...props} />
      <View style={styles.footer}>
        {role ? (<TouchableOpacity onPress={handleLogout} style={styles.LogoutButton}>
          <Text style={styles.settingsText}>Logout</Text>
        </TouchableOpacity>) : (<TouchableOpacity onPress={handleLogin} style={styles.LoginButton}>
          <Text style={styles.settingsText}>Login</Text>
        </TouchableOpacity>)}
        
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
  LogoutButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'red',
    borderRadius: 5,
  },
  LoginButton: {
    paddingVertical: 10,
    paddingHorizontal: 20,
    backgroundColor: 'blue',
    borderRadius: 5,
  },
  Text: {
    color: '#fff',
    fontSize: 16,
  },
});

