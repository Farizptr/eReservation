import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
  Modal,
  ActivityIndicator,
} from "react-native";
import { collection, getDocs } from "firebase/firestore";
import { db } from "../../firebase";
import { useRole } from "../context/RoleContext";
import { useIsFocused } from "@react-navigation/native";

const YourOrderScreen = () => {
  const isFocused = useIsFocused();
  const [data, setData] = useState([]);
  const { role } = useRole();
  const databaseName = "data_pemesanan";
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  useEffect(() => {
    const getData = async () => {
      setLoading(true);
      try {
        const querySnapshot = await getDocs(collection(db, databaseName));
        const ordersData = querySnapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        
        const formattedData = ordersData.map((order) => {
          const { cc, date, division, status, ...items } = order;
          return Object.keys(items).map((key) => {
            const item = items[key];
            if (item.nama_barang && item.quantity && item.satuan) {
              return {
                id: order.id,
                cc,
                date,
                division,
                status,
                ...item,
              };
            }
            return null;
          }).filter(item => item !== null);
        }).flat();
        
        const sortedData = formattedData.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        const groupedData = sortedData.reduce((acc, order) => {
          if (!acc[order.id]) {
            acc[order.id] = [];
          }
          acc[order.id].push(order);
          return acc;
        }, {});
        
        setData(Object.values(groupedData));
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

  const handleStatusModal = (order) => {
    setSelectedOrder(order);
    setModalVisible(true);
  };

  const closeModal = () => {
    setModalVisible(false);
    setSelectedOrder(null);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.header}>{role}</Text>
      {loading ? (
        <ActivityIndicator size="large" color="#38B6FF" />
      ) : data.length > 0 ? (
        data.map((orderGroup, index) => (
          <View key={index} style={styles.orderContainer}>
            <Text style={styles.subHeader}>Order ID: {orderGroup[0].id}</Text>
            {orderGroup.map((order, idx) => (
              <View key={idx} style={styles.itemContainer}>
                <Text style={styles.label}>Nama Barang: {order.nama_barang}</Text>
                <Text style={styles.label}>Quantity: {order.quantity}</Text>
                <Text style={styles.label}>Satuan: {order.satuan}</Text>
              </View>
            ))}
            <Text style={styles.label}>CC: {orderGroup[0].cc}</Text>
            <Text style={styles.label}>Tanggal: {orderGroup[0].date}</Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => handleStatusModal(orderGroup[0])}
              >
                <Text style={styles.buttonText}>Lihat Status</Text>
              </TouchableOpacity>
            </View>
          </View>
        ))
      ) : (
        <Text>No data available.</Text>
      )}
      {selectedOrder && (
        <Modal
          transparent={true}
          visible={modalVisible}
          animationType="slide"
          onRequestClose={closeModal}
        >
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Status Pesanan</Text>
              <Text style={styles.modalText}>Order ID: {selectedOrder.id}</Text>
              <Text style={styles.modalText}>Status: {selectedOrder.status}</Text>
              <TouchableOpacity style={styles.closeButton} onPress={closeModal}>
                <Text style={styles.buttonText}>Tutup</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
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
  orderContainer: {
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
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginBottom: 10,
  },
  itemContainer: {
    marginBottom: 10,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    color: "#000",
  },
  buttonContainer: {
    marginTop: 10,
  },
  statusButton: {
    backgroundColor: "#38B6FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
  },
  modalContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0,0,0,0.5)",
  },
  modalContent: {
    width: "80%",
    padding: 20,
    backgroundColor: "#fff",
    borderRadius: 10,
    elevation: 10,
  },
  modalHeader: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#38B6FF",
    marginBottom: 10,
  },
  modalText: {
    fontSize: 16,
    marginBottom: 10,
  },
  closeButton: {
    backgroundColor: "#38B6FF",
    padding: 10,
    borderRadius: 5,
    alignItems: "center",
  },
});

export default YourOrderScreen;
