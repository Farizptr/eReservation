import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image,
  Alert,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useRole } from "../context/RoleContext.js";
import { downloadFile } from "../utils/ExportPDF.js";
import { useNavigation } from "@react-navigation/native";

const CetakTanggungan = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);
  const { role } = useRole();
  const databaseName = "data_pertanggungjawaban";
  const [loading, setLoading] = useState(false);
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
  }, [navigation, role]);

  if (!allowedRoles.includes(role)) {
    return null;
  }

  const handleDownloadPDF = (orderId, filename) => {
    const fileUrl = `http://172.20.10.4:5000/pdf/pertanggungjawab/${orderId}`;
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
            <Text style={styles.orderId}>Pesanan ID: {order.id}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Nama Barang</Text>
                <Text style={styles.tableHeader}>Quantity</Text>
                <Text style={styles.tableHeader}>Satuan</Text>
                <Text style={styles.tableHeader}>Harga Akhir</Text>
              </View>
              {order.barang &&
                order.barang.map((item, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{item.uraian}</Text>
                    <Text style={styles.tableCell}>{item.jumlah_barang}</Text>
                    <Text style={styles.tableCell}>{item.satuan_harga}</Text>
                    <Text style={styles.tableCell}>{item.harga_akhir}</Text>
                  </View>
                ))}
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Tambahan</Text>
                <Text style={styles.tableHeader} colSpan={3}>
                  Keterangan
                </Text>
              </View>
              {order.tambahan &&
                order.tambahan.map((extra, index) => (
                  <View key={index} style={styles.tableRow}>
                    <Text style={styles.tableCell}>{extra.description}</Text>
                    <Text style={styles.tableCell}>{extra.jumlah}</Text>
                    <Text style={styles.tableCell}>{extra.harga}</Text>
                    <Text style={styles.tableCell}>-</Text>
                  </View>
                ))}
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Date</Text>
                <Text style={styles.tableCell} colSpan={3}>
                  {order.date}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Division</Text>
                <Text style={styles.tableCell} colSpan={3}>
                  {order.cc}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={styles.tableHeader}>Status</Text>
                <Text style={styles.tableCell} colSpan={3}>
                  {order.director_status} / {order.procurement_status}
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
                  source={require("../assets/images/download.png")}
                  style={styles.icon}
                />
                <Text style={styles.downloadText}>Download</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text>No approved pesanan available.</Text>
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

export default CetakTanggungan;
