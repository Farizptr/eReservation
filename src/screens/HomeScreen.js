import React from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRole } from "../context/RoleContext";
import { ScrollView } from "react-native-gesture-handler";

const HomeScreen = () => {
  const navigation = useNavigation();
  const { role } = useRole();

  return (
    <ScrollView>
      <View style={styles.container}>
        <ImageBackground
          source={require("../assets/images/KSlenskep.png")}
          style={styles.backgroundImage}
          imageStyle={{ opacity: 0.9 }}
        >
          <Image
            source={require("../assets/images/welcom.png")}
            style={styles.welcome}
          />
          <Text style={styles.welcomeText}>{role}</Text>
        </ImageBackground>
        <View style={styles.buttonContainer}>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Order")}
          >
            <Image
              source={require("../assets/images/orderlogofix.png")}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Orders</Text>
          </TouchableOpacity>
          <TouchableOpacity
            style={styles.button}
            onPress={() => navigation.navigate("Admin")}
          >
            <Image
              source={require("../assets/images/adminlogofix.png")}
              style={styles.buttonIcon}
            />
            <Text style={styles.buttonText}>Admin</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  backgroundImage: {
    width: "100%",
    height: 200,
    justifyContent: "center",
    alignItems: "left",
  },
  welcome: {
    width: "80%",
    height: "80%",
    marginLeft: 20,
    marginBottom: 80,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 30,
    fontWeight: "bold",
    justifyContent: "left",
    color: "#FFFFFF",
    //backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingVertical: 0,
    marginTop: -140,
    marginLeft: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 0,
    justifyContent: "center",
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    backgroundColor: "rgba(255, 255, 255, 0.7)",
    padding: 15,
    borderRadius: 8,
    marginVertical: 30,
    width: "70%",
  },
  buttonIcon: {
    width: 160,
    height: 160,
    marginRight: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
});

export default HomeScreen;
