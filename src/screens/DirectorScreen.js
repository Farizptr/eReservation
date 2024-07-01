import React from "react";
import { View, Button, StyleSheet } from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRole } from "../context/RoleContext";

const DirectorScreen = () => {
  const navigation = useNavigation();
  const { role } = useRole();

  const handleManagePengajuanPress = () => {
    navigation.navigate("ManagePengajuan");
  };

  const handleManagePertanggungJawabanPress = () => {
    navigation.navigate("ManagePertanggungJawaban");
  };

  return (
    <View style={styles.container}>
      {role === "Director" && (
        <Button
          title="Go to Manage Pengajuan"
          onPress={handleManagePengajuanPress}
        />
      )}
      <Button
        title="Go to Manage Pertanggung Jawaban Uang Muka"
        onPress={handleManagePertanggungJawabanPress}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
});

export default DirectorScreen;
