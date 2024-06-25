import React from "react";
import { View, Text, TouchableOpacity, StyleSheet, Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../firebase"; // Ensure this imports correctly
import { useRole } from "../context/RoleContext";
import { useNavigation } from "@react-navigation/native";

const LogoutScreen = () => {
  const { setRole } = useRole();
  const navigation = useNavigation();

  const handleLogout = async () => {
    try {
      await signOut(auth);
      setRole(null); // Clear the role
      navigation.navigate("Login"); // Navigate to the LoginScreen
      Alert.alert("Logout Successful", "You have been logged out.");
    } catch (error) {
      Alert.alert("Logout Failed", error.message);
    }
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Logout</Text>
      <TouchableOpacity onPress={handleLogout} style={styles.logoutButton}>
        <Text style={styles.logoutButtonText}>Sign Out</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#f5f5f5",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
    color: "#333",
  },
  logoutButton: {
    backgroundColor: '#dc3545', // Bootstrap danger button color
    padding: 10,
    borderRadius: 5,
    width: '80%',
    alignItems: 'center',
    marginVertical: 10, // Adds space above and below the button
  },
  logoutButtonText: {
    color: '#ffffff',
    fontSize: 16,
  },
});

export default LogoutScreen;
