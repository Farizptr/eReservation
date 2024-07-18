// src/screens/LoginScreen.js
import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  Alert,
  ImageBackground,
  Image,
  ActivityIndicator,
} from "react-native";
import { TouchableOpacity } from "react-native";
import useAuth from "../hooks/useAuth";
import useRoleNavigation from "../hooks/useRoleNavigation";
import { useNavigation } from "@react-navigation/native";
import { useRole } from "../context/RoleContext.js";


const LoginScreen = () => {
  // Initialize state variables
  const navigation = useNavigation();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [usernameError, setUsernameError] = useState("");
  const [passwordError, setPasswordError] = useState("");
  const { login, loading } = useAuth();
  const { role } = useRole();
  const navigateBasedOnRole = useRoleNavigation();


  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (role !== null) {
        Alert.alert(
          "Already Logged in",
          "Udah login",
          [{ text: "OK", onPress: () => navigation.navigate("Home") }]
        );
      }
    });

    return unsubscribe;
  }, [navigation, role]);

  if (role !== null) {
    // Prevent the component from rendering if role not included
    return null;
  }



  // Function to validate form fields
  const validateForm = () => {
    let valid = true;

    if (!username) {
      setUsernameError("Please fill in the field");
      valid = false;
    } else {
      setUsernameError("");
    }

    if (!password) {
      setPasswordError("Please fill in the field");
      valid = false;
    } else {
      setPasswordError("");
    }

    return valid;
  };

  // Function to handle login
  const handleLogin = async () => {
    if (!validateForm()) return;
    
    try {
      const userRole = await login(username, password);
      navigateBasedOnRole(userRole);
    } catch (error) {
      console.log("Error during login:", error);
    } finally {   
      setUsername("");
      setPassword("");
    }
  };

  return (
    <ImageBackground
      source={require("../assets/images/KS.jpg")}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }}
    >
      <Image
        source={require("../assets/images/logo-kit1.png")}
        style={styles.logo}
      />

      <View style={styles.overlay}>
      <Image
        source={require("../assets/images/ereserv.png")}
        style={styles.title1}
      />
        <Text style={styles.title}>Please login to access</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
        />
        {usernameError ? (
          <Text style={styles.errorText}>{usernameError}</Text>
        ) : null}
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        {passwordError ? (
          <Text style={styles.errorText}>{passwordError}</Text>
        ) : null}
        {loading ? (
          <ActivityIndicator size="large" color="#007bff" />
        ) : (
          <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
            <Text style={styles.loginButtonText}>Sign In</Text>
          </TouchableOpacity>
        )}
      </View>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  background: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  overlay: {
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)",
    padding: 10,
    borderRadius: 10,
    marginBottom: 100,
  },
  logo: {
    width: 300,
    height: 116,
    resizeMode: "contain",
    marginBottom: 40,
  },
  title: {
    fontSize: 14,
    marginBottom: 4,
    color: "#333",
    marginTop: 30,
  },
  title1: {
    width: 290,
    height: 25,
    marginBottom: 0,
    marginTop: 39,
  },
  input: {
    width: "80%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 2,
    borderColor: "#ccc",
    borderRadius: 10,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  errorText: {
    color: "red",
    fontSize: 12,
    marginBottom: 10,
  },
  loginButton: {
    backgroundColor: "#2985DC",
    padding: 15,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginVertical: 25,
    marginTop: 25,
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default LoginScreen;
