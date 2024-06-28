// App.js
import "react-native-gesture-handler";
import React from "react";
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
import DataPengajuanScreen from "./screens/DataPengajuanScreen";
import CustomDrawerContent from "./components/CustomDrawerContent";
import { RoleProvider } from "./context/RoleContext";
import { createDrawerNavigator } from "@react-navigation/drawer";

const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <RoleProvider>
      <NavigationContainer>
        <Drawer.Navigator 
        initialRouteName="Login"
        drawerContent={(props) => <CustomDrawerContent {...props}/>}>
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Order" component={OrderScreen} />
          <Drawer.Screen name="ManageOrder" component={ManageOrderScreen} />
          <Drawer.Screen name="Pemesanan" component={PemesananScreen} />
          <Drawer.Screen name="Pengajuan" component={PengajuanScreen} />
          <Drawer.Screen
            name="ManagePengajuan"
            component={ManagePengajuanScreen}
          />
          <Drawer.Screen
            name="DataPengajuan"
            component={DataPengajuanScreen}/>
          <Drawer.Screen name="Request" component={RequestOrderScreen} />
          <Drawer.Screen name="KLogistik" component={KLogistikScreen} />
          <Drawer.Screen name="KKeuangan" component={KKeuanganScreen} />
          <Drawer.Screen name="Debug" component={DebugScreen} />
          <Drawer.Screen name="Logout" component={LogoutScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </RoleProvider>
  );
}
