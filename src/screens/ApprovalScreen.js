import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useRole } from "../context/RoleContext.js";
import fetchData from "../utils/fetchData"; // Adjust the path as necessary
import getLastWord from "../utils/getLastWord.js";

const ApprovalScreen = () => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { role } = useRole();
  const division = getLastWord(role);
  const databaseName = "data_pemesanan";

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const ordersData = await fetchData(databaseName, "division", division);
        setData(ordersData);
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoading(false);
        console.log(division);
      }
    };

    if (isFocused) {
      getData();
    }
  }, [isFocused, role]);

  const handleApprove = async (orderId) => {
    setLoading(true);
    try {
      const orderRef = doc(db, databaseName, orderId);
      const docSnap = await getDoc(orderRef);
      if (docSnap.exists()) {
        await updateDoc(orderRef, { status: "approved" });
        const updatedOrdersData = await fetchData(
          databaseName,
          "division",
          division
        );
        setData(updatedOrdersData);
      }
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
      const docSnap = await getDoc(orderRef);
      if (docSnap.exists()) {
        await updateDoc(orderRef, { status: "rejected" });
        const updatedOrdersData = await fetchData(
          databaseName,
          "division",
          division
        );
        setData(updatedOrdersData);
      }
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
      ) : data.length > 0 ? (
        data.map((order) => (
          <View key={order.id} style={styles.orderContainer}>
            <Text style={styles.subHeader}>Order ID: {order.id}</Text>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Nama Barang:</Text>
              <Text style={styles.value}>{order.nama_barang}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Quantity:</Text>
              <Text style={styles.value}>{order.quantity}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Satuan:</Text>
              <Text style={styles.value}>{order.satuan}</Text>
            </View>
            <View style={styles.detailRow}>
              <Text style={styles.label}>Keterangan:</Text>
              <Text style={styles.value}>{order.keterangan}</Text>
            </View>
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
                style={styles.button}
                onPress={() => handleApprove(order.id)}
                disabled={order.logisticapproved}
              >
                <Image
                  source={require('C:/Users/daffa/Downloads/TUGAS KULIAH DAFFA SASKARA/elog/eReservation/src/assets/images/order.png')}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Approve</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={[styles.button, styles.rejectButton]}
                onPress={() => handleReject(order.id)}
                disabled={order.logisticapproved}
              >
                <Image
                  source={require('C:/Users/daffa/Downloads/TUGAS KULIAH DAFFA SASKARA/elog/eReservation/src/assets/images/order.png')}
                  style={styles.buttonIcon}
                />
                <Text style={styles.buttonText}>Reject</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text>No data sent by finance.</Text>
      )}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#38B6FF",
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
  },
  label: {
    fontWeight: "bold",
  },
  value: {
    fontFamily: "monospace",
    color: "#000",
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
  },
  button: {
    flexDirection: "row",
    alignItems: "center",
    backgroundColor: "#38B6FF",
    padding: 10,
    borderRadius: 8,
    width: "48%",
    justifyContent: "center",
  },
  rejectButton: {
    backgroundColor: "#ff4d4d",
  },
  buttonIcon: {
    width: 20,
    height: 20,
    marginRight: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "bold",
  },
});

export default ApprovalScreen;
