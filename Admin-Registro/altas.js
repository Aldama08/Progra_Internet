import React, { Component } from 'react';
import {
  Text,
  View,
  TextInput,
  Button,
  Image,
  StyleSheet,
} from 'react-native';
import { createClient } from '@supabase/supabase-js';
import * as ImagePicker from 'expo-image-picker';
import { decode } from 'base64-arraybuffer';

const supabaseUrl = 'https://ogftzavgyjiqunuomaih.supabase.co';
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9nZnR6YXZneWppcXVudW9tYWloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Mzk4OTI2NjYsImV4cCI6MjA1NTQ2ODY2Nn0.s6d1Zd_kRfxUdhuI3ywr9tOuM_Iq93iikEvA7fBEdPQ';
const supabase = createClient(supabaseUrl, supabaseKey);


export default class Altas extends Component {  
  constructor(props) {
    super(props);
    this.state = {
      filedata: '',
      fileUrl: '',
      producto: '',
      cantidad: '',
      descripcion: '',
      precio: '',
    };
  }

  fotos = async () => {
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images, //.Images
      allowsEditing: true,
      aspect: [4, 3],
      base64: true,
      quality: 1,
    });

    if (!result.canceled) {
      const image = result.assets[0];
      this.setState({ filedata: image.base64 });

      const { data, error } = await supabase.storage
        .from('imagenes') // Asegúrate de que el bucket se llame así
        .upload(foto_${Date.now()}.jpg, decode(image.base64), {
          contentType: 'image/jpeg',
        });

        if (error) {
          console.log("Error al subir imagen:", error);
        } else {
          console.log("Upload OK", data);
          const { data: publicUrlData } = supabase.storage
            .from('imagenes')
            .getPublicUrl(data.path);
        
          console.log("Public URL:", publicUrlData.publicUrl);
          this.setState({ fileUrl: publicUrlData.publicUrl });
          
        }
    }
  };

    Guardar = async () => {
    const { producto, cantidad, descripcion, precio, fileUrl } = this.state;

    // Validación de campos vacíos
    if (!producto || !cantidad || !precio || !descripcion || !fileUrl) {
      alert("⚠️ Todos los campos son obligatorios");
      return;
    }

    // Convertir a números
    const cantidadNum = parseInt(cantidad);
    const precioNum = parseFloat(precio);

    try {
      const { data, error } = await supabase
        .from('Productos')
        .insert([{
          producto: producto,
          cantidad: cantidadNum,
          descripcion: descripcion, // 🟢 Nombre correcto
          precio: precioNum,
          imagen: fileUrl
        }]);

      if (error) throw error;

      alert("✅ Producto guardado!");
      // Resetear campos
      this.setState({
        producto: '',
        cantidad: '',
        descripcion: '',
        precio: '',
        fileUrl: ''
      });

    } catch (error) {
      console.error("🚨 Error completo:", error);
      alert(`Error: ${error.message}`);
    }
  };

  renderFileData() {
    if (this.state.filedata) {
      return (
        <Image
          source={{ uri: 'data:image/png;base64,' + this.state.filedata }}
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
    return (
      <View style={{ padding: 20 }}>
        <Text style={styles.titleText}>Imagenes a cargar</Text>
        <View>{this.renderFileData()}</View>

        <View style={styles.buttonContainer}>
          <Button title="Galería de fotos" onPress={this.fotos} />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Producto:</Text>
          <TextInput
            style={styles.input}
            value={this.state.producto}
            onChangeText={(text) => this.setState({ producto: text })}
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Cantidad:</Text>
          <TextInput
            style={styles.input}
            value={this.state.cantidad}
            onChangeText={(text) => this.setState({ cantidad: text })}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Precio:</Text>
          <TextInput
            style={styles.input}
            value={this.state.precio}
            onChangeText={(text) => this.setState({ precio: text })}
            keyboardType="numeric"
          />
        </View>

        <View style={styles.inputGroup}>
          <Text style={styles.label}>Descripción:</Text>
          <TextInput
            style={styles.input}
            value={this.state.descripcion}
            onChangeText={(text) => this.setState({ descripcion: text })}
          />
        </View>

        <View style={styles.buttonContainer}>
          <Button title="Guardar" onPress={this.Guardar} />
        </View>
      </View>
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
    alignItems: 'center',
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
    borderWidth: 2,
    borderColor: 'red',
    borderRadius: 5,
    paddingHorizontal: 10,
    width: '90%',
    alignSelf: 'center',
  },
});