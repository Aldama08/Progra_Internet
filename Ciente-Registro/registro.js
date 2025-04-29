import React, { Component } from "react";
import { View, Text, TextInput, TouchableOpacity, StyleSheet, Alert, ImageBackground } from "react-native";
import { createClient } from '@supabase/supabase-js';

// Configuración de Supabase
const supabaseUrl = 'https://ogftzavgyjiqunuomaih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nZnR6YXZneWppcXVudW9tYWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTI2NjYsImV4cCI6MjA1NTQ2ODY2Nn0.s6d1Zd_kRfxUdhuI3ywr9tOuM_Iq93iikEvA7fBEdPQ';
const supabase = createClient(supabaseUrl, supabaseKey);

const  image = require('./images/Montania.png');

export default class Registro extends Component {
    constructor(props) {
        super(props);
        this.state = {
            nombre: "",
            email: "",
            password: ""
        };
    }

    // Método para manejar el registro
    handleRegister = async () => {
        const { nombre, email, password } = this.state;

        // Validar que todos los campos estén llenos
        if (!nombre || !email || !password) {
            Alert.alert("Error", "Por favor, completa todos los campos.");
            return;
        }

        try {
            // Insertar datos en Supabase
            const { data, error } = await supabase
                .from('Usuarios')
                .insert([
                    { nombre: nombre, email: email, password: password },
                ])
                .select();

            if (error) {
                Alert.alert("Error", error.message);
            } else {
                Alert.alert("Éxito", "Usuario registrado correctamente");
                console.log("Datos insertados:", data);
                // Limpiar el formulario después del registro
                this.setState({ nombre: "", email: "", password: "" });
            }
        } catch (error) {
            Alert.alert("Error", "Ocurrió un error al registrar el usuario.");
            console.error(error);
        }
    };

    render() {
        return (
            <View style={styles.container}>
                <Text style={styles.title}>Registro</Text>

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

// Estilos
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