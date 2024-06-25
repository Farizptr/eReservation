import React from "react";
import { useNavigation, useRoute } from "@react-navigation/native";
import { View, Text, Button, StyleSheet } from "react-native";

const DebugScreen = () => {
  const navigation = useNavigation();
  const route = useRoute();
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Home Screen</Text>
      <View style={styles.buttonContainer}>
        <Button
          title="Go to Login"
          onPress={() => navigation.navigate("Login")}
        />
        <Button
          title="Go to Order"
          onPress={() => navigation.navigate("Order")}
        />
        <Button
          title="Go to Manage order"
          onPress={() => navigation.navigate("ManageOrder")}
        />
        <Button
          title="Go to KLogistik"
          onPress={() => navigation.navigate("KLogistik")}
        />
        <Button
          title="Go to KKeuangan"
          onPress={() => navigation.navigate("KKeuangan")}
        />
        <Button
          title="Go to Pengajuan"
          onPress={() => navigation.navigate("Pengajuan")}
        />
        <Button
          title="Go to Manage Pengajuan"
          onPress={() => navigation.navigate("ManagePengajuan")}
        />
        <Button
          title="Go to Pemesanan"
          onPress={() => navigation.navigate("Pemesanan")}
        />
        <Button
          title="Go to Logout"
          onPress={() => navigation.navigate("Logout")} />
      </View>
    </View>
  );
};
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#1B75BB",
  },
  title: {
    fontSize: 24,
    marginBottom: 16,
  },
  buttonContainer: {
    marginVertical: 10,
    width: "80%",
  },
});

export default DebugScreen;
