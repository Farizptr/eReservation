import React from "react";
import { useEffect, useState } from "react";
import { View, Text, Button, Alert } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRole } from "../context/RoleContext";

const AdminScreen = () => {
  const navigation = useNavigation();
  const { role } = useRole();
  const [hasAccess, setHasAccess] = useState(true);

  const allowedRoles = [
    "Head of Procurement",
    "Head of Finance",
    "Head of SAP",
    "Head of SPI",
    "Head of Sales",
    "Head of Finance",
    "Head of Infrastructure",
    "Head of Digital_Transformation",
    "Head of Business_Development",
  ];

  // Your code here
  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (!allowedRoles.includes(role)) {
        Alert.alert(
          "Access Denied",
          "You are not authorized to access this page",
          [{ text: "OK", onPress: () => navigation.navigate("Home") }]
        );
      }
    });

    return unsubscribe;
  }, [navigation, role, allowedRoles]);

  if (!allowedRoles.includes(role)) {
    // Prevent the component from rendering if role not included
    return null;
  }

  return (
    <View>
      {/* Your JSX here */}
      <Button
        title="Manage Pengajuan Uang Muka"
        onPress={() => navigation.navigate("ManagePengajuan")}
      />
      <Button
        title="Approval"
        onPress={() => navigation.navigate("Approval")}
      />
      <Button
        title="Download Order"
        onPress={() => navigation.navigate("ManageOrder")}
      />
      <Button
        title="Pengajuan Uang Muka"
        onPress={() => navigation.navigate("Pengajuan")}
      />
    </View>
  );
};

export default AdminScreen;
