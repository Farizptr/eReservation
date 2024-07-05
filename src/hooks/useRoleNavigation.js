// src/hooks/useRoleNavigation.js
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const useRoleNavigation = () => {
  const navigation = useNavigation();

  //
  const navigateBasedOnRole = (role) => {
    switch (role) {
      default:
        navigation.navigate('Home');
        break;
    }
    Alert.alert('Login Successful', `You have been logged in as ${role}!`);
  };

  return navigateBasedOnRole;
};

export default useRoleNavigation;
