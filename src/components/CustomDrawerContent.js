import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

export default function CustomDrawerContent(props) {
  return (
    <DrawerContentScrollView {...props}>
      <View style={{ padding: 20 }}>
        <Text style={{ fontSize: 18, fontWeight: 'bold' }}>Custom Drawer</Text>
      </View>
      <DrawerItemList {...props} />
    </DrawerContentScrollView>
  );
}
