import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import { createClient } from '@supabase/supabase-js';
import * as Crypto from 'expo-crypto';

// Configuración de Supabase
const supabaseUrl = 'https://ogftzavgyjiqunuomaih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nZnR6YXZneWppcXVudW9tYWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTI2NjYsImV4cCI6MjA1NTQ2ODY2Nn0.s6d1Zd_kRfxUdhuI3ywr9tOuM_Iq93iikEvA7fBEdPQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const image = require('./images/Montania.png');

export default class RegistroAdmin extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: "",
            email: "",
            password: ""
        };
    }

    // Función para encriptar la contraseña
    hashPassword = async (password) => {
        try {
            const digest = await Crypto.digestStringAsync(
                Crypto.CryptoDigestAlgorithm.SHA256,
                password
            );
            return digest;
        } catch (error) {
            console.error("Error al encriptar contraseña:", error);
            throw error;
        }
    };

    // Método para manejar el registro
    handleRegister = async () => {
        const { nombre, email, password } = this.state;

        if (!nombre || !email || !password) {
            Alert.alert("Error", "Por favor, completa todos los campos.");
            return;
        }

        try {
            // 1. Encriptar la contraseña
            const hashedPassword = await this.hashPassword(password);

            // 2. Verificar si el admin ya existe
            const { data: existingAdmin, error: lookupError } = await supabase
                .from('Admins')
                .select('email')
                .eq('email', email)
                .maybeSingle();

            if (lookupError) throw lookupError;
            if (existingAdmin) {
                Alert.alert("Error", "Este correo ya está registrado");
                return;
            }

            // 3. Insertar nuevo admin
            const { data, error } = await supabase
                .from('Admins') // Nombre exacto de la tabla
                .insert([
                    { 
                        nombre: nombre, 
                        email: email, 
                        password: hashedPassword // Guardamos la versión encriptada
                    }
                ])
                .select();

            if (error) {
                console.error("Error detallado:", {
                    message: error.message,
                    details: error.details,
                    code: error.code
                });
                throw error;
            }

            if (!data || data.length === 0) {
                throw new Error("No se recibió confirmación del servidor");
            }

            Alert.alert("Éxito", "Administrador registrado correctamente");
            console.log("Datos insertados:", data);
            this.setState({ nombre: "", email: "", password: "" });

        } catch (error) {
            console.error("Error completo:", error);
            Alert.alert("Error", `No se pudo registrar: ${error.message}`);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Registro de Administrador</Text>

                <ImageBackground source={image} style={styles.image}></ImageBackground>

                <TextInput
                    style={styles.input}
                    placeholder="Nombre"
                    placeholderTextColor="#aaa"
                    value={this.state.nombre}
                    onChangeText={(nombre) => this.setState({ nombre })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Correo Electrónico"
                    placeholderTextColor="#aaa"
                    keyboardType="email-address"
                    value={this.state.email}
                    onChangeText={(email) => this.setState({ email })}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Contraseña"
                    placeholderTextColor="#aaa"
                    secureTextEntry
                    value={this.state.password}
                    onChangeText={(password) => this.setState({ password })}
                />

                <TouchableOpacity style={styles.button} onPress={this.handleRegister}>
                    <Text style={styles.buttonText}>Registrarse</Text>
                </TouchableOpacity>

                <TouchableOpacity onPress={() => this.props.navigation.navigate("Login")}>
                    <Text style={styles.link}>Ya tengo una cuenta</Text>
                </TouchableOpacity>
            </View>
        );
    }
}

// Estilos (se mantienen igual)
const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: "#fff",
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
        marginBottom: 20,
    },
    input: {
        width: "100%",
        height: 50,
        borderWidth: 1,
        borderColor: "#ddd",
        borderRadius: 8,
        paddingHorizontal: 15,
        fontSize: 16,
        marginBottom: 15,
        backgroundColor: "#f9f9f9",
    },
    button: {
        backgroundColor: "#007bff",
        width: "100%",
        paddingVertical: 12,
        borderRadius: 8,
        alignItems: "center",
    },
    buttonText: {
        color: "#fff",
        fontSize: 18,
        fontWeight: "bold",
    },
    link: {
        marginTop: 15,
        color: "#007bff",
        fontSize: 16,
    }
});