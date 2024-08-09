import React, { useState, useEffect } from "react";
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  Alert,
} from "react-native";
import { collection, doc, getDoc, setDoc } from "firebase/firestore";
import { db } from "../../firebase";
import { useRoute } from "@react-navigation/native";

const BuatPertanggungJawaban = () => {
  const route = useRoute();
  const { order } = route.params;
  const [savedData, setSavedData] = useState(null);
  const [lastOrderId, setLastOrderId] = useState(null);
  const [itemData, setItemData] = useState({});

  const getItemKeys = (order) => {
    return Object.keys(order).filter((key) => !isNaN(parseInt(key)));
  };

  useEffect(() => {
    const fetchLastOrderId = async () => {
      try {
        const lastOrderDoc = await getDoc(
          doc(db, "meta", "lastPertanggungjawabanId")
        );
        if (lastOrderDoc.exists()) {
          setLastOrderId(lastOrderDoc.data().lastPertanggungjawabanId);
          console.log(lastOrderDoc.data().lastPertanggungjawabanId);
        } else {
          setLastOrderId("PRT0000000000");
          console.log("PRT0000000000");
        }
      } catch (error) {
        console.error("Failed to fetch last order ID:", error);
      }
    };
    fetchLastOrderId();

    const initialData = {};
    getItemKeys(order).forEach((key) => {
      initialData[key] = {
        input: "",
        additionalData: [],
      };
    });
    setItemData(initialData);
  }, [order]);

  const handleInputChange = (key, value) => {
    setItemData((prevData) => ({
      ...prevData,
      [key]: {
        ...prevData[key],
        input: value,
      },
    }));
  };

  const addAdditionalData = (key) => {
    setItemData((prevData) => ({
      ...prevData,
      [key]: {
        ...prevData[key],
        additionalData: [
          ...prevData[key].additionalData,
          { description: "", harga: "", jumlah: "" },
        ],
      },
    }));
  };

  const updateAdditionalData = (key, index, field, value) => {
    setItemData((prevData) => {
      const newAdditionalData = [...prevData[key].additionalData];
      newAdditionalData[index] = {
        ...newAdditionalData[index],
        [field]: value,
      };
      return {
        ...prevData,
        [key]: {
          ...prevData[key],
          additionalData: newAdditionalData,
        },
      };
    });
  };

  const deleteAdditionalData = (key, index) => {
    setItemData((prevData) => {
      const newAdditionalData = prevData[key].additionalData.filter(
        (_, i) => i !== index
      );
      return {
        ...prevData,
        [key]: {
          ...prevData[key],
          additionalData: newAdditionalData,
        },
      };
    });
  };

  const generateNewOrderId = (lastOrderId) => {
    const orderNumber = parseInt(lastOrderId.substring(3)) + 1;
    return `PRT${orderNumber.toString().padStart(10, "0")}`;
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
  async function saveOrderData() {
    const currentDate = new Date();
    const formattedDate = formatDate(currentDate);
    const dataToSave = {
      barang: getItemKeys(order).map((key) => ({
        jumlah_barang: order[key].jumlah_barang,
        satuan_harga: order[key].satuan_harga,
        harga_akhir: itemData[key]?.input || order[key].satuan_harga,
        uraian: order[key].uraian,
        tambahan: itemData[key]?.additionalData.map((data) => ({
          description: data.description,
          harga: data.harga,
          jumlah: data.jumlah,
        })),
      })),
      cc: order.cc, // Replace with actual value
      date: formattedDate,
      procurement_status: "Pending", // Replace with actual value
      director_status: "Pending", // Replace with actual value
    };

    // Save or send dataToSave to the desired location
    console.log(dataToSave); // For demonstration purposes
    // Example: send data to an API endpoint
    // fetch('https://api.example.com/saveOrder', {
    //   method: 'POST',
    //   headers: {
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify(dataToSave),
    // })
    // .then(response => response.json())
    // .then(data => console.log('Success:', data))
    // .catch((error) => console.error('Error:', error));
    setSavedData(dataToSave); // Update the state with the saved data
    try {
      const newOrderId = generateNewOrderId(lastOrderId);
      const orderDoc = doc(db, "data_pertanggungjawaban", newOrderId);
      await setDoc(orderDoc, dataToSave);
      await setDoc(doc(db, "meta", "lastPertanggungjawabanId"), {
        lastPertanggungjawabanId: newOrderId,
      });
      setLastOrderId(newOrderId);

      Alert.alert("Success", "Orders have been added successfully.");
    } catch (error) {
      Alert.alert("Error", "Failed to add orders. Please try again.");
      console.error("Error adding orders: ", error);
    }
  }
  return (
    <ScrollView style={styles.container}>
      <Text style={styles.header}>Order Details</Text>
      <View style={styles.detailsContainer}>
        <Text>Order ID: {order.id}</Text>
        <Text>CC: {order.cc}</Text>
        <Text>Date: {order.date}</Text>
        <Text>Director Status: {order.director_status}</Text>
        <Text>Procurement Status: {order.procurement_status}</Text>
        <Text>Keperluan: {order.keperluan}</Text>
      </View>
      {savedData && (
        <View style={styles.savedDataContainer}>
          <Text style={styles.subHeader}>Saved Data:</Text>
          <Text>{JSON.stringify(savedData, null, 2)}</Text>
        </View>
      )}
      <TouchableOpacity style={styles.buttonText} onPress={saveOrderData}>
        <Text>Save Order Data</Text>
      </TouchableOpacity>
      <Text style={styles.subHeader}>Item Details:</Text>
      {getItemKeys(order).map((key) => (
        <View key={key} style={styles.itemContainer}>
          <Text style={styles.itemHeader}>Item {parseInt(key) + 1}</Text>
          <Text>Uraian: {order[key].uraian}</Text>
          <Text>Jumlah Barang: {order[key].jumlah_barang}</Text>
          <Text>Satuan Harga: {order[key].satuan_harga}</Text>
          <View style={styles.inputContainer}>
            <Text>Input Amount:</Text>
            <TextInput
              style={styles.input}
              keyboardType="numeric"
              value={itemData[key]?.input}
              onChangeText={(text) => handleInputChange(key, text)}
              placeholder="Enter amount"
            />
          </View>

          {itemData[key]?.additionalData.map((data, index) => (
            <View key={index} style={styles.additionalDataContainer}>
              <TextInput
                style={styles.input}
                value={data.description}
                onChangeText={(text) =>
                  updateAdditionalData(key, index, "description", text)
                }
                placeholder="Description"
              />
              <TextInput
                style={styles.input}
                value={data.harga}
                onChangeText={(text) =>
                  updateAdditionalData(key, index, "harga", text)
                }
                placeholder="Harga"
                keyboardType="numeric"
              />
              <TextInput
                style={styles.input}
                value={data.jumlah}
                onChangeText={(text) =>
                  updateAdditionalData(key, index, "jumlah", text)
                }
                placeholder="jumlah barang"
                keyboardType="numeric"
              />
              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => deleteAdditionalData(key, index)}
              >
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          ))}

          <TouchableOpacity
            style={styles.addButton}
            onPress={() => addAdditionalData(key)}
          >
            <Text style={styles.buttonText}>Add Others</Text>
          </TouchableOpacity>
        </View>
      ))}
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: "bold",
    marginBottom: 16,
  },
  subHeader: {
    fontSize: 20,
    fontWeight: "bold",
    marginTop: 16,
    marginBottom: 8,
  },
  detailsContainer: {
    backgroundColor: "#f0f0f0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 16,
  },
  itemContainer: {
    backgroundColor: "#e0e0e0",
    padding: 16,
    borderRadius: 8,
    marginBottom: 8,
  },
  itemHeader: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 8,
  },
  inputContainer: {
    marginTop: 8,
  },
  input: {
    height: 40,
    borderColor: "gray",
    borderWidth: 1,
    marginTop: 4,
    marginBottom: 4,
    paddingHorizontal: 8,
    borderRadius: 4,
  },
  additionalDataContainer: {
    marginTop: 8,
    borderTopWidth: 1,
    borderTopColor: "gray",
    paddingTop: 8,
  },
  addButton: {
    backgroundColor: "green",
    padding: 10,
    borderRadius: 5,
    marginTop: 8,
    alignItems: "center",
  },
  deleteButton: {
    backgroundColor: "red",
    padding: 10,
    borderRadius: 5,
    marginTop: 4,
    alignItems: "center",
  },
  buttonText: {
    color: "white",
    fontWeight: "bold",
  },
});

export default BuatPertanggungJawaban;
