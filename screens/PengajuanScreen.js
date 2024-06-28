import React, { useState } from "react";
import { TouchableOpacity } from "react-native";
import { View, Text, TextInput, ScrollView, StyleSheet } from "react-native";
import { collection, addDoc } from "firebase/firestore";
import { db } from "../firebase"; // Adjust the import path if needed
import { useRole } from "../context/RoleContext";

const PengajuanScreen = () => {
  const { role } = useRole();
  const [keperluan, setKeperluan] = useState("");

  const [pengajuan, setPengajuan] = useState([
    {
      uraian: "",
      jumlah: "",
      satuan_harga: "",
    },
  ]);

  const handlePengajuanOrder = () => {
    setPengajuan([
      ...pengajuan,
      {
        uraian: "",
        jumlah: "",
        satuan_harga: "",
      },
    ]);
  };

  const handlePengajuanChange = (text, index, field) => {
    const newPengajuan = [...pengajuan];
    newPengajuan[index][field] = text;
    setPengajuan(newPengajuan);
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
  const handlePlacePengajuan = async () => {
    console.log("Role: ", role);
    let modifiedPengajuan = { ...pengajuan }; // Copy the orders object
    let databaseName = "data_pengajuan";
    const currentDate = new Date(); // Step 1 & 2: Get current date in ISO string format
    const formattedDate = formatDate(currentDate);
    console.log(formattedDate);
    modifiedPengajuan.date = formattedDate;
    modifiedPengajuan.keperluan = keperluan;

    switch (role) {
      case "Procurement":
        modifiedPengajuan.headProcurementapproved = false;
        modifiedPengajuan.directorapproved = false;
        break;

      default:
        console.log("Role not recognized");
        return; // Exit the function if the role is not recognized
    }

    console.log("Modified Orders: ", modifiedPengajuan);

    try {
      const ordersCollection = collection(db, databaseName); // Reference to 'orders' collection
      // Add the entire orders array as one document in the "orders" collection
      await addDoc(ordersCollection, { modifiedPengajuan });

      console.log("Orders have been added successfully.");
      // Optionally, you can clear the form after successful submission
      setPengajuan([
        {
          uraian: "",
          jumlah: "",
          satuan_harga: "",
        },
      ]);
    } catch (error) {
      console.error("Error adding orders: ", error);
    }
  };

  const handleDeletePengajuan = (index) => {
    const newPengajuan = [...pengajuan];
    newPengajuan.splice(index, 1);
    setPengajuan(newPengajuan);
  };

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <TextInput
        style={styles.input}
        placeholder="Keperluan"
        value={keperluan}
        onChangeText={(text) => setKeperluan(text)}
      />
      {pengajuan.map((item, index) => (
        <View key={index} style={styles.orderInputContainer}>
          <TextInput
            style={styles.input}
            placeholder="Jumlah"
            keyboardType="numeric"
            value={item.jumlah}
            onChangeText={(text) =>
              handlePengajuanChange(text, index, "jumlah")
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Urairan"
            value={item.uraian}
            onChangeText={(text) =>
              handlePengajuanChange(text, index, "uraian")
            }
          />
          <TextInput
            style={styles.input}
            placeholder="Satuan harga"
            keyboardType="numeric"
            value={item.satuan_harga}
            onChangeText={(text) =>
              handlePengajuanChange(text, index, "satuan_harga")
            }
          />
          <TouchableOpacity
            style={styles.deleteButton}
            onPress={() => handleDeletePengajuan(index)}
          >
            <Text style={styles.deleteButtonText}>Delete</Text>
          </TouchableOpacity>
        </View>
      ))}
      <TouchableOpacity style={styles.button} onPress={handlePengajuanOrder}>
        <Text style={styles.buttonText}>Add another order</Text>
      </TouchableOpacity>
      <TouchableOpacity style={styles.button} onPress={handlePlacePengajuan}>
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

export default PengajuanScreen;
