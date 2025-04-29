import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import Login from './login';
import Registro from './registro';
import Altas from './altas';


const Stack = createNativeStackNavigator();

export default function Menu() {
    return (
        <Stack.Navigator>
            <Stack.Screen name="Login" component={Login} />
            <Stack.Screen name="Registro" component={Registro} />
            <Stack.Screen name="Altas" component={Altas} />
        </Stack.Navigator>
    );
}
