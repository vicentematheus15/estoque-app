import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import { Picker } from '@react-native-picker/picker';
import api from '../services/api';

export default function CriarProdutoScreen({ navigation }) {
  const [nome, setNome] = useState('');
  const [categoria, setCategoria] = useState('Computador');
  const [preco, setPreco] = useState('');

  async function salvarProduto() {
    try {
      await api.post('/produtos', {
        nome_produto: nome,
        categoria,
        preco: Number(preco),
      });

      Alert.alert('Sucesso', 'Produto criado');
      navigation.goBack();
    } catch (error) {
      console.log('ERRO:', error.response?.data || error.message);
      Alert.alert('Erro', 'Falha ao criar produto');
    }
  }

  return (
    <View style={{ padding: 16 }}>
      <Text>Nome</Text>
      <TextInput value={nome} onChangeText={setNome} />

      <Text>Categoria</Text>
      <Picker selectedValue={categoria} onValueChange={setCategoria}>
        <Picker.Item label="Celular" value="Celular" />
        <Picker.Item label="Computador" value="Computador" />
        <Picker.Item label="Segurança" value="Segurança" />
        <Picker.Item label="Outro" value="Outro" />
      </Picker>

      <Text>Preço</Text>
      <TextInput
        value={preco}
        onChangeText={setPreco}
        keyboardType="numeric"
      />

      <Button title="Salvar" onPress={salvarProduto} />
    </View>
  );
}