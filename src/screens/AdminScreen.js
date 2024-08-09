import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Alert,
  ImageBackground,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRole } from "../context/RoleContext";

const AdminScreen = () => {
  const navigation = useNavigation();
  const { role } = useRole();
  const allowedRoles = [
    "Director",
    "Head of Procurement",
    "Head of Finance",
    "Head of SAP",
    "Head of SPI",
    "Head of Sales",
    "Head of Infrastructure",
    "Head of Digital_Transformation",
    "Head of Business_Development",
    "Procurement",
    "Finance",
  ];

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
  }, [navigation, role]);

  if (!allowedRoles.includes(role)) {
    return null;
  }

  const buttons = [
    { screen: "Approval", image: require("../assets/images/aprovaladminfixfix.png") },
    { screen: "ManageOrder", image: require("../assets/images/downloadadminfixfix.png") },
    { screen: "Pengajuan", image: require("../assets/images/tombolpengajuan.png") },
    { screen: "ManagePengajuan", image: require("../assets/images/approvalum.png") },
    { screen: "CetakUM", image: require("../assets/images/downloadum.png") },
    { screen: "ListUangMuka", image: require("../assets/images/pj.png") },
    { screen: "ManagePertanggungJawaban", image: require("../assets/images/approvalpj.png") },
    { screen: "CetakTanggungan", image: require("../assets/images/downloadpj.png") },
  ];

  return (
    <ImageBackground
      source={require("../assets/images/backgroundfix.png")}
      style={styles.backgroundImage}
    >
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.text}></Text>
        {buttons.map((button, index) => (
          <TouchableOpacity
            key={index}
            style={styles.button}
            onPress={() => navigation.navigate(button.screen)}
          >
            <ImageBackground
              source={button.image}
              style={styles.buttonBackground}
              imageStyle={styles.buttonImage}
            >
              <Text style={styles.buttonText}>{button.title}</Text>
            </ImageBackground>
          </TouchableOpacity>
        ))}
      </ScrollView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  backgroundImage: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  container: {
    padding: 20,
    alignItems: "center",
  },
  button: {
    marginVertical: 25,
    width: 360,
    height: 98,
  },
  buttonBackground: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  buttonImage: {
    borderRadius: 10,
    resizeMode: "cover",
  },
  text: {
    marginTop: 20,
    paddingBottom: 40,
    fontSize: 24,
    fontWeight: "bold",
    color: "white",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    textAlign: "center",
    paddingVertical: 10,
    paddingHorizontal: 20,
    borderRadius: 5,
  },
});

export default AdminScreen;
