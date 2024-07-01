import React, { useEffect } from "react";
import { Alert } from "react-native";
import { useRole } from "../context/RoleContext"; // Adjust the import path according to your project structure
import { useNavigation } from "@react-navigation/native";

const withRoleCheck = (WrappedComponent, requiredRoles) => {
  return (props) => {
    const { role } = useRole();
    const navigation = useNavigation();

    useEffect(() => {
      const unsubscribe = navigation.addListener("focus", () => {
        if (!requiredRoles.includes(role)) {
          Alert.alert(
            "Access Denied",
            "You are not authorized to access this page",
            [{ text: "OK", onPress: () => navigation.navigate("Order") }]
          );
        }
      });

      return unsubscribe;
    }, [navigation, role, requiredRoles]);

    if (!requiredRoles.includes(role)) { // Prevent the component from rendering if role not included
      return null;
    }

    return <WrappedComponent {...props} />;
  };
};

export default withRoleCheck;
