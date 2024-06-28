import React, { useState } from "react";
import { Button, TouchableOpacity } from "react-native";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import path if needed
import { useRole } from "../context/RoleContext";

const OrderScreen = () => {
  const [tujuan, setTujuan] = useState("");
  const [cc, setCc] = useState("");
  const { role } = useRole();
  const [orders, setOrders] = useState([
    {
      nama_barang: "",
      quantity: "",
      keterangan: "",
      satuan: "",
    },
  ]);

  const handleAddOrder = () => {
    setOrders([
      ...orders,
      {
        nama_barang: "",
        quantity: "",
        keterangan: "",
        satuan: "",
      },
    ]);
  };

  const handleOrderChange = (text, index, field) => {
    const newOrders = [...orders];
    newOrders[index][field] = text;
    setOrders(newOrders);
  };

  const handlePlaceOrder = async () => {
    let modifiedOrder = { ...orders }; // Copy the orders object
    let databaseName = role + "Order";
    const currentDate = new Date(); // Step 1 & 2: Get current date in ISO string format
    const formattedDate = formatDate(currentDate);
    modifiedOrder.date = formattedDate;
    modifiedOrder.tujuan = tujuan;
    modifiedOrder.cc = cc;
    console.log("Role: ", role);
    switch (role) {
      case "Sales":
        modifiedOrder.headSalesapproved = false;
        break;
      case "Finance":
        modifiedOrder.headFinanceapproved = false;
        break;
      case "Human_Control":
        modifiedOrder.headHCapproved = false;
        break;
      case "SPI":
        modifiedOrder.headSPIapproved = false;
        break;
      case "Procurement":
        modifiedOrder.headProcurementapproved = false;
        break;
      case "Business_Development":
        modifiedOrder.headBusinessDevelopmentapproved = false;
        break;
      case "Infrastructure":
        modifiedOrder.headInfrastructureapproved = false;
        break;
      case "SAP":
        modifiedOrder.headSAPapproved = false;
        break;
      case "Digital_Transformation":
        modifiedOrder.headDigitalTransformationapproved = false;
        break;
      case "Corporate_Secretary":
        modifiedOrder.headProcurementapproved = false;
        break;
      default:
        console.log("Role not recognized");
        return; // Exit the function if the role is not recognized
    }
    console.log("Modified Orders: ", modifiedOrder);

    try {
      const ordersCollection = collection(db, databaseName); // Reference to 'orders' collection
      // Add the entire orders array as one document in the "orders" collection
      await addDoc(ordersCollection, { modifiedOrder });

      console.log("Orders have been added successfully.");
      // Optionally, you can clear the form after successful submission
      setOrders([
        {
          nama_barang: "",
          quantity: "",
          keterangan: "",
          satuan: "",
        },
      ]);
      setCc("");
    } catch (error) {
      console.error("Error adding orders: ", error);
    }
  };

  const handleDeleteOrder = (index) => {
    const newOrders = [...orders];
    newOrders.splice(index, 1);
    setOrders(newOrders);
  };

  function formatDate(date) {
    const day = date.getDate();
    const monthNames = [
      "Januari",
      "Februari",
      "Maret",
      "April",
      "Mei",
      "Juni",
      "Juli",
      "Agustus",
      "September",
      "Oktober",
      "November",
      "Desember",
    ];
    const monthIndex = date.getMonth(); // getMonth() returns a zero-based index
    const year = date.getFullYear();

    return `${day} ${monthNames[monthIndex]} ${year}`;
  }
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Button title="Konsumsi" onPress={() => setTujuan("KONSUMSI")} />
      <Button title="Atk/barang" onPress={() => setTujuan("ATK/BARANG")} />

      <Text>Current Tujuan: {tujuan}</Text>
      {orders.map((item, index) => (
        <View key={index} style={styles.orderInputContainer}>
          <Text>Nama Barang</Text>
          <TextInput
            style={styles.input}
            placeholder="Nama Barang"
            value={item.nama_barang}
            onChangeText={(text) =>
              handleOrderChange(text, index, "nama_barang")
            }
          />
          <Text>Quantity</Text>
          <TextInput
            style={styles.input}
            placeholder="Kuantitas"
            keyboardType="numeric"
            value={item.quantity}
            onChangeText={(text) => handleOrderChange(text, index, "quantity")}
          />
          <Text>Satuan</Text>
          <TextInput
            style={styles.input}
            placeholder="Satuan"
            value={item.satuan}
            onChangeText={(text) => handleOrderChange(text, index, "satuan")}
          />
          <Text>Keterangan</Text>
          <TextInput
            style={styles.input}
            placeholder="Keterangan"
            value={item.keterangan}
            onChangeText={(text) =>
              handleOrderChange(text, index, "keterangan")
            }
          />

          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteOrder(index)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Text>CC</Text>
      <TextInput
        style={styles.input}
        placeholder="CC"
        value={cc}
        onChangeText={(text) => setCc(text)}
      />
      <TouchableOpacity style={styles.button} onPress={handleAddOrder}>
        <Text style={styles.buttonText}>Add another order</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handlePlaceOrder}>
        <Text style={styles.buttonText}>Place Order</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 5,
    backgroundColor: "#fff",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  button: {
    alignItems: "center",
    backgroundColor: "#007bff",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  deleteButton: {
    alignItems: "center",
    backgroundColor: "#ff6347",
    padding: 10,
    borderRadius: 5,
    marginVertical: 5,
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default OrderScreen;
