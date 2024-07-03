// App.js
import "react-native-gesture-handler";
import React from "react";
import { NavigationContainer } from "@react-navigation/native";
import LoginScreen from "./src/screens/LoginScreen";
import OrderScreen from "./src/screens/OrderScreen";
import KeuanganScreen from "./src/screens/KeuanganScreen";
import ManageOrderScreen from "./src/screens/ManageOrderScreen";
import PengajuanScreen from "./src/screens/PengajuanScreen";
import PemesananScreen from "./src/screens/PemesananScreen";
import yourOrderScreen from "./src/screens/YourOrderScreen";
import ManagePengajuanScreen from "./src/screens/ManagePengajuanScreen";
import CustomDrawerContent from "./src/components/CustomDrawerContent";
import { RoleProvider } from "./src/context/RoleContext";
import { createDrawerNavigator } from "@react-navigation/drawer";
import ProcurementScreen from "./src/screens/ProcurementScreen";
import DirectorScreen from "./src/screens/DirectorScreen";
import DokumenPengajuanScreen from "./src/screens/DokumenPengajuanScreen";
import withRoleCheck from "./src/utils/withRoleCheck";


const Drawer = createDrawerNavigator();
export default function App() {
  return (
    <RoleProvider>
      <NavigationContainer>
        <Drawer.Navigator
          initialRouteName="Login"
          drawerContent={(props) => <CustomDrawerContent {...props} />}
        >
          <Drawer.Screen name="Login" component={LoginScreen} />
          <Drawer.Screen name="Order" component={OrderScreen} />
          <Drawer.Screen name="ManageOrder" component={ManageOrderScreen} />
          <Drawer.Screen name="Pemesanan" component={PemesananScreen} />
          <Drawer.Screen name="Pengajuan" component={PengajuanScreen} />
          <Drawer.Screen
            name="ManagePengajuan"
            component={ManagePengajuanScreen}
          />
          <Drawer.Screen name="Procurement" component={withRoleCheck(ProcurementScreen,["Head of Procurement","Procurement"])} />
          <Drawer.Screen name="Keuangan" component={withRoleCheck(KeuanganScreen,["Head of Finance","Finance"])} />
          <Drawer.Screen
            name="Director"
            component={withRoleCheck(DirectorScreen, ["Director"])}
          />
          <Drawer.Screen
            name="DokumenPengajuan"
            component={DokumenPengajuanScreen}
          />
          <Drawer.Screen name="YourOrder" component={yourOrderScreen} />
        </Drawer.Navigator>
      </NavigationContainer>
    </RoleProvider>
  );
}
