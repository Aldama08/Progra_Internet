import React, { Component } from "react";
import { StyleSheet, Text, View, TextInput, TouchableOpacity, Alert, ImageBackground } from "react-native";
import { createClient } from '@supabase/supabase-js';
import * as Crypto from 'expo-crypto';


// Configuración de Supabase
const supabaseUrl = 'https://ogftzavgyjiqunuomaih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nZnR6YXZneWppcXVudW9tYWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTI2NjYsImV4cCI6MjA1NTQ2ODY2Nn0.s6d1Zd_kRfxUdhuI3ywr9tOuM_Iq93iikEvA7fBEdPQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const image = require('./images/Montania.png');

export default class Login extends Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
    }

    hashPassword = async (password) => {
        try {
            const digest = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                password
            );
            return digest;
        } catch (error) {
            throw error;
        }
    };

    handleLogin = async () => {
        const { email, password } = this.state;
      
        // Validar que todos los campos estén llenos
        if (!email || !password) {
          Alert.alert("Error", "Por favor, completa todos los campos.");
          return;
        }
        
      
        try {
          // Buscar al usuario en la tabla Usuarios
          const { data, error } = await supabase
            .from('Usuarios')
            .select('*')
            .eq('email', email)
            // .eq('password', password)
            .single();

          if (error) {
            Alert.alert("Error", error.message);
          } else if (!data) {
            Alert.alert("Error", "Correo o contraseña incorrectos.");
          } else {
            Alert.alert("Éxito", "Inicio de sesión exitoso");
            this.props.navigation.navigate('Productos'); // Navegar a Productos
          }
        } catch (error) {
          Alert.alert("Error", "Ocurrió un error al iniciar sesión.");
        }
      };

    ir_a = () => {
        this.props.navigation.navigate('Registro');
    };


    render() {
        return (
            <View style={styles.container}>

                <ImageBackground source={image} style={styles.image}></ImageBackground>
                <Text style={styles.title}>Hola!</Text>

                <TextInput
                    style={styles.input}
                    placeholder="Correo electrónico"
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    onChangeText={(text) => this.setState({ email: text })}
                    value={this.state.email}
                />

                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    onChangeText={(text) => this.setState({ password: text })}
                    value={this.state.password}
                />

                <TouchableOpacity style={styles.button} onPress={this.handleLogin}>
                    <Text style={styles.buttonText}>Iniciar Sesión</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={this.ir_a}>
                    <Text style={styles.link}>Crear cuenta</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#f5f5f5",
        justifyContent: "center",
        alignItems: "center",
        padding: 20,
    },
    image:{
        flex:1,
        justifyContent:'center',
        width: '120%',
        height: '110%',
        position: 'absolute',
        opacity: 0.6,
    },
    title: {
        fontSize: 28,
        fontWeight: "bold",
        color: "#333",
        marginBottom: 30,
    },
    input: {
        width: "100%",
        height: 50,
        backgroundColor: "#fff",
        borderRadius: 10,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
        elevation: 3, // Para Android
    },
    button: {
        width: "100%",
        backgroundColor: "#007bff",
        paddingVertical: 15,
        borderRadius: 10,
        alignItems: "center",
        marginTop: 10,
        shadowColor: "#000",
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 3,
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        fontSize: 16,
        color: "#007bff",
        fontWeight: "bold",
    },
});