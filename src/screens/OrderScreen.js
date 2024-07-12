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
  Image,
} from "react-native";
import { Picker } from "@react-native-picker/picker";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRole } from "../context/RoleContext";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import YourOrderScreen from "./YourOrderScreen";

const Tab = createBottomTabNavigator();
const reviewIcon = require("../assets/images/check.png");
const addIcon = require("../assets/images/add.png");
const listIcon = require("../assets/images/list.png");
const orderIcon = require("../assets/images/order.png");

const OrderScreen = () => {
  const [cc, setCc] = useState("");
  const { role } = useRole();
  const [orders, setOrders] = useState([
    { nama_barang: "", quantity: "", keterangan: "", satuan: "" },
  ]);
  const [loading, setLoading] = useState(false);
  const [showSummary, setShowSummary] = useState(false);
  const [focusedInput, setFocusedInput] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);

  useEffect(() => {
    const fetchLastOrderId = async () => {
      try {
        const lastOrderDoc = await getDoc(doc(db, "meta", "lastOrderId"));
        if (lastOrderDoc.exists()) {
          setLastOrderId(lastOrderDoc.data().lastOrderId);
        } else {
          setLastOrderId("ORD0000000000");
        }
      } catch (error) {
        console.error("Failed to fetch last order ID:", error);
      }
    };
    fetchLastOrderId();
  }, []);

  const handleAddOrder = () => {
    setOrders([
      ...orders,
      { nama_barang: "", quantity: "", keterangan: "", satuan: "" },
    ]);
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

  const generateNewOrderId = (lastOrderId) => {
    const orderNumber = parseInt(lastOrderId.substring(3)) + 1;
    return `ORD${orderNumber.toString().padStart(10, "0")}`;
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
    let databaseName = "data_pemesanan";

    const status = "Pending";
    const division = role;
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);

    orders.forEach((order, index) => {
      modifiedOrder[index] = { ...order };
    });

    let finalOrder = {
      ...modifiedOrder,
      cc,
      date: formattedDate,
      status,
      division,
    };

    try {
      const orderDoc = doc(db, databaseName, newOrderId);
      await setDoc(orderDoc, finalOrder);

      await setDoc(doc(db, "meta", "lastOrderId"), { lastOrderId: newOrderId });

      Alert.alert("Success", "Orders have been added successfully.");
      setOrders([
        { nama_barang: "", quantity: "", keterangan: "", satuan: "" },
      ]);
      setCc("");
      setShowSummary(false);
      setLastOrderId(newOrderId);
    } catch (error) {
      Alert.alert("Error", "Failed to add orders. Please try again.");
    } finally {
      setLoading(false);
    }
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

  const renderSummary = () => (
    <Modal visible={showSummary} animationType="slide" transparent={true}>
      <View style={styles.modalContainer}>
        <View style={styles.modalContent}>
          <Text style={styles.summaryTitle}>Order Summary</Text>
          <ScrollView style={styles.scrollView}>
            <View style={styles.tableContainer}>
              <View style={styles.tableHeader}>
                <Text style={styles.headerText}>Item</Text>
                <Text style={styles.headerText}>Nama Barang</Text>
                <Text style={styles.headerText}>Kuantitas</Text>
                <Text style={styles.headerText}>Satuan</Text>
                <Text style={styles.headerText}>Keterangan</Text>
              </View>
              {orders.map((order, index) => (
                <View key={index} style={styles.tableRow}>
                  <Text style={styles.cellText}>{index + 1}</Text>
                  <Text style={styles.cellText}>{order.nama_barang}</Text>
                  <Text style={styles.cellText}>{order.quantity}</Text>
                  <Text style={styles.cellText}>{order.satuan}</Text>
                  <Text style={[styles.cellText, styles.wrapText]}>{order.keterangan}</Text>
                </View>
              ))}
            </View>
          </ScrollView>
          <Text style={styles.ccText}>{`CC: ${cc}`}</Text>
          <View style={styles.summaryButtons}>
            <TouchableOpacity
              style={styles.button}
              onPress={() => setShowSummary(false)}
            >
              <Text style={styles.buttonText1}>Edit</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.button} onPress={handlePlaceOrder}>
              {loading ? (
                <ActivityIndicator color="#fff" />
              ) : (
                <Text style={styles.buttonText}>Confirm</Text>
              )}
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {orders.map((item, index) => (
        <View key={index} style={styles.orderInputContainer}>
          <Text style={styles.label}>Nama Barang</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === `nama_barang_${index}` && styles.focusedInput,
            ]}
            placeholder="Nama Barang"
            value={item.nama_barang}
            onChangeText={(text) =>
              handleOrderChange(text, index, "nama_barang")
            }
            onFocus={() => setFocusedInput(`nama_barang_${index}`)}
            onBlur={() => setFocusedInput(null)}
          />
          <Text style={styles.label}>Kuantitas</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === `quantity_${index}` && styles.focusedInput,
            ]}
            placeholder="Kuantitas"
            keyboardType="numeric"
            value={item.quantity}
            onChangeText={(text) => handleOrderChange(text, index, "quantity")}
            onFocus={() => setFocusedInput(`quantity_${index}`)}
            onBlur={() => setFocusedInput(null)}
          />
          <Text style={styles.label}>Satuan</Text>
          <Picker
            selectedValue={item.satuan}
            onValueChange={(value) => handleOrderChange(value, index, "satuan")}
            style={styles.container}
          >
            <Picker.Item label="-- Pilih Satuan --" value="" />
            <Picker.Item label="Pcs" value="Pcs" />
            <Picker.Item label="Box" value="Box" />
            <Picker.Item label="Unit" value="unit" />
            <Picker.Item label="Lusin" value="Lusin" />
            <Picker.Item label="Pak" value="Pak" />
          </Picker>

          <Text style={styles.label1}>Keterangan</Text>
          <TextInput
            style={[
              styles.input,
              focusedInput === `keterangan_${index}` && styles.focusedInput,
            ]}
            placeholder="Keterangan"
            value={item.keterangan}
            onChangeText={(text) =>
              handleOrderChange(text, index, "keterangan")
            }
            onFocus={() => setFocusedInput(`keterangan_${index}`)}
            onBlur={() => setFocusedInput(null)}
          />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteOrder(index)}
          >
            <Text style={styles.deleteButtonText}>Hapus</Text>
          </TouchableOpacity>
        </View>
      ))}
      <Text style={styles.label}>CC</Text>
      <TextInput
        style={[styles.input, focusedInput === "cc" && styles.focusedInput]}
        placeholder="CC"
        value={cc}
        onChangeText={(text) => setCc(text)}
        onFocus={() => setFocusedInput("cc")}
        onBlur={() => setFocusedInput(null)}
      />
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrder}>
        <Image source={addIcon} style={styles.icon} />
        <Text style={styles.addButtonText}>Tambah pesanan lain</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.reviewButton}
        onPress={() => setShowSummary(true)}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator color="#fff" />
        ) : (
          <>
            <Image source={reviewIcon} style={styles.icon} />
            <Text style={styles.reviewButtonText}>Review & Konfirmasi Pesanan</Text>
          </>
        )}
      </TouchableOpacity>
      {renderSummary()}
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
    padding: 15,
    backgroundColor: "#fff",
    borderRadius: 10,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 2,
  },
  label: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 4,
    marginTop: 10,
    marginBottom: 10,
  },
  label1: {
    color: "#000",
    fontSize: 20,
    fontWeight: "bold",
    paddingLeft: 4,
    marginTop: 20,
    marginBottom: 5,
  },
  input: {
    width: "100%",
    padding: 15,
    marginVertical: 10,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
  },
  focusedInput: {
    borderColor: "#38B6FF",
  },
  addButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#38B6FF",
    borderRadius: 8,
    marginTop: 10,
  },
  addButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  reviewButton: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    padding: 15,
    backgroundColor: "#38B6FF",
    borderRadius: 8,
    marginTop: 20,
  },
  reviewButtonText: {
    color: "#fff",
    fontWeight: "bold",
    marginLeft: 10,
  },
  deleteButton: {
    marginTop: 10,
    padding: 10,
    backgroundColor: "#ff4d4d",
    borderRadius: 8,
    alignItems: "center",
  },
  deleteButtonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalContent: {
    width: "90%",
    backgroundColor: "#fff",
    borderRadius: 10,
    padding: 20,
    maxHeight: "80%", // Adjust the maximum height as per your need
  },
  summaryTitle: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 20,
    textAlign: "center",
    color: "#38B6FF",
  },
  scrollView: {
    maxHeight: "70%", // Adjust the maximum height as per your need
  },
  tableContainer: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    overflow: "hidden",
  },
  tableHeader: {
    flexDirection: "row",
    backgroundColor: "#f0f0f0",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  headerText: {
    flex: 1,
    textAlign: "center",
    fontSize: 12,
    fontWeight: "bold",
    color: "#333",
  },
  tableRow: {
    flexDirection: "row",
    borderBottomWidth: 1,
    borderBottomColor: "#ccc",
    paddingVertical: 10,
  },
  cellText: {
    flex: 1,
    textAlign: "center",
    paddingHorizontal: 5,
    color: "#333",
  },
  wrapText: {
    flexWrap: "wrap",
  },
  ccText: {
    marginTop: 20,
    fontSize: 16,
    fontWeight: "bold",
    textAlign: "center",
  },
  summaryButtons: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  button: {
    padding: 10,
    backgroundColor: "#38B6FF",
    borderRadius: 8,
    alignItems: "center",
    flex: 1,
    marginHorizontal: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  buttonText1: {
    color: "#fff",
    fontWeight: "bold",
  },
  icon: {
    width: 20,
    height: 20,
    marginRight: 5,
  },
});

export default function App() {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ color, size }) => {
          let iconSource;

          if (route.name === "Pesanan") {
            iconSource = orderIcon;
          } else if (route.name === "Pesanan Anda") {
            iconSource = listIcon;
          }

          return (
            <Image
              source={iconSource}
              style={{ width: size, height: size, tintColor: color }}
            />
          );
        },
      })}
      tabBarOptions={{
        activeTintColor: "#38B6FF",
        inactiveTintColor: "gray",
      }}
    >
      <Tab.Screen name="Pesanan" component={OrderScreen} />
      <Tab.Screen name="Pesanan Anda" component={YourOrderScreen} />
    </Tab.Navigator>
  );
}
