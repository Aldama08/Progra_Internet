import { Text, View, Image, Button, FlatList, TouchableOpacity, StyleSheet } from 'react-native';
import React, { Component } from 'react';
import { createClient } from '@supabase/supabase-js';

export default class Productos extends Component {
  constructor(props) {
    super(props);
    this.state = {
      elementos: [],
      descripcionVisible: null, // Estado para controlar la visibilidad de la descripción
    };
  }

  async componentDidMount() {
    const supabaseUrl = 'https://ogftzavgyjiqunuomaih.supabase.co';
    const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nZnR6YXZneWppcXVudW9tYWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTI2NjYsImV4cCI6MjA1NTQ2ODY2Nn0.s6d1Zd_kRfxUdhuI3ywr9tOuM_Iq93iikEvA7fBEdPQ';
    const supabase = createClient(supabaseUrl, supabaseKey);

    let { data: Productos, error } = await supabase
      .from('Productos')
      .select('*');

    if (Productos !== null) {
      this.setState({ elementos: Productos });
    }
  }

  toggleDescripcion = (id) => {
    this.setState((prevState) => ({
      descripcionVisible: prevState.descripcionVisible === id ? null : id,
    }));
  };

  render() {
    return (
      <View style={styles.container}>
        <View style={{ height: 50 }}></View>

        <FlatList
          data={this.state.elementos}
          renderItem={({ item }) => (
            <View style={styles.productContainer}>
              <TouchableOpacity onPress={() => this.toggleDescripcion(item.id)}>
                <View style={styles.productImageContainer}>
                  <Image
                    style={styles.productImage}
                    source={{ uri: item.imagen }}
                  />
                </View>

                <View style={styles.productDetails}>
                  <Text style={styles.productName}>{item.producto}</Text>
                  <Text style={styles.productPrice}>${item.precio}</Text>
                  <Text style={styles.productQuantity}>Cantidad: {item.cantidad}</Text>
                </View>

                {/* Descripción que se sobrepone */}
                {this.state.descripcionVisible === item.id && (
                  <View style={styles.overlay}>
                    <Text style={styles.descriptionText}>{item.descripcion}</Text>
                    <TouchableOpacity
                      style={styles.closeButton}
                      onPress={() => this.toggleDescripcion(item.id)}
                    >
                      <Text style={styles.closeButtonText}>Cerrar</Text>
                    </TouchableOpacity>
                  </View>
                )}

                {/* Botón de comprar (oculto cuando la descripción está visible) */}
                {this.state.descripcionVisible !== item.id && (
                  <View style={styles.buyButtonContainer}>
                    <Button title="Comprar" />
                  </View>
                )}

                <View style={{ height: 20 }}></View>
              </TouchableOpacity>
            </View>
          )}
          keyExtractor={(item) => item.producto}
        />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  productContainer: {
    marginBottom: 20,
    borderWidth: 1,
    borderRadius: 10,
    overflow: 'hidden', 
  },
  productImageContainer: {
    height: 200,
    justifyContent: 'center',
    alignItems: 'center',
  },
  productImage: {
    width: 180,
    height: 180,
  },
  productDetails: {
    marginLeft: 20,
    marginTop: 10,
  },
  productName: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  productPrice: {
    fontSize: 14,
    color: 'green',
  },
  productQuantity: {
    fontSize: 14,
    color: 'gray',
  },
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(255, 255, 255, 0.9)', 
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  descriptionText: {
    fontSize: 16,
    textAlign: 'center',
  },
  closeButton: {
    marginTop: 20,
    padding: 10,
    backgroundColor: '#007BFF',
    borderRadius: 5,
  },
  closeButtonText: {
    color: 'white',
    fontSize: 16,
  },
  buyButtonContainer: {
    marginTop: 10,
    marginLeft: 20,
    marginRight: 40,
  },
});