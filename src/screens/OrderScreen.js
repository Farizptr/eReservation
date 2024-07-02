import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import {
  View,
  Text,
  TextInput,
  ScrollView,
  StyleSheet,
  Alert,
  ActivityIndicator,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../../firebase"; // Adjust the import path if needed
import { useRole } from "../context/RoleContext";

const OrderScreen = () => {
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
  const [loading, setLoading] = useState(false);

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

  const handleDeleteOrder = (index) => {
    const newOrders = [...orders];
    newOrders.splice(index, 1);
    setOrders(newOrders);
  };

  const handleOrderChange = (text, index, field) => {
    const newOrders = [...orders];
    newOrders[index][field] = text;
    setOrders(newOrders);
  };

  const validateOrders = () => {
    for (let order of orders) {
      if (
        !order.nama_barang ||
        !order.quantity ||
        !order.satuan ||
        !order.keterangan ||
        !cc
      ) {
        return false;
      }
    }
    return true;
  };

  const handlePlaceOrder = async () => {
    if (!validateOrders()) {
      Alert.alert(
        "Validation Error",
        "Please fill out all fields in each order."
      );
      return;
    }

    setLoading(true);

    let modifiedOrder = {};
    let databaseName = role + "Order";
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    orders.forEach((order, index) => {
      modifiedOrder[index] = { ...order };
    });

    let finalOrder = {
      ...modifiedOrder,
      cc: cc,
      date: formattedDate,
    };

    switch (role) {
      case "Sales":
        finalOrder.headSalesapproved = false;
        break;
      case "Finance":
        finalOrder.headFinanceapproved = false;
        break;
      case "Human_Control":
        finalOrder.headHCapproved = false;
        break;
      case "SPI":
        finalOrder.headSPIapproved = false;
        break;
      case "Procurement":
        finalOrder.headProcurementapproved = false;
        break;
      case "Business_Development":
        finalOrder.headBusinessDevelopmentapproved = false;
        break;
      case "Infrastructure":
        finalOrder.headInfrastructureapproved = false;
        break;
      case "SAP":
        finalOrder.headSAPapproved = false;
        break;
      case "Digital_Transformation":
        finalOrder.headDigitalTransformationapproved = false;
        break;
      case "Corporate_Secretary":
        break;
      default:
        console.log("Role not recognized");
        setLoading(false);
        return;
    }

    try {
      const ordersCollection = collection(
        db,
        role === "Corporate_Secretary" ? "data_pemesanan" : databaseName
      );
      await addDoc(ordersCollection, finalOrder);

      console.log("Orders have been added successfully.");
      Alert.alert("Success", "Orders have been added successfully.");
      setOrders([
        { nama_barang: "", quantity: "", keterangan: "", satuan: "" },
      ]);
      setCc("");
    } catch (error) {
      console.error("Error adding orders: ", error);
      Alert.alert("Error", "Failed to add orders. Please try again.");
    } finally {
      setLoading(false);
    }
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
    const monthIndex = date.getMonth();
    const year = date.getFullYear();
    return `${day} ${monthNames[monthIndex]} ${year}`;
  }

  return (
    <ScrollView contentContainerStyle={styles.container}>
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
          <Picker
            selectedValue={item.satuan}
            onValueChange={(value) => handleOrderChange(value, index, "satuan")}
            style={styles.input}
          >
            <Picker.Item label="Pcs" value="Pcs" />
            <Picker.Item label="Box" value="Box" />
            <Picker.Item label="Unit" value="unit" />
            <Picker.Item label="Lusin" value="Lusin" />
            <Picker.Item label="Pak" value="Pak" />
          </Picker>
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
      <TouchableOpacity
        style={styles.button}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <Text style={styles.buttonText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
    backgroundColor: "#f5f5f5",
  },
  orderInputContainer: {
    marginBottom: 20,
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
