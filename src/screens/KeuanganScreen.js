import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRole } from "../context/RoleContext";

const KeuanganScreen = () => {
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
        title="Go to Dokumen Pengajuan Uang Muka"
        onPress={() => navigation.navigate("DokumenPengajuan")}
      />
      <Button
        title="Go to Dokumen Pertanggung Jawab Uang Muka"
        onPress={() => navigation.navigate("Pengajuan")}
      />
    </View>
  );
};

export default KeuanganScreen;
