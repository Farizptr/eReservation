import React, { useState } from "react";
import { View, TextInput, Button } from "react-native";

const RequestOrderScreen = () => {
  const [order, setOrder] = useState("");

  const handleOrderSubmit = () => {
    // Handle order submission logic here
    console.log("Order submitted:", order);
    // You can perform any necessary actions with the order data, such as sending it to a server
  };

  return (
    <View>
      <TextInput
        placeholder="Enter your order"
        value={order}
        onChangeText={setOrder}
      />
      <Button title="Submit Order" onPress={handleOrderSubmit} />
    </View>
  );
};

export default RequestOrderScreen;
