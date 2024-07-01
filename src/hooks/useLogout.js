import { Alert } from "react-native";
import { signOut } from "firebase/auth";
import { auth } from "../../firebase"; // Ensure this imports correctly
import { useRole } from "../context/RoleContext";
import { useNavigation } from "@react-navigation/native";

const useLogout = () => {
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

  return handleLogout;
};

export default useLogout;
