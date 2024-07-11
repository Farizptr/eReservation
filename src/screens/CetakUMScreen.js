import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useRole } from "../context/RoleContext.js";
import { downloadFile } from "../utils/ExportPDF.js";
import { useNavigation } from "@react-navigation/native";
import fetchData from "../utils/fetchData.js";

const CetakUMScreen = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  const { role } = useRole();
  const databaseName = "data_pengajuan";
  const [loading, setLoading] = useState(false);
  const allowedRoles = ["Finance"];

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, databaseName),
        where("director_status", "==", "Approved"),
        where("procurement_status", "==", "Approved")
      );
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setData(ordersData);
    } catch (error) {
      console.error("Error fetching orders:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    const unsubscribe = navigation.addListener("focus", () => {
      if (!allowedRoles.includes(role)) {
        Alert.alert(
          "Access Denied",
          "You are not authorized to access this page",
          [{ text: "OK", onPress: () => navigation.navigate("Admin") }]
        );
      } else {
        fetchOrders();
      }
    });

    return unsubscribe;
  }, [navigation, role, allowedRoles, fetchOrders]);

  if (!allowedRoles.includes(role)) {
    return null;
  }

  const handleDownloadPDF = (orderId, filename) => {
    const fileUrl = `http://172.20.10.4:5000/pdf/pemesanan/${orderId}`;
    downloadFile(fileUrl, filename);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Approved Orders</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length > 0 ? (
        data.map((order) => (
          <View key={order.id} style={styles.orderContainer}>
            <Text style={styles.orderId}>Order ID: {order.id}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Nama Barang</Text>
                <Text style={styles.tableHeader}>Quantity</Text>
                <Text style={styles.tableHeader}>Satuan</Text>
                <Text style={styles.tableHeader}>Keterangan</Text>
              </View>
              {Object.values(order).map((item, index) =>
                item.nama_barang &&
                item.quantity &&
                item.satuan &&
                item.keterangan ? (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.nama_barang}</Text>
                    <Text style={styles.tableCell}>{item.quantity}</Text>
                    <Text style={styles.tableCell}>{item.satuan}</Text>
                    <Text style={styles.tableCell}>{item.keterangan}</Text>
                  </View>
                ) : null
              )}
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Date</Text>
                <Text style={styles.tableCell} colSpan={3}>
                  {order.date}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Division</Text>
                <Text style={styles.tableCell} colSpan={3}>
                  {order.division}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Status</Text>
                <Text style={styles.tableCell} colSpan={3}>
                  {order.status}
                </Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() =>
                  handleDownloadPDF(order.id, `Order_${order.id}.pdf`)
                }
              >
                <Image
                  source={require("../assets/images/download.png")} // Ganti dengan URL ikon yang sesuai
                  style={styles.icon}
                />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text>No approved orders available.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  header: {
    fontSize: 28,
    fontWeight: "bold",
    marginBottom: 20,
  },
  orderId: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#38B6FF",
    marginBottom: 15,
  },
  table: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    overflow: "hidden",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
  },
  tableHeader: {
    flex: 1,
    padding: 10,
    fontWeight: "bold",
    backgroundColor: "#f0f0f0",
    textAlign: "center",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "right",
    backgroundColor: "#38B6FF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 50,
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  downloadText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default CetakUMScreen;
