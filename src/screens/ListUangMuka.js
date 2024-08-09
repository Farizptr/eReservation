import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { collection, getDocs, query, where } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useRole } from "../context/RoleContext.js";
import { useNavigation } from "@react-navigation/native";

const ListUangMuka = () => {
  const navigation = useNavigation();
  const [data, setData] = useState([]);

  const { role } = useRole();
  const databaseName = "data_pengajuan";
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
      console.log(ordersData);
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
  }, [navigation, role, allowedRoles]);

  if (!allowedRoles.includes(role)) {
    return null;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>Approved UM</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length > 0 ? (
        data.map((order) => (
          <View key={order.id} style={styles.orderContainer}>
            <Text style={styles.orderId}>Order ID: {order.id}</Text>
            <View style={styles.table}>
              {Object.keys(order).filter(key => !isNaN(key)).length > 0 ? (
                Object.keys(order).filter(key => !isNaN(key)).map((key, index) => (
                  <React.Fragment key={index}>
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableHeader, styles.columnBorder]}>Uraian</Text>
                      <Text style={styles.tableCell}>{order[key].uraian}</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableHeader, styles.columnBorder]}>Jumlah Barang</Text>
                      <Text style={styles.tableCell}>{order[key].jumlah_barang}</Text>
                    </View>
                    <View style={styles.tableRow}>
                      <Text style={[styles.tableHeader, styles.columnBorder]}>Harga Satuan</Text>
                      <Text style={styles.tableCell}>{order[key].satuan_harga}</Text>
                    </View>
                  </React.Fragment>
                ))
              ) : (
                <Text style={styles.tableCell}>Data tidak tersedia</Text>
              )}
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, styles.columnBorder]}>Keperluan</Text>
                <Text style={styles.tableCell}>{order.keperluan || "N/A"}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, styles.columnBorder]}>Date</Text>
                <Text style={styles.tableCell}>{order.date || "N/A"}</Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, styles.columnBorder]}>CC</Text>
                <Text style={styles.tableCell}>{order.cc || "N/A"}</Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.downloadButton}
                onPress={() =>
                  navigation.navigate("BuatPertanggungJawaban", {
                    order,
                  })
                }
              >
                <Text style={styles.downloadText}>Buat Pertanggung Jawaban</Text>
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
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    alignItems: "center",
    marginTop: 10,
  },
  downloadButton: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#38B6FF",
    padding: 10,
    borderRadius: 5,
    marginTop: 20,
    marginBottom: 50,
  },
  downloadText: {
    color: "white",
    fontWeight: "bold",
  },
  columnBorder: {
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});

export default ListUangMuka;
