import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login';
import Registro from './registro';
import Productos from './producto';

const Stack = createNativeStackNavigator();

export default function Menu() {
  return (
    <Stack.Navigator>
      <Stack.Screen name="Login" component={Login} />
      <Stack.Screen name="Registro" component={Registro} />
      <Stack.Screen name="Productos" component={Productos} />
    </Stack.Navigator>
  );
}
