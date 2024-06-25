// App.js
import React from "react";
import "react-native-gesture-handler";
import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "./screens/LoginScreen";
import OrderScreen from "./screens/OrderScreen";
import DebugScreen from "./screens/DebugScreen";
import RequestOrderScreen from "./screens/RequestOrderScreen";
import KLogistikScreen from "./screens/KLogistikScreen";
import KKeuanganScreen from "./screens/KKeuanganScreen";
import ManageOrderScreen from "./screens/ManageOrderScreen";
import PengajuanScreen from "./screens/PengajuanScreen";
import PemesananScreen from "./screens/PemesananScreen";
import ManagePengajuanScreen from "./screens/ManagePengajuanScreen";
import LogoutScreen from "./screens/LogoutScreen";
import { RoleProvider } from "./context/RoleContext";

const Stack = createStackNavigator();
export default function App() {
  return (
    <RoleProvider>
      <NavigationContainer>
        <Stack.Navigator initialRouteName="Debug">
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Order" component={OrderScreen} />
          <Stack.Screen name="Request" component={RequestOrderScreen} />
          <Stack.Screen name="KLogistik" component={KLogistikScreen} />
          <Stack.Screen name="KKeuangan" component={KKeuanganScreen} />
          <Stack.Screen name="Debug" component={DebugScreen} />
          <Stack.Screen name="ManageOrder" component={ManageOrderScreen} />
          <Stack.Screen name="Pengajuan" component={PengajuanScreen} />
          <Stack.Screen
            name="ManagePengajuan"
            component={ManagePengajuanScreen}
          />
          <Stack.Screen name="Pemesanan" component={PemesananScreen} />
          <Stack.Screen name="Logout" component={LogoutScreen} />
        </Stack.Navigator>
      </NavigationContainer>
    </RoleProvider>
  );
}
