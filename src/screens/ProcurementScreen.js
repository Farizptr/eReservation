import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRole } from "../context/RoleContext";

const ProcurementScreen = () => {
  const navigation = useNavigation();
  const { role } = useRole();

  // Your code here

  return (
    <View>
      {/* Your JSX here */}
      <Button
        title="Go to Order"
        onPress={() => navigation.navigate("Order")}
      />
      <Button
        title="Go to Admin Screen"
        onPress={() => navigation.navigate("ProcurementAdmin")}
      />
      
      {role === "Head of Procurement" && (
        <Button
          title="Go to Manage Pengajuan"
          onPress={() => navigation.navigate("ManagePengajuan")}
        />
      )}
    </View>
  );
};

export default ProcurementScreen;
