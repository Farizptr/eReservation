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
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../../firebase";
import { useRole } from "../context/RoleContext";
import { useNavigation } from "@react-navigation/native";

const ApprovalScreen = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { role } = useRole();
  const databaseName = "data_pemesanan";
  const navigation = useNavigation();

  const allowedRoles = [
    "Head of Procurement",
    "Head of Finance",
    "Head of SAP",
    "Head of SPI",
    "Head of Sales",
    "Head of Infrastructure",
    "Head of Digital_Transformation",
    "Head of Business_Development",
  ];

  const division = role ? role.split(" ").pop() : "Guest"; // Assuming the role ends with the division name

  const fetchOrders = async () => {
    setLoading(true);
    try {
      const q = query(
        collection(db, databaseName),
        where("division", "==", division),
        where("status", "==", "Pending")
      );
      const querySnapshot = await getDocs(q);
      const ordersData = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setOrders(ordersData);
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

  const handleApprove = async (orderId) => {
    setLoading(true);
    try {
      const orderRef = doc(db, databaseName, orderId);
      await updateDoc(orderRef, { status: "approved" });
      await fetchOrders(); // Refresh the data
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleReject = async (orderId) => {
    setLoading(true);
    try {
      const orderRef = doc(db, databaseName, orderId);
      await updateDoc(orderRef, { status: "rejected" });
      await fetchOrders(); // Refresh the data
    } catch (error) {
      console.error("Error updating order:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{role}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : orders.length > 0 ? (
        orders.map((order) => (
          <View key={order.id} style={styles.orderContainer}>
            <Text style={styles.subHeader}>Order ID: {order.id}</Text>
            <View style={styles.table}>
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, styles.columnBorder]}>
                  Nama Barang
                </Text>
                <Text style={[styles.tableHeader, styles.columnBorder]}>
                  Quantity
                </Text>
                <Text style={[styles.tableHeader, styles.columnBorder]}>
                  Satuan
                </Text>
                <Text style={styles.tableHeader}>Keterangan</Text>
              </View>
              {Object.values(order).map((item, index) =>
                item.nama_barang &&
                item.quantity &&
                item.satuan &&
                item.keterangan ? (
                  <View key={index} style={styles.tableRow}>
                    <Text style={[styles.tableCell, styles.columnBorder]}>
                      {item.nama_barang}
                    </Text>
                    <Text style={[styles.tableCell, styles.columnBorder]}>
                      {item.quantity}
                    </Text>
                    <Text style={[styles.tableCell, styles.columnBorder]}>
                      {item.satuan}
                    </Text>
                    <Text style={styles.tableCell}>{item.keterangan}</Text>
                  </View>
                ) : null
              )}
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, styles.columnBorder]}>
                  Date
                </Text>
                <Text style={styles.tableCell} colSpan={3}>
                  {order.date}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, styles.columnBorder]}>
                  Division
                </Text>
                <Text style={styles.tableCell} colSpan={3}>
                  {order.division}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, styles.columnBorder]}>
                  CC
                </Text>
                <Text style={styles.tableCell} colSpan={3}>
                  {order.cc}
                </Text>
              </View>
              <View style={styles.tableRow}>
                <Text style={[styles.tableHeader, styles.columnBorder]}>
                  Status
                </Text>
                <Text style={styles.tableCell} colSpan={3}>
                  {order.status}
                </Text>
              </View>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.approveButton]}
                onPress={() => handleApprove(order.id)}
                disabled={order.status === "approved"}
              >
                <Image
                  source={require("../assets/images/check.png")}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={() => handleReject(order.id)}
                disabled={order.status === "rejected"}
              >
                <Image
                  source={require("../assets/images/cross.png")}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text>No orders available.</Text>
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
    fontWeight: "bold",
    color: "#38B6FF",
    marginBottom: 10,
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
    fontSize: 13.5,
    backgroundColor: "#f0f0f0",
    color: "#000000",
    textAlign: "center",
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  tableCell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
    color: "#000000",
    flexWrap: "wrap", // Allows the text to wrap
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
    marginBottom: 45,
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    padding: 10,
    borderRadius: 5,
  },
  approveButton: {
    backgroundColor: "#4CAF50",
  },
  rejectButton: {
    backgroundColor: "#f44336",
  },
  buttonIcon: {
    width: 18,
    height: 18,
    marginRight: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  columnBorder: {
    borderRightWidth: 1,
    borderColor: "#ccc",
  },
});

export default ApprovalScreen;
