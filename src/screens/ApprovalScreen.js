import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import {
  View,
  Text,
  Button,
  StyleSheet,
  ScrollView,
  ActivityIndicator,
} from "react-native";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../../firebase.js";
import { useRole } from "../context/RoleContext.js";
import fetchData from "../utils/fetchData"; // Adjust the path as necessary

const ApprovalScreen = () => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const { role } = useRole();
  const databaseName = "data_pemesanan";

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

  const handleApprove = async (orderId) => {
    setLoading(true);
    try {
      const orderRef = doc(db, databaseName, orderId);
      const docSnap = await getDoc(orderRef);
      if (docSnap.exists()) {
        await updateDoc(orderRef, { status: "approved" });
        // Refresh the data
        const updatedOrdersData = await fetchData(databaseName, role);
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
      <Text>User role: {role}</Text>
      <Text>Database: {databaseName}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#0000ff" />
      ) : data.length > 0 ? (
        data.map((order) => (
          <View key={order.id} style={styles.orderContainer}>
            <Text style={styles.subHeader}>Order ID: {order.id}</Text>
            <Text style={styles.data}>{JSON.stringify(order, null, 2)}</Text>
            <View style={styles.buttonContainer}>
              <Button
                onPress={() => handleApprove(order.id)}
                title={order.logisticapproved ? "Approved" : "Approve"}
                disabled={order.logisticapproved}
              />
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

export default ApprovalScreen;
