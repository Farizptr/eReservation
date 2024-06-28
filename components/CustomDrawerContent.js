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
      <TouchableOpacity
        style={{ margin: 20, padding: 10, backgroundColor: '#ccc' }}
        onPress={() => alert('Custom Button Pressed')}
      >
        <Text>Custom Button</Text>
      </TouchableOpacity>
    </DrawerContentScrollView>
  );
}
