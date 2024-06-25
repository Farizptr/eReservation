import React, { useState, useEffect } from "react";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import {
  collection,
  getDocs,
  doc,
  updateDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "../firebase.js";
import { useRole } from "../context/RoleContext.js";

const ManagePengajuanScreen = () => {
  const [data, setData] = useState([]);
  const { role } = useRole();
  const databaseName = "data_pengajuan";

  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      let ordersData = [];

      // For other roles, fetch from the specific collection
      const querySnapshot = await getDocs(collection(db, databaseName));
      querySnapshot.forEach((doc) => {
        ordersData.push({ id: doc.id, ...doc.data() });
      });

      // Set the fetched data to the state
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

  const handleApprove = async (orderId) => {
    let approve = "";

    switch (role) {
      case "Director":
        approve = "modifiedPengajuan.directorapproved";
        break;
      case "Head of Procurement":
        approve = "modifiedPengajuan.headProcurementapproved";
        break;
      default:
        console.log("Role not recognized");
        return; // Exit the function if the role is not recognized
    }

    try {
      // Update the document in the specific collection
      const orderRef = doc(db, databaseName, orderId);
      await updateDoc(orderRef, {
        [approve]: true,
      });
      // Update the local state to reflect the change
      await fetchData();
    } catch (error) {
      console.error("Error updating order:", error);
    }
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{role}</Text>
      <Text>User role: {role}</Text>
      <Text>database: {databaseName}</Text>
      {data.length > 0 ? (
        data.map((order) => (
          <View key={order.id} style={styles.orderContainer}>
            <Text style={styles.subHeader}>Order ID: {order.id}</Text>
            {/* Display the order data */}
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

export default ManagePengajuanScreen;
