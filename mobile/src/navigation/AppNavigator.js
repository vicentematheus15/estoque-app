import { useContext } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';

import { AuthContext } from '../context/AuthContext';

import LoginScreen from '../screens/LoginScreen';
import ProdutosScreen from '../screens/ProdutosScreen';
import ProdutoDetalheScreen from '../screens/ProdutoDetalheScreen';
import ProdutoCadastroScreen from '../screens/CriarProdutoScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  const { user } = useContext(AuthContext);

  return (
    <NavigationContainer>
      <Stack.Navigator>
        {!user ? (
          // 🔒 Não logado
          <Stack.Screen
            name="Login"
            component={LoginScreen}
            options={{ headerShown: false }}
          />
        ) : (
          // 🔓 Logado
          <>
            <Stack.Screen
              name="Produtos"
              component={ProdutosScreen}
              options={{ title: 'Produtos' }}
            />

            <Stack.Screen
              name="ProdutoDetalhe"
              component={ProdutoDetalheScreen}
              options={{ title: 'Detalhe do Produto' }}
            />

            <Stack.Screen
              name="ProdutoCadastro"
              component={ProdutoCadastroScreen}
              options={{ title: 'Cadastrar Produto' }}
              />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
}
