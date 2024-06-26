// manageorderscreen.js

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
import { downloadFile } from "../utils/ExportPDF.js";
import { useIsFocused } from "@react-navigation/native";
const ManageOrderScreen = () => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const { role } = useRole();
  const databaseName = "data_pemesanan";

  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      const ordersData = [];
      const querySnapshot = await getDocs(collection(db, databaseName));
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });
      setData(ordersData);
      console.log("Data fetched:", ordersData);
    } catch (error) {
      console.error("Error fetching data:", error);
    }
  };

  // Fetch data when the component mounts
  useEffect(() => {
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const handleDownloadPDF = (orderId, filename) => {
    const fileUrl = `http://172.20.10.4:5000/pdf/pemesanan/${orderId}`;
    downloadFile(fileUrl, filename);
  };

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
              <Button
                onPress={() =>
                  handleDownloadPDF(order.id, `Order_${order.id}.pdf`)
                }
                title={order.logisticapproved ? "Approved" : "Download"}
                disabled={order.logisticapproved}
              />
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

export default ManageOrderScreen;
