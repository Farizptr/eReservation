import React, {useEffect} from "react";
import {
  View,
  Text,
  Button,
  ImageBackground,
  StyleSheet,
  Image,
  TouchableOpacity,
  Alert,
} from "react-native";
import { useNavigation } from "@react-navigation/native";
import { useRole } from "../context/RoleContext";
import { ScrollView } from "react-native-gesture-handler";



const HomeScreen = () => {
  const navigation = useNavigation();
  const { role } = useRole();

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (role === null) {
        Alert.alert(
          "Access Denied",
          "You are not authorized to access this page",
          [{ text: "OK", onPress: () => navigation.navigate("Login") }]
        );
      }
    });
  
    return unsubscribe;
  }, [navigation, role]);
  
  if (role === null) {
    return null;
  }

  return (
    <View style={styles.screen}>
      <ImageBackground
        source={require("../assets/images/backgroundfix.png")}
        style={styles.backgroundImage}
        imageStyle={{ opacity: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContainer}>
          <View style={styles.container}>
          <Image
                  source={require("../assets/images/seldat.png")}
                  style={styles.selamat}
                />
            <Text style={styles.welcomeText}>{role}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.button}
                onPress={() => navigation.navigate("Order")}
              >
                <Image
                  source={require("../assets/images/orderlogofixfixfix.png")}
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.button1}
                onPress={() => navigation.navigate("Admin")}
              >
                <Image
                  source={require("../assets/images/adminlogofixfix.png")}
                  style={styles.buttonIcon}
                />
              </TouchableOpacity>
            </View>
          </View>
          <View style={styles.footerContainer}>
            <View style={styles.footer}>
              <Text style={styles.footerText}> </Text>
            </View>
            <View style={styles.footer}>
              <Text style={styles.footerText}>Krakatau Information Technology®</Text>
            </View>
          </View>
        </ScrollView>
      </ImageBackground>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  backgroundImage: {
    width: 415,
    height: 800,
    justifyContent: "center",
    alignItems: "left",
  },
  selamat: {
    alignItems: "center",
    width: 320,
    height: 50,
    padding: 15,
    marginLeft: 20,
    marginTop: 70,
    marginVertical: 9,
    resizeMode: "contain",
  },
  welcome: {
    width: "80%",
    height: "80%",
    marginLeft: 20,
    marginBottom: 50,
    resizeMode: "contain",
  },
  welcomeText: {
    fontSize: 20,
    fontWeight: "bold",
    justifyContent: "left",
    color: "#FFFFFF",
    //backgroundColor: "rgba(255, 255, 255, 0.7)",
    paddingVertical: 0,
    marginTop: 2,
    marginLeft: 20,
    paddingHorizontal: 5,
    borderRadius: 10,
  },
  buttonContainer: {
    flex: 0,
    alignItems: "center",
  },
  button: {
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginTop: 40,
   // width: "70%",
  },
  button1: {
    alignItems: "center",
    padding: 15,
    borderRadius: 8,
    marginTop: 20,
    marginBottom: 100,
   // width: "70%",
  },
  buttonIcon: {
    width: 302,
    height: 200,
    marginRight: 10,
  },
  buttonText: {
    color: "#000",
    fontSize: 24,
    fontWeight: "bold",
    marginTop: 10,
  },
  footer: {
    width: 302,
    height: 130,
    marginLeft: 52,
    marginBottom: 12,
  },
  footerText: {
    color: "#d4d4d4",
    fontSize: 14,
    marginTop: 10,
    alignSelf:"center",
    marginBottom: 30,
  },
});

export default HomeScreen;
