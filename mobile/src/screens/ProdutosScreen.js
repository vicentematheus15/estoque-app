import { View, Text, Button } from 'react-native';
import { useContext } from 'react';
import { AuthContext } from '../context/AuthContext';

export default function ProdutosScreen() {
  const { user, signOut } = useContext(AuthContext);

  return (
    <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
      <Text>Bem-vindo!</Text>
      <Text>{user.email}</Text>
      <Text>Perfil: {user.nivel_acesso}</Text>

      <Button title="Sair" onPress={signOut} />
    </View>
  );
}
