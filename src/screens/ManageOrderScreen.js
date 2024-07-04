import React, { useState, useEffect } from "react";
import { useIsFocused } from "@react-navigation/native";
import { View, Text, Button, StyleSheet, ScrollView } from "react-native";
import {
  collection,
  getDocs,
  getDoc,
  doc,
  updateDoc,
  addDoc,
  query,
  where,
  deleteDoc,
} from "firebase/firestore";
import { db } from "../../firebase.js";
import { useRole } from "../context/RoleContext.js";

const ManageOrderScreen = () => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const { role } = useRole();
  

  const databaseName = role.split(" ")[role.split(" ").length - 1] + "Order";

  // Function to fetch data from Firestore
  const fetchData = async () => {
    try {
      let ordersData = [];
      console.log("Role ", role);
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
    if (isFocused) {
      fetchData();
    }
  }, [isFocused]);

  const handleApprove = async (orderId) => {
    let approve = "";
    console.log("Role: ", role);

    switch (role) {
      case "Head of Sales":
        approve = "modifiedOrder.headSalesapproved";
        break;
      case "Head of Finance":
        approve = "modifiedOrder.headFinanceapproved";
        break;
      case "Head of Human_Control":
        approve = "modifiedOrder.headHCapproved";
        break;
      case "Head of SPI":
        approve = "modifiedOrder.headSPIapproved";
        break;
      case "Head of Procurement":
        approve = "modifiedOrder.headProcurementapproved";
        break;
      case "Head of Business_Development":
        approve = "modifiedOrder.headBusinessDevelopmentapproved";
        break;
      case "Head of Infrastructure":
        approve = "modifiedOrder.headInfrastructureapproved";
        break;
      case "Head of SAP":
        approve = "modifiedOrder.headSAPapproved";
        break;
      case "Head of Digital_Transformation":
        approve = "modifiedOrder.headDigitalTransformationapproved";
        break;
      case "Head of Corporate_Secretary":
        approve = "modifiedOrder.headCorporateSecretaryapproved";
        break;
      default:
        console.log("Role not recognized");
        return; // Exit the function if the role is not recognized
    }

    try {
      let orderData;
      const orderRef = doc(db, databaseName, orderId);
      const docSnap = await getDoc(orderRef);
      if (docSnap.exists()) {
        orderData = docSnap.data();
        await updateDoc(orderRef, {
          [approve]: true,
        });
      }
      console.log("Order data: ", orderData);

      // Update the local state to reflect the change
      const updatedDocSnap = await getDoc(orderRef);
      if (updatedDocSnap.exists()) {
        orderData = updatedDocSnap.data();
        console.log("Order data after update: ", orderData);

        // Add the updated document to the new collection
        const approvedOrderRef = collection(db, "data_pemesanan");
        await addDoc(approvedOrderRef, orderData);

        // Delete the original document
        await deleteDoc(orderRef);

        // Update the local state to reflect the change
        await fetchData();
      }

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

export default ManageOrderScreen;
