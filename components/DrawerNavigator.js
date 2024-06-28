// src/components/DrawerNavigator.js
import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import LoginScreen from "../screens/LoginScreen";
import OrderScreen from "../screens/OrderScreen";
import DebugScreen from "../screens/DebugScreen";
import RequestOrderScreen from "../screens/RequestOrderScreen";
import KLogistikScreen from "../screens/ProcurementScreen";
import KKeuanganScreen from "../screens/KeuanganScreen";
import ManageOrderScreen from "../screens/ManageOrderScreen";
import PengajuanScreen from "../screens/PengajuanScreen";
import PemesananScreen from "../screens/PemesananScreen";
import ManagePengajuanScreen from "../screens/ManagePengajuanScreen";
import LogoutScreen from "../screens/LogoutScreen";

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();

function MainStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Debug">
      <Stack.Screen name="Login" component={LoginScreen} />
      <Stack.Screen name="Order" component={OrderScreen} />
      <Stack.Screen name="Request" component={RequestOrderScreen} />
      <Stack.Screen name="KLogistik" component={KLogistikScreen} />
      <Stack.Screen name="KKeuangan" component={KKeuanganScreen} />
      <Stack.Screen name="Debug" component={DebugScreen} />
      <Stack.Screen name="ManageOrder" component={ManageOrderScreen} />
      <Stack.Screen name="Pengajuan" component={PengajuanScreen} />
      <Stack.Screen name="ManagePengajuan" component={ManagePengajuanScreen} />
      <Stack.Screen name="Pemesanan" component={PemesananScreen} />
      <Stack.Screen name="Logout" component={LogoutScreen} />
    </Stack.Navigator>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator initialRouteName="MainStack">
      <Drawer.Screen name="MainStack" component={MainStackNavigator} />
      <Drawer.Screen name="Debug" component={DebugScreen} />
      {/* Add other screens you want directly accessible from the drawer here */}
    </Drawer.Navigator>
  );
}
