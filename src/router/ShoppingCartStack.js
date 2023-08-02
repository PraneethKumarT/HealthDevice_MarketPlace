import React from 'react';
import {createStackNavigator} from '@react-navigation/stack';
import ShopingCart from '../Screens/ShoppingCart';
import AddressScreen from '../Screens/AddressScreen';

const Stack = createStackNavigator();

const ShoppingCartStack  = () => {
  return (
    <Stack.Navigator  screenOptions={{headerShown: false}}>
      <Stack.Screen
        component={ShopingCart}
        name="cart"
        options={{title: 'Shopping Cart'}}
      />
      <Stack.Screen
        component={AddressScreen}
        name="Address"
        options={{title: 'Address'}}

      />
    </Stack.Navigator>
  );
};

export default ShoppingCartStack ;