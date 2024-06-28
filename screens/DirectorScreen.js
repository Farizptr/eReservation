import React from "react";
import { View, Text, Button } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRole } from "../context/RoleContext";

const DirectorScreen = () => {
  const navigation = useNavigation();
  const { role } = useRole();

  // Your code here

  return (
    <View>
      {/* Your JSX here */}
      <Button
        title="Go to Manage Pengajuan"
        onPress={() => navigation.navigate("ManagePengajuan")}
      />
      <Button
        title="Go to Manage Pertanggung Jawaban Uang Muka"
        onPress={() => navigation.navigate("Pengajuan")}
      />
    </View>
  );
};

export default DirectorScreen;
