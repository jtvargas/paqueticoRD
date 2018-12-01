import React from 'react';
import { Platform } from 'react-native';
import { createStackNavigator, createBottomTabNavigator } from 'react-navigation';

import TabBarIcon from '../components/TabBarIcon';
import HomeScreen from '../screens/HomeScreen';
import CreditsCardScreen from '../screens/CreditsCardScreen';
import SettingsScreen from '../screens/SettingsScreen';
import RechargeScreen from '../screens/RechargeScreen';
import PaymentScreen from  '../screens/PaymentScreen';
import CheckoutScreen from '../screens/CheckoutScreen';
import NumberList from '../screens/NumberList';
import AddCardScreen from '../screens/addCreditScreen';

const HomeStack = createStackNavigator({
  Numbers: NumberList,
  Home: HomeScreen,
  Recharge: RechargeScreen,
  Payment: PaymentScreen,
  Checkout: CheckoutScreen,
 
});

HomeStack.navigationOptions = {
  tabBarLabel: 'Home',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={
        Platform.OS === 'ios'
          ? `ios-information-circle${focused ? '' : '-outline'}`
          : 'md-information-circle'
      }
    />
  ),
};

const CreditsCardStack = createStackNavigator({
  Links: CreditsCardScreen,
  AddCard: AddCardScreen
});

CreditsCardStack.navigationOptions = {
  tabBarLabel: 'Tarjetas',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-link' : 'md-link'}
    />
  ),
};

const SettingsStack = createStackNavigator({
  Settings: SettingsScreen,
});

SettingsStack.navigationOptions = {
  tabBarLabel: 'Settings',
  tabBarIcon: ({ focused }) => (
    <TabBarIcon
      focused={focused}
      name={Platform.OS === 'ios' ? 'ios-options' : 'md-options'}
    />
  ),
};


export default createBottomTabNavigator({
  HomeStack,
  CreditsCardStack,
  SettingsStack,
});
