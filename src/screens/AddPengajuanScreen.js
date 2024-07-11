import React, { useState, useEffect } from "react";
import {
  TouchableOpacity,
  Alert,
  ScrollView,
  ActivityIndicator,
  StyleSheet,
  TextInput,
  View,
  Text,
  Modal,
} from "react-native";
import { useNavigation, useRoute } from "@react-navigation/native";
import { doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRole } from "../context/RoleContext";

const AddPengajuanScreen = () => {
  const navigation = useNavigation();
  const [keperluan, setKeperluan] = useState("");
  const [cc, setCc] = useState("");
  const { role } = useRole();
  const [orders, setOrders] = useState([{ uraian: "", satuan_harga: "", jumlah_barang: "" }]);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);

  useEffect(() => {
    const fetchLastOrderId = async () => {
      try {
        const lastOrderDoc = await getDoc(doc(db, "meta", "lastPengajuanId"));
        if (lastOrderDoc.exists()) {
          setLastOrderId(lastOrderDoc.data().lastOrderId);
          console.log(lastOrderDoc.data().lastOrderId);
          console.log(lastOrderDoc.data())
        } else {
          setLastOrderId("PGJ0000000000");
        }
      } catch (error) {
        console.error("Failed to fetch last order ID:", error);
      }
    };
    fetchLastOrderId();
  }, []);

  const handleAddOrder = () => {
    setOrders([...orders, { uraian: "", satuan_harga: "", jumlah_barang: "" }]);
  };

  const handleDeleteOrder = (index) => {
    if (orders.length > 1) {
      const newOrders = [...orders];
      newOrders.splice(index, 1);
      setOrders(newOrders);
    } else {
      Alert.alert(
        "Tidak Bisa Menghapus Semua Order",
        "Minimal harus ada satu order."
      );
    }
  };

  const handleOrderChange = (text, index, field) => {
    const newOrders = [...orders];
    newOrders[index][field] = text;
    setOrders(newOrders);
  };

  const validateOrders = () => {
    for (let order of orders) {
      if (!order.uraian || !order.satuan_harga || !keperluan || !cc || !order.jumlah_barang) {
        return false;
      }
    }
    return true;
  };

  const generateNewOrderId = (lastOrderId) => {
    const orderNumber = parseInt(lastOrderId.substring(3)) + 1;
    return `PGJ${orderNumber.toString().padStart(10, "0")}`;
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

    const newOrderId = generateNewOrderId(lastOrderId);
    let modifiedOrder = {};
    let databaseName = "data_pengajuan";

    const status = "Pending";
    const director_status = "Pending";
    const procurement_status = "Pending";
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    orders.forEach((order, index) => {
      modifiedOrder[index] = { ...order };
    });

    let finalOrder = {
      ...modifiedOrder,
      keperluan,
      cc,
      director_status,
      procurement_status,
      date: formattedDate,
    };

    try {
      const orderDoc = doc(db, databaseName, newOrderId);
      await setDoc(orderDoc, {
        ...finalOrder,
      });

      const metaDoc = doc(db, "meta", "lastPengajuanId");
      await setDoc(metaDoc, { lastPengajuanId: newOrderId });

      setLoading(false);
      setShowSummary(true);
      setLastOrderId(newOrderId);
      Alert.alert("Success", "Order placed successfully!");
    } catch (error) {
      setLoading(false);
      console.error("Error placing order:", error);
      Alert.alert("Error", "Failed to place order.");
    }
  };

  const handleModalClose = () => {
    setShowSummary(false);
  };

  const formatDate = (date) => {
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
    const hours = date.getHours().toString().padStart(2, "0");
    const minutes = date.getMinutes().toString().padStart(2, "0");
    const seconds = date.getSeconds().toString().padStart(2, "0");
    return `${day} ${monthNames[monthIndex]} ${year} ${hours}:${minutes}:${seconds}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Modal visible={showSummary} animationType="slide">
        <View style={styles.modalContent}>
          <Text style={styles.modalTitle}>Order Summary</Text>
          {orders.map((order, index) => (
            <View key={index} style={styles.orderSummary}>
              <Text style={styles.summaryText}>Order {index + 1}:</Text>
              <Text style={styles.summaryText}>Uraian: {order.uraian}</Text>
              <Text style={styles.summaryText}>
                Satuan Harga: {order.satuan_harga}
              </Text>
            </View>
          ))}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleModalClose}
          >
            <Text style={styles.closeButtonText}>Close</Text>
          </TouchableOpacity>
        </View>
      </Modal>
      <View style={styles.row}>
        <Text style={styles.label}>Keperluan:</Text>
        <TextInput
          style={styles.input}
          value={keperluan}
          onChangeText={setKeperluan}
          onFocus={() => setFocusedInput("keperluan")}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
      <View style={styles.row}>
        <Text style={styles.label}>CC:</Text>
        <TextInput
          style={styles.input}
          value={cc}
          onChangeText={setCc}
          onFocus={() => setFocusedInput("cc")}
          onBlur={() => setFocusedInput(null)}
        />
      </View>
      {orders.map((order, index) => (
        <View key={index} style={styles.orderContainer}>
          <View style={styles.row}>
            <Text style={styles.label}>Uraian:</Text>
            <TextInput
              style={styles.input}
              value={order.uraian}
              onChangeText={(text) => handleOrderChange(text, index, "uraian")}
              onFocus={() => setFocusedInput(`uraian_${index}`)}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>jumlah_barang</Text>
            <TextInput
              style={styles.input}
              value={order.jumlah_barang}
              onChangeText={(text) => handleOrderChange(text, index, "jumlah_barang")}
              onFocus={() => setFocusedInput(`jumlah_barang_${index}`)}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          <View style={styles.row}>
            <Text style={styles.label}>Satuan Harga:</Text>
            <TextInput
              style={styles.input}
              value={order.satuan_harga}
              onChangeText={(text) =>
                handleOrderChange(text, index, "satuan_harga")
              }
              onFocus={() => setFocusedInput(`satuan_harga_${index}`)}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteOrder(index)}
          >
            <Text style={styles.deleteButtonText}>Delete Order</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrder}>
        <Text style={styles.addButtonText}>Add Order</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.placeOrderButtonText}>Place Order</Text>
        )}
      </TouchableOpacity>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 20,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginBottom: 10,
  },
  label: {
    fontWeight: "bold",
    marginRight: 10,
  },
  input: {
    flex: 1,
    borderWidth: 1,
    borderColor: "#ccc",
    padding: 8,
    borderRadius: 5,
  },
  orderContainer: {
    marginBottom: 10,
  },
  deleteButton: {
    backgroundColor: "#ff6347",
    padding: 8,
    borderRadius: 5,
    marginTop: 5,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#38B6FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  placeOrderButton: {
    backgroundColor: "#4CAF50",
    padding: 15,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  placeOrderButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContent: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    backgroundColor: "#fff",
  },
  modalTitle: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 20,
  },
  orderSummary: {
    marginBottom: 10,
  },
  summaryText: {
    fontSize: 18,
  },
  closeButton: {
    backgroundColor: "#38B6FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
    marginTop: 20,
  },
  closeButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

export default AddPengajuanScreen;
