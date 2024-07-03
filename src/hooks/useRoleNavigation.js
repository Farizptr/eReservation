// src/hooks/useRoleNavigation.js
import { useNavigation } from '@react-navigation/native';
import { Alert } from 'react-native';

const useRoleNavigation = () => {
  const navigation = useNavigation();

  //
  const navigateBasedOnRole = (role) => {
    switch (role) {
      case 'Procurement':
        break;
      case 'Head of Procurement':
        navigation.navigate('Procurement');
        break;
      case 'Director':
        navigation.navigate('Director');
        break;
      case 'Finance':
        navigation.navigate('Keuangan');
        break;
      default:
        navigation.navigate('Order');
        break;
    }
    Alert.alert('Login Successful', `You have been logged in as ${role}!`);
  };

  return navigateBasedOnRole;
};

export default useRoleNavigation;
