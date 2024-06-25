import React, { useState, useRef } from 'react';
import { View, Text, TouchableOpacity, Animated, StyleSheet } from 'react-native';

const Sidebar = () => {
  const [isOpen, setIsOpen] = useState(false);
  const drawerAnimation = useRef(new Animated.Value(-240)).current; // Initial position

  const toggleDrawer = () => {
    if (isOpen) {
      // Close drawer
      Animated.timing(drawerAnimation, {
        toValue: -240,
        duration: 300,
        useNativeDriver: true,
      }).start();
    } else {
      // Open drawer
      Animated.timing(drawerAnimation, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }).start();
    }
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <Animated.View
        style={[
          styles.drawer,
          {
            transform: [{ translateX: drawerAnimation }],
          },
        ]}>
        <Text>Drawer Content</Text>
      </Animated.View>
      <TouchableOpacity onPress={toggleDrawer} style={styles.button}>
        <Text>{isOpen ? 'Close' : 'Open'} Drawer</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    alignItems: 'flex-start',
    justifyContent: 'center',
  },
  drawer: {
    position: 'absolute',
    left: 0,
    top: 0,
    bottom: 0,
    width: 240,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    elevation: 5,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
  },
  button: {
    padding: 10,
    backgroundColor: '#007bff',
    borderRadius: 5,
  },
});

export default Sidebar;