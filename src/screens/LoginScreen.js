import React, { useState, useEffect } from "react";
import { View, Text, TextInput, StyleSheet, Alert, ImageBackground, Image } from "react-native";
import { TouchableOpacity } from "react-native";
import { Picker } from "@react-native-picker/picker";
import { signInWithEmailAndPassword } from "firebase/auth";
import { collection, getDocs } from "firebase/firestore";
import { auth, db } from "../../firebase"; // Ensure this imports correctly
import { useRole } from "../context/RoleContext";
import { useNavigation } from "@react-navigation/native";

const LoginScreen = () => {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRolee] = useState("");
  const [roles, setRoles] = useState([]);
  const { setRole } = useRole();
  const navigation = useNavigation();

  useEffect(() => {
    const fetchRoles = async () => {
      try {
        const rolesCollection = collection(db, "roles");
        const roleSnapshot = await getDocs(rolesCollection);
        const roleList = roleSnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setRoles(roleList);
      } catch (error) {
        console.error("Error fetching roles: ", error);
      }
    };

    fetchRoles();
  }, []);

  const handleLogin = async () => {
    try {
      // await signInWithEmailAndPassword(auth, username, password);
      // Alert.alert("Login Successful", `Role: ${role}`);
      const userRole = role; // Replace with the actual user role retrieved from Firestore
      setRole(userRole);
      // navigation.navigate("Debug"); // Navigate to the LoginScreen
      switch (role) {
        case "Procurement":
          navigation.navigate("Procurement");
          break;
        case "Head of Procurement":
          navigation.navigate("Procurement");
          break;
        case "Director":
          navigation.navigate("Director");
          break;
        case "Finance":
          navigation.navigate("Keuangan");
          break;
        default:
          navigation.navigate("Order");
          break; // Exit the function if the role is not recognized
      }
      Alert.alert("Login Successful", `You have been logged in as ${role}!`);
    } catch (error) {
      Alert.alert("Login Failed", error.message);
    }
  };

  return (
    <ImageBackground
      source={require('C:/Users/daffa/Downloads/TUGAS KULIAH DAFFA SASKARA/elog/eReservation/src/assets/images/KS.jpg')}
      style={styles.background}
      imageStyle={{ opacity: 0.1 }}
    >
    <Image
          source={require('C:/Users/daffa/Downloads/TUGAS KULIAH DAFFA SASKARA/elog/eReservation/src/assets/images/logo-kit1.png')}
          style={styles.logo}
        />
   
      <View style={styles.overlay}>
        
      <Text style={styles.title1}>E-Procurement</Text>
        <Text style={styles.title}>Please login to access</Text>
        <TextInput
          style={styles.input}
          placeholder="Email"
          value={username}
          onChangeText={setUsername}
        />
        <TextInput
          style={styles.input}
          placeholder="Password"
          secureTextEntry
          value={password}
          onChangeText={setPassword}
        />
        <Picker
          selectedValue={role}
          onValueChange={(itemValue) => setRolee(itemValue)}
          style={styles.picker}
        >
          <Picker.Item label="Select Role" value="" />
          {roles.map((role) => (
            <Picker.Item key={role.id} label={role.name} value={role.name} />
          ))}
        </Picker>
        <TouchableOpacity onPress={handleLogin} style={styles.loginButton}>
          <Text style={styles.loginButtonText}>Sign In</Text>
        </TouchableOpacity>
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
    width: '90%',  // Slightly narrower than the full width for padding
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.8)", // Semi-transparent white background
    padding: 10,
    borderRadius: 10,
    marginBottom: 100
  },
  logo: {
    width: 300,
    height:116,
    padding:-30,
    resizeMode: "contain",
    marginBottom: 10, // Adds space between the image and the title
  },
  logo2: {
    width: 160,
    height:96,
    padding:2,
    marginLeft: 25,
    resizeMode: "contain",
    marginBottom: 30, // Adds space between the image and the title
  },
  title: {
    fontSize: 14,
    // fontWeight: "bold",
    marginBottom: 4,
    color: "#333",
    marginTop: 30,
  },
  title1: {
    fontSize: 30,
    fontWeight: "bold",
    // fontStyle: "italic",
    marginBottom: 0,
    color: "#38B6FF",
    marginTop: 25,
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
  picker: {
    width: "80%",
    marginVertical: 10,
    backgroundColor: "#fff",
    borderRadius: 10,
  },
  loginButton: {
    backgroundColor: "#007bff", // Bootstrap primary button color
    padding: 10,
    borderRadius: 5,
    width: "80%",
    alignItems: "center",
    marginVertical: 10, // Adds space above and below the button
  },
  loginButtonText: {
    color: "#ffffff",
    fontSize: 16,
  },
});

export default LoginScreen;
