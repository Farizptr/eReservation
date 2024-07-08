import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
  Image
} from "react-native";
import { collection, getDocs, doc, updateDoc, getDoc, query, where } from "firebase/firestore";
import { db } from "../../firebase";
import { useRole } from "../context/RoleContext";
import { useIsFocused } from "@react-navigation/native";

const ApprovalScreen = () => {
  const isFocused = useIsFocused();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const { role } = useRole();
  const databaseName = "data_pemesanan";

  const division = role.split(' ').pop(); // Assuming the role ends with the division name

  useEffect(() => {
    const fetchOrders = async () => {
      setLoading(true);
      try {
        const q = query(collection(db, databaseName), where("division", "==", division));
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

    if (isFocused) {
      fetchOrders();
    }
  }, [isFocused, role, division]);

  const handleApprove = async (orderId) => {
    setLoading(true);
    try {
      const orderRef = doc(db, databaseName, orderId);
      await updateDoc(orderRef, { status: "approved" });
      // Refresh the data
      const updatedOrdersData = await fetchOrders();
      setOrders(updatedOrdersData);
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
      // Refresh the data
      const updatedOrdersData = await fetchOrders();
      setOrders(updatedOrdersData);
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
            {Object.values(order).map((item, index) =>
              item.nama_barang && item.quantity && item.satuan && item.keterangan ? (
                <View key={index}>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Nama Barang:</Text>
                    <Text style={styles.value}>{item.nama_barang}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Quantity:</Text>
                    <Text style={styles.value}>{item.quantity}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Satuan:</Text>
                    <Text style={styles.value}>{item.satuan}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.label}>Keterangan:</Text>
                    <Text style={styles.value}>{item.keterangan}</Text>
                  </View>
                </View>
              ) : null
            )}
            <View style={styles.detailRow}>
              <Text style={styles.label}>Date:</Text>
              <Text style={styles.value}>{order.date}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Division:</Text>
              <Text style={styles.value}>{order.division}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>CC:</Text>
              <Text style={styles.value}>{order.cc}</Text>
            </View>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.button, styles.approveButton]}
                onPress={() => handleApprove(order.id)}
                disabled={order.status === "approved"}
              >
                <Image
                  source={require('../assets/images/check.png')}
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
                  source={require('../assets/images/cross.png')}
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
      <View style={{flex: 1}}>
    <View style={{flex: 0.9}}>
        <ScrollView>
            <Text style={{marginBottom: 500}}>scrollable section</Text>
        </ScrollView>
    </View>
    <View style={{flex: 0.1}}>
        <Text>fixed footer</Text>
    </View>
</View>
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
    marginBottom: 10,
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 5,
    fontWeight: "bold",
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    fontFamily: "monospace",
    color: "#333",
  },
  orderContainer: {
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
    marginBottom: 20,
  },
  buttonContainer: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 10,
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
});

export default ApprovalScreen;
