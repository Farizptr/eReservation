// DokumenPengajuanScreen.js

import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  Alert,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useRole } from "../context/RoleContext.js";
import { downloadFile } from "../utils/ExportPDF.js";
const DokumenPengajuanScreen = () => {
  const [data, setData] = useState([]);
  const { role } = useRole();
  const databaseName = "data_pengajuan";

  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      const ordersData = [];
      const q = query(
        collection(db, databaseName),
        where("modifiedPengajuan.directorapproved", "==", true),
        where("modifiedPengajuan.headProcurementapproved", "==", true)
      );
      const querySnapshot = await getDocs(q);
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
    fetchData();
  }, []);

  const handleDownloadPDF = (orderId, filename) => {
    const fileUrl = `http://10.88.4.219:5000/pdf/pengajuan/${orderId}`;
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

export default DokumenPengajuanScreen;
