// src/hooks/useAuth.js
import { useState } from "react";
import { signInWithEmailAndPassword } from "firebase/auth";
import { auth } from "../../firebase"; // Ensure this imports correctly
import { useRole } from "../context/RoleContext";
import { Alert } from "react-native";

const useAuth = () => {
  const [loading, setLoading] = useState(false);
  const { setRole } = useRole();

  // Function to handle authentication errors
  const handleAuthError = (error) => {
    switch (error.code) {
      case "auth/invalid-email":
        Alert.alert("Login Failed", "Invalid email address.");
        break;
      case "auth/user-disabled":
        Alert.alert("Login Failed", "User account is disabled.");
        break;
      case "auth/user-not-found":
        Alert.alert("Login Failed", "User not found.");
        break;
      case "auth/wrong-password":
        Alert.alert("Login Failed", "Incorrect password.");
        break;
      default:
        Alert.alert("Login Failed", error.message);
        break;
    }
  };

  // Function to handle user login
  const login = async (username, password) => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(
        auth,
        username,
        password
      );
      const user = userCredential.user;

      // Fetch custom claims
      const idTokenResult = await user.getIdTokenResult();
      const userRole = idTokenResult.claims.role;

      if (userRole) {
        setRole(userRole);
        return userRole;
      } else {
        throw new Error("User role not found");
      }
    } catch (error) {
      handleAuthError(error);
      throw error; // Rethrow the error to allow calling function to handle it
    } finally {
      setLoading(false);
    }
  };

  return { login, loading };
};

export default useAuth;
