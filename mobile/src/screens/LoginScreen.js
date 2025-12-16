import { View, Text, TextInput, Button, Alert } from 'react-native';
import { useState } from 'react';
import api from '../services/api';

export default function LoginScreen() {
  const [email, setEmail] = useState('');
  const [senha, setSenha] = useState('');

  async function handleLogin() {
    if (!email || !senha) {
      Alert.alert('Erro', 'Preencha email e senha');
      return;
    }

    try {
      const response = await api.post('/auth/login', {
        email,
        senha
      });

      console.log(response.data); // 🔍 importante agora

      Alert.alert('Sucesso', 'Login realizado com sucesso');

    } catch (error) {
      Alert.alert(
        'Erro',
        error.response?.data?.message || 'Erro ao conectar com o servidor'
      );
    }
  }

  return (
    <View style={{ padding: 20 }}>
      <Text>Email</Text>
      <TextInput
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
        style={{ borderWidth: 1, marginBottom: 10, padding: 8 }}
      />

      <Text>Senha</Text>
      <TextInput
        value={senha}
        onChangeText={setSenha}
        secureTextEntry
        style={{ borderWidth: 1, marginBottom: 20, padding: 8 }}
      />

      <Button title="Entrar" onPress={handleLogin} />
    </View>
  );
}
