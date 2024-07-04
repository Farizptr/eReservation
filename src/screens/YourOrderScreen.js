// YourOrderScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useRole } from "../context/RoleContext.js";
import { useIsFocused } from "@react-navigation/native";
import fetchData from "../utils/fetchData.js";
const YourOrderScreen = () => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const { role } = useRole();
  const databaseName = "data_pemesanan";
  const [loading, setLoading] = useState(false);

  // Function to fetch data from Firestore
  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const ordersData = await fetchData(databaseName, "division", role);
        setData(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
      }
    };

    if (isFocused) {
      getData();
    }
  }, [isFocused, role]);


  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{role}</Text>
      <Text>User role: {role}</Text>
      <Text>Database: {databaseName}</Text>
      {data.length > 0 ? (
        data.map((order) => (
          <View key={order.id} style={styles.orderContainer}>
            <Text style={styles.subHeader}>Order ID: {order.id}</Text>
            {/* Display the order data */}
            <Text style={styles.data}>{JSON.stringify(order, null, 2)}</Text>
            <View style={styles.buttonContainer}>
    
            </View>
          </View>
        ))
      ) : (
        <Text>No data available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  subHeader: {
    fontSize: 20,
    marginBottom: 10,
  },
  data: {
    fontFamily: "monospace",
    marginBottom: 20,
  },
  buttonContainer: {
    marginVertical: 10,
  },
});

export default YourOrderScreen;
