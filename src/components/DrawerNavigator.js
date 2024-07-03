import React from "react";
import { createDrawerNavigator } from "@react-navigation/drawer";
import { createStackNavigator } from "@react-navigation/stack";
import { Image } from 'react-native';
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
import CustomDrawerContent from "./CustomDrawerContent"; // Import the custom drawer content

const Drawer = createDrawerNavigator();
const Stack = createStackNavigator();



function MainStackNavigator() {
  return (
    <Stack.Navigator initialRouteName="Debug">
      <Stack.Screen
        name="Login"
        component={LoginScreen}
        options={screenOptionsWithImage}
      />
      <Stack.Screen
        name="Order"
        component={OrderScreen}
        options={screenOptionsWithImage}
      />
      <Stack.Screen
        name="Request"
        component={RequestOrderScreen}
        options={screenOptionsWithImage}
      />
      <Stack.Screen
        name="KLogistik"
        component={KLogistikScreen}
        options={screenOptionsWithImage}
      />
      <Stack.Screen
        name="KKeuangan"
        component={KKeuanganScreen}
        options={screenOptionsWithImage}
      />
      <Stack.Screen
        name="Debug"
        component={DebugScreen}
        options={screenOptionsWithImage}
      />
      <Stack.Screen
        name="ManageOrder"
        component={ManageOrderScreen}
        options={screenOptionsWithImage}
      />
      <Stack.Screen
        name="Pengajuan"
        component={PengajuanScreen}
        options={screenOptionsWithImage}
      />
      <Stack.Screen
        name="ManagePengajuan"
        component={ManagePengajuanScreen}
        options={screenOptionsWithImage}
      />
      <Stack.Screen
        name="Pemesanan"
        component={PemesananScreen}
        options={screenOptionsWithImage}
      />
      <Stack.Screen
        name="Logout"
        component={LogoutScreen}
        options={screenOptionsWithImage}
      />
    </Stack.Navigator>
  );
}

export default function DrawerNavigator() {
  return (
    <Drawer.Navigator
      initialRouteName="MainStack"
      drawerContent={(props) => <CustomDrawerContent {...props} />} // Use custom drawer content
    >
      <Drawer.Screen name="MainStack" component={MainStackNavigator} />
      <Drawer.Screen name="Debug" component={DebugScreen} />
      {/* Add other screens you want directly accessible from the drawer here */}
    </Drawer.Navigator>
  );
}
