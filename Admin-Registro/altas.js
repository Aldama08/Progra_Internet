import React, { Component } from 'react';
import { Text, View, TextInput, Button, Image, StyleSheet, Alert, ScrollView } from 'react-native';
import { createClient } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

const supabaseUrl = 'https://ogftzavgyjiqunuomaih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nZnR6YXZneWppcXVudW9tYWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTI2NjYsImV4cCI6MjA1NTQ2ODY2Nn0.s6d1Zd_kRfxUdhuI3ywr9tOuM_Iq93iikEvA7fBEdPQ';
const supabase = createClient(supabaseUrl, supabaseKey);

export default class ProductosCRUD extends Component {
  constructor(props) {
    super(props);
    this.state = {
      productos: [],
      filedata: '',
      fileUrl: '',
      producto: '',
      cantidad: '',
      descripcion: '',
      precio: '',
      editingId: null,
      searchTerm: ''
    };
  }

  componentDidMount() {
    this.cargarProductos();
  }

  cargarProductos = async () => {
    const { data, error } = await supabase
      .from('Productos')
      .select('*')
      .order('id', { ascending: true });``

    if (error) console.error("Error cargando productos:", error);
    else this.setState({ productos: data });
  };

  fotos = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      this.setState({ filedata: image.base64 });

      const filePath = `imagenes//foto_${Date.now()}.jpg`;
      const { data, error } = await supabase.storage
        .from('imagenes')
        .upload(filePath, decode(image.base64), {
          contentType: 'image/jpeg',
        });

      if (error) {
        console.error("Error subiendo imagen:", error);
        Alert.alert("Error", "No se pudo subir la imagen");
        return;
      }

      const publicUrl = `${supabaseUrl}/storage/v1/object/public/${filePath}`;
      this.setState({ fileUrl: publicUrl });
    }
  };

  handleSubmit = async () => {
    const { producto, cantidad, descripcion, precio, fileUrl, editingId } = this.state;

    if (!producto || !cantidad || !precio || !descripcion || !fileUrl) {
      Alert.alert("Error", "Todos los campos son obligatorios");
      return;
    }

    const productoData = {
      producto,
      cantidad: parseInt(cantidad),
      descripcion,
      precio: parseFloat(precio),
      imagen: fileUrl
    };

    try {
      if (editingId) {
        // Actualizar producto existente
        const { error } = await supabase
          .from('Productos')
          .update(productoData)
          .eq('id', editingId);

        if (error) throw error;
        Alert.alert("Éxito", "Producto actualizado correctamente");
      } else {
        // Crear nuevo producto
        const { error } = await supabase
          .from('Productos')
          .insert([productoData]);

        if (error) throw error;
        Alert.alert("Éxito", "Producto creado correctamente");
      }

      this.resetForm();
      this.cargarProductos();
    } catch (error) {
      console.error("Error:", error);
      Alert.alert("Error", error.message);
    }
  };

  editarProducto = (producto) => {
    this.setState({
      editingId: producto.id,
      producto: producto.producto,
      cantidad: producto.cantidad.toString(),
      descripcion: producto.descripcion,
      precio: producto.precio.toString(),
      fileUrl: producto.imagen,
      filedata: '' // Resetear filedata para evitar conflicto con la imagen existente
    });
  };

  eliminarProducto = async (id) => {
    Alert.alert(
      "Confirmar",
      "¿Estás seguro de que quieres eliminar este producto?",
      [
        { text: "Cancelar", style: "cancel" },
        {
          text: "Eliminar",
          style: "destructive",
          onPress: async () => {
            const { error } = await supabase
              .from('Productos')
              .delete()
              .eq('id', id);

            if (error) {
              console.error("Error eliminando:", error);
              Alert.alert("Error", "No se pudo eliminar el producto");
            } else {
              this.cargarProductos();
              Alert.alert("Éxito", "Producto eliminado");
            }
          }
        }
      ]
    );
  };

  resetForm = () => {
    this.setState({
      filedata: '',
      fileUrl: '',
      producto: '',
      cantidad: '',
      descripcion: '',
      precio: '',
      editingId: null
    });
  };

  renderFileData() {
    if (this.state.filedata) {
      return (
        <Image
          source={{ uri: 'data:image/png;base64,' + this.state.filedata }}
          style={styles.imagePreview}
        />
      );
    } else if (this.state.fileUrl) {
      return (
        <Image
          source={{ uri: this.state.fileUrl }}
          style={styles.imagePreview}
        />
      );
    } else {
      return (
        <Image
          source={require('./assets/dummy.jpg')}
          style={styles.imagePreview}
        />
      );
    }
  }

  render() {
    const { productos, producto, cantidad, descripcion, precio, editingId, searchTerm } = this.state;
    
    const filteredProductos = productos.filter(p => 
      p.producto.toLowerCase().includes(searchTerm.toLowerCase()) ||
      p.descripcion.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (      
    <ScrollView contentContainerStyle={{ paddingBottom: this.state.keyboardHeight + 20 }}
>        <Text style={styles.titleText}>
        {editingId ? 'EDITAR PRODUCTO' : 'NUEVO PRODUCTO'}
        </Text>

        {/* Formulario */}
        <View>{this.renderFileData()}</View>
        <View style={styles.buttonContainer}>
        <Button title="Seleccionar Imagen" onPress={this.fotos} />
        </View>

        <View style={styles.inputGroup}>
        <Text style={styles.label}>Producto:</Text>
        <TextInput
            style={styles.input}
            value={producto}
            onChangeText={(text) => this.setState({ producto: text })}
        />
        </View>

        <View style={styles.inputGroup}>
        <Text style={styles.label}>Cantidad:</Text>
        <TextInput
            style={styles.input}
            value={cantidad}
            onChangeText={(text) => this.setState({ cantidad: text })}
            keyboardType="numeric"
        />
        </View>

        <View style={styles.inputGroup}>
        <Text style={styles.label}>Precio:</Text>
        <TextInput
            style={styles.input}
            value={precio}
            onChangeText={(text) => this.setState({ precio: text })}
            keyboardType="numeric"
        />
        </View>

        <View style={styles.inputGroup}>
        <Text style={styles.label}>Descripción:</Text>
        <TextInput
            style={styles.input}
            value={descripcion}
            onChangeText={(text) => this.setState({ descripcion: text })}
            multiline
        />
        </View>

        <View style={styles.buttonContainer}>
        <Button 
            title={editingId ? "Actualizar" : "Guardar"} 
            onPress={this.handleSubmit} 
        />
        {editingId && (
            <Button 
            title="Cancelar" 
            onPress={this.resetForm}
            color="#999"
            />
        )}
        </View>

        {/* Lista de Productos */}
        <Text style={styles.sectionTitle}>LISTA DE PRODUCTOS</Text>
        
        <TextInput
        style={styles.searchInput}
        placeholder="Buscar productos..."
        value={searchTerm}
        onChangeText={(text) => this.setState({ searchTerm: text })}
        />

        {filteredProductos.map((item) => (
        <View key={item.id} style={styles.productItem}>
            <Image 
            source={{ uri: item.imagen }} 
            style={styles.productImage}
            />
            <View style={styles.productInfo}>
            <Text style={styles.productName}>{item.producto}</Text>
            <Text>Stock: {item.cantidad}</Text>
            <Text>Precio: ${item.precio}</Text>
            </View>
            <View style={styles.productActions}>
            <Button 
                title="✏️" 
                onPress={() => this.editarProducto(item)}
            />
            <Button 
                title="🗑️" 
                onPress={() => this.eliminarProducto(item.id)}
                color="red"
            />
            </View>
        </View>
        ))}
    </ScrollView>
    );
  }
}

const styles = StyleSheet.create({
  titleText: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    backgroundColor: '#3D8D7A',
    color: '#FFFAEC',
    padding: 10,
    marginBottom: 10,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 20,
    marginBottom: 10,
    color: '#3D8D7A',
  },
  imagePreview: {
    width: 150,
    height: 150,
    borderColor: 'black',
    borderWidth: 1,
    alignSelf: 'center',
    marginBottom: 20,
  },
  buttonContainer: {
    marginTop: 10,
    marginBottom: 10,
  },
  inputGroup: {
    marginTop: 15,
  },
  label: {
    fontSize: 16,
    marginBottom: 5,
    marginLeft: 10,
  },
  input: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    width: '100%',
  },
  searchInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },
  productItem: {
    flexDirection: 'row',
    padding: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  productImage: {
    width: 50,
    height: 50,
    marginRight: 10,
  },
  productInfo: {
    flex: 1,
  },
  productName: {
    fontWeight: 'bold',
  },
  productActions: {
    flexDirection: 'row',
  },
});