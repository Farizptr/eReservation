import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRole } from "../context/RoleContext";

const ProcurementAdminScreen = () => {
  const navigation = useNavigation();
  const { role } = useRole();

  // Your code here

  return (
    <View>
      {/* Your JSX here */}
      <Button
        title="Go to Dokumen Pemesanan"
        onPress={() => navigation.navigate("Pemesanan")}
      />
      <Button
        title="Go to Pengajuan Uang Muka"
        onPress={() => navigation.navigate("Pengajuan")}
      />
      <Button
        title="Go to Pertanggung Jawab Uang Muka"
        onPress={() => navigation.navigate("Pertanggungan")}
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

export default ProcurementAdminScreen;
