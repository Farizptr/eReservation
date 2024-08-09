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

const EditPengajuan = () => {
  const route = useRoute();
  const { order, cc, date } = route.params; // get the passed fields
  const [keperluan, setKeperluan] = useState(order.keperluan || "");
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
          setLastOrderId(lastOrderDoc.data().lastPengajuanId);
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
      if (!order.uraian || !order.satuan_harga || !keperluan || !order.jumlah_barang) {
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
    const director_status = "Pending"
    const procurement_status = "Pending"

    orders.forEach((order, index) => {
      modifiedOrder[index] = { ...order };
    });

    let finalOrder = {
      ...modifiedOrder,
      keperluan,
      procurement_status,
      director_status,
      cc,
      date,
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
    const year = date.getFullYear();
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const day = date.getDate().toString().padStart(2, "0");
    return `${year}-${month}-${day}`;
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      {/* Display Order Details Table */}
      <View style={styles.orderDetailsContainer}>
        <Text style={styles.header}>Order Details</Text>
        <View style={styles.table}>
          <View style={styles.tableRow}>
            <Text style={styles.tableHeader}>Nama Barang</Text>
            <Text style={styles.tableHeader}>Quantity</Text>
            <Text style={styles.tableHeader}>Satuan</Text>
            <Text style={styles.tableHeader}>Keterangan</Text>
          </View>
          {Object.values(order).map((item, index) =>
            item.nama_barang && item.quantity && item.satuan && item.keterangan ? (
              <View key={index} style={styles.tableRow}>
                <Text style={styles.tableCell}>{item.nama_barang}</Text>
                <Text style={styles.tableCell}>{item.quantity}</Text>
                <Text style={styles.tableCell}>{item.satuan}</Text>
                <Text style={styles.tableCell}>{item.keterangan}</Text>
              </View>
            ) : null
          )}
        </View>
      </View>

      {/* Existing Input Form */}
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
            <Text style={styles.label}>Jumlah Barang:</Text>
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
              onChangeText={(text) => handleOrderChange(text, index, "satuan_harga")}
              onFocus={() => setFocusedInput(`satuan_harga_${index}`)}
              onBlur={() => setFocusedInput(null)}
            />
          </View>
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeleteOrder(index)}
          >
            <Text style={styles.deleteButtonText}>Hapus Item</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.addButton} onPress={handleAddOrder}>
        <Text style={styles.addButtonText}>Tambahkan Item</Text>
      </TouchableOpacity>
      <TouchableOpacity
        style={styles.placeOrderButton}
        onPress={handlePlaceOrder}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color="#fff" />
        ) : (
          <Text style={styles.placeOrderButtonText}>Submit Pengajuan</Text>
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
    marginTop: 20,
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
    marginBottom: 7,
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
    marginTop: 15,
},
placeOrderButtonText: {
    color: "#fff",
    fontWeight: "bold",
},
orderDetailsContainer: {
    marginBottom: 20,
},
header: {
    fontSize: 24,
    fontWeight: "bold",
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
    backgroundColor: "#f0f0f0",
    textAlign: "center",
},
tableCell: {
    flex: 1,
    padding: 10,
    textAlign: "center",
},
});

export default EditPengajuan;

